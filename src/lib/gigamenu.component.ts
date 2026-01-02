import {
  Component,
  signal,
  computed,
  effect,
  ElementRef,
  viewChild,
  contentChild,
  HostListener,
  PLATFORM_ID,
  Inject,
  TemplateRef,
} from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { GigamenuService } from './gigamenu.service';
import { FrecencyService } from './frecency.service';
import { GigamenuItem, PARAM_COLORS } from './types';
import {
  GigamenuItemTemplate,
  GigamenuEmptyTemplate,
  GigamenuHeaderTemplate,
  GigamenuFooterTemplate,
  GigamenuPanelTemplate,
  GigamenuItemContext,
  GigamenuEmptyContext,
  GigamenuHeaderContext,
  GigamenuFooterContext,
  GigamenuPanelContext,
} from './gigamenu-templates.directive';

@Component({
  selector: 'gm-gigamenu',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: 'gigamenu.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class GigamenuComponent {
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly listContainer = viewChild<ElementRef<HTMLDivElement>>('listContainer');
  private readonly isBrowser: boolean;

  // Template queries
  protected readonly itemTemplate = contentChild(GigamenuItemTemplate);
  protected readonly emptyTemplate = contentChild(GigamenuEmptyTemplate);
  protected readonly headerTemplate = contentChild(GigamenuHeaderTemplate);
  protected readonly footerTemplate = contentChild(GigamenuFooterTemplate);
  protected readonly panelTemplate = contentChild(GigamenuPanelTemplate);

  protected readonly query = signal('');
  protected readonly selectedIndex = signal(0);

  /** Parsed search term (before first separator) */
  protected readonly searchTerm = computed(() => {
    const q = this.query();
    const separator = this.service.config().argSeparator ?? ' ';
    const sepIndex = q.indexOf(separator);
    if (sepIndex === -1) return q;
    return q.substring(0, sepIndex);
  });

  /** Parsed arguments (after first separator) */
  protected readonly args = computed(() => {
    const q = this.query();
    const separator = this.service.config().argSeparator ?? ' ';
    const sepIndex = q.indexOf(separator);
    if (sepIndex === -1) return '';
    return q.substring(sepIndex + separator.length);
  });

  /** Whether the query contains a separator (for display purposes) */
  protected readonly hasSeparator = computed(() => {
    const q = this.query();
    const separator = this.service.config().argSeparator ?? ' ';
    return q.includes(separator);
  });

  /** Parsed arguments as array */
  protected readonly argsArray = computed(() => {
    const args = this.args();
    if (!args) return [];
    return args.split(/\s+/).filter(Boolean);
  });

  /** Currently selected item */
  protected readonly selectedItem = computed(() => {
    const items = this.filteredItems();
    const index = this.selectedIndex();
    return items[index] ?? null;
  });

  /** Whether the selected item can be executed (has all required params) */
  protected readonly canExecute = computed(() => {
    const item = this.selectedItem();
    if (!item) return false;
    if (!item.params || item.params.length === 0) return true;
    return this.argsArray().length >= item.params.length;
  });

  /** Get color class for a parameter index */
  protected getParamColor(index: number): string {
    return PARAM_COLORS[index % PARAM_COLORS.length];
  }

  protected readonly filteredItems = computed(() => {
    const searchTerm = this.searchTerm().toLowerCase().trim();
    const items = this.service.items();
    const maxResults = this.service.config().maxResults ?? 10;

    if (!searchTerm) {
      // No query: sort by frecency scores from empty searches
      const scores = this.frecency.getScores('');
      return this.sortByFrecency(items, scores).slice(0, maxResults);
    }

    // Filter matching items using only search term (not args)
    const matched = items.filter((item) => this.matchesQuery(item, searchTerm));

    // Sort by frecency for this search term
    const scores = this.frecency.getScores(searchTerm);
    return this.sortByFrecency(matched, scores).slice(0, maxResults);
  });

  constructor(
    protected readonly service: GigamenuService,
    private readonly frecency: FrecencyService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => {
      if (this.service.isOpen() && this.isBrowser) {
        setTimeout(() => this.searchInput()?.nativeElement.focus(), 0);
      }
    });

    effect(() => {
      const items = this.filteredItems();
      const searchTerm = this.searchTerm();

      // Check for auto-select based on frecency
      if (searchTerm && items.length > 0) {
        const topMatch = this.frecency.getTopMatch(searchTerm);
        if (topMatch) {
          const idx = items.findIndex((item) => item.id === topMatch);
          if (idx !== -1) {
            this.selectedIndex.set(idx);
            return;
          }
        }
      }

      this.selectedIndex.set(0);
    });
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;

    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.service.toggle();
      return;
    }

    if (event.key === '/' && !this.isInputFocused()) {
      event.preventDefault();
      this.service.open();
      return;
    }

    if (event.key === 'Escape' && this.service.isOpen()) {
      event.preventDefault();
      this.close();
    }
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    const items = this.filteredItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update((i) => Math.min(i + 1, items.length - 1));
        this.scrollSelectedIntoView();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update((i) => Math.max(i - 1, 0));
        this.scrollSelectedIntoView();
        break;

      case 'Enter':
        event.preventDefault();
        if (this.canExecute()) {
          const selected = items[this.selectedIndex()];
          if (selected) {
            this.executeItem(selected);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  private scrollSelectedIntoView(): void {
    const container = this.listContainer()?.nativeElement;
    if (!container) return;

    const selectedButton = container.querySelector(
      `[data-index="${this.selectedIndex()}"]`
    ) as HTMLElement | null;

    if (selectedButton) {
      selectedButton.scrollIntoView({ block: 'nearest' });
    }
  }

  protected onQueryChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  protected executeItem(item: GigamenuItem): void {
    // Record the selection for frecency learning (use search term, not full query)
    const searchTerm = this.searchTerm();
    this.frecency.recordSelection(searchTerm, item.id);

    // Get args before closing (which resets query)
    const args = this.args() || undefined;

    this.close();
    item.action(args);
  }

  // Template context getters
  protected getItemContext(item: GigamenuItem, index: number): GigamenuItemContext {
    return {
      $implicit: item,
      index,
      selected: this.selectedIndex() === index,
    };
  }

  protected getEmptyContext(): GigamenuEmptyContext {
    return {
      $implicit: this.query(),
    };
  }

  protected getHeaderContext(): GigamenuHeaderContext {
    return {
      $implicit: this.query(),
      searchTerm: this.searchTerm(),
      args: this.args(),
      hasSeparator: this.hasSeparator(),
      onQueryChange: (value: string) => this.query.set(value),
      onKeydown: (event: KeyboardEvent) => this.onInputKeydown(event),
      placeholder: this.service.config().placeholder ?? '',
    };
  }

  protected getFooterContext(): GigamenuFooterContext {
    return {
      $implicit: this.filteredItems().length,
      total: this.service.items().length,
    };
  }

  protected getPanelContext(): GigamenuPanelContext {
    return {
      $implicit: this.filteredItems(),
      query: this.query(),
      searchTerm: this.searchTerm(),
      args: this.args(),
      hasSeparator: this.hasSeparator(),
      selectedIndex: this.selectedIndex(),
      executeItem: (item: GigamenuItem) => this.executeItem(item),
      setSelectedIndex: (index: number) => this.selectedIndex.set(index),
      setQuery: (query: string) => this.query.set(query),
      close: () => this.close(),
      placeholder: this.service.config().placeholder ?? '',
    };
  }

  private close(): void {
    this.service.close();
    this.query.set('');
    this.selectedIndex.set(0);
  }

  private sortByFrecency(items: GigamenuItem[], scores: Map<string, number>): GigamenuItem[] {
    if (scores.size === 0) return items;

    return [...items].sort((a, b) => {
      const scoreA = scores.get(a.id) ?? 0;
      const scoreB = scores.get(b.id) ?? 0;
      return scoreB - scoreA;
    });
  }

  private matchesQuery(item: GigamenuItem, query: string): boolean {
    const searchableText = [
      item.label,
      item.description,
      ...(item.keywords ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const words = query.split(/\s+/);
    return words.every((word) => searchableText.includes(word));
  }

  private isInputFocused(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      (activeElement as HTMLElement).isContentEditable
    );
  }
}
