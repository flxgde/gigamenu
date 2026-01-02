import { Directive, TemplateRef, inject } from '@angular/core';
import { GigamenuItem } from './types';

/**
 * Context provided to the item template.
 */
export interface GigamenuItemContext {
  /** The menu item being rendered */
  $implicit: GigamenuItem;
  /** The index of the item in the filtered list */
  index: number;
  /** Whether this item is currently selected */
  selected: boolean;
}

/**
 * Context provided to the empty template.
 */
export interface GigamenuEmptyContext {
  /** The current search query */
  $implicit: string;
}

/**
 * Context provided to the header template.
 */
export interface GigamenuHeaderContext {
  /** The current full query */
  $implicit: string;
  /** The search term (before separator) */
  searchTerm: string;
  /** The arguments (after separator) */
  args: string;
  /** Whether the query contains a separator */
  hasSeparator: boolean;
  /** Callback to update the query */
  onQueryChange: (value: string) => void;
  /** Callback for keydown events */
  onKeydown: (event: KeyboardEvent) => void;
  /** Placeholder text */
  placeholder: string;
}

/**
 * Context provided to the footer template.
 */
export interface GigamenuFooterContext {
  /** Number of filtered items */
  $implicit: number;
  /** Total number of items */
  total: number;
}

/**
 * Template directive for customizing menu item rendering.
 *
 * @example
 * ```html
 * <gm-gigamenu>
 *   <ng-template gmItem let-item let-selected="selected" let-index="index">
 *     <div [class.active]="selected">
 *       {{ item.label }}
 *     </div>
 *   </ng-template>
 * </gm-gigamenu>
 * ```
 */
@Directive({
  selector: '[gmItem]',
  standalone: true,
})
export class GigamenuItemTemplate {
  readonly template = inject<TemplateRef<GigamenuItemContext>>(TemplateRef);
}

/**
 * Template directive for customizing empty state rendering.
 *
 * @example
 * ```html
 * <gm-gigamenu>
 *   <ng-template gmEmpty let-query>
 *     <div>No results for "{{ query }}"</div>
 *   </ng-template>
 * </gm-gigamenu>
 * ```
 */
@Directive({
  selector: '[gmEmpty]',
  standalone: true,
})
export class GigamenuEmptyTemplate {
  readonly template = inject<TemplateRef<GigamenuEmptyContext>>(TemplateRef);
}

/**
 * Template directive for customizing header/search input rendering.
 *
 * @example
 * ```html
 * <gm-gigamenu>
 *   <ng-template gmHeader let-query let-onQueryChange="onQueryChange" let-onKeydown="onKeydown">
 *     <input [value]="query" (input)="onQueryChange($event.target.value)" (keydown)="onKeydown($event)" />
 *   </ng-template>
 * </gm-gigamenu>
 * ```
 */
@Directive({
  selector: '[gmHeader]',
  standalone: true,
})
export class GigamenuHeaderTemplate {
  readonly template = inject<TemplateRef<GigamenuHeaderContext>>(TemplateRef);
}

/**
 * Template directive for customizing footer rendering.
 *
 * @example
 * ```html
 * <gm-gigamenu>
 *   <ng-template gmFooter let-count let-total="total">
 *     <div>Showing {{ count }} of {{ total }} items</div>
 *   </ng-template>
 * </gm-gigamenu>
 * ```
 */
@Directive({
  selector: '[gmFooter]',
  standalone: true,
})
export class GigamenuFooterTemplate {
  readonly template = inject<TemplateRef<GigamenuFooterContext>>(TemplateRef);
}

/**
 * Template directive for customizing the entire panel/dialog container.
 * When provided, replaces the entire default panel structure.
 *
 * @example
 * ```html
 * <gm-gigamenu>
 *   <ng-template gmPanel let-items let-query="query" let-selectedIndex="selectedIndex">
 *     <div class="my-custom-panel">
 *       <!-- Custom implementation -->
 *     </div>
 *   </ng-template>
 * </gm-gigamenu>
 * ```
 */
export interface GigamenuPanelContext {
  /** Filtered items to display */
  $implicit: GigamenuItem[];
  /** Current full query */
  query: string;
  /** The search term (before separator) */
  searchTerm: string;
  /** The arguments (after separator) */
  args: string;
  /** Whether the query contains a separator */
  hasSeparator: boolean;
  /** Currently selected index */
  selectedIndex: number;
  /** Callback to execute an item */
  executeItem: (item: GigamenuItem) => void;
  /** Callback to update selection */
  setSelectedIndex: (index: number) => void;
  /** Callback to update query */
  setQuery: (query: string) => void;
  /** Callback to close the menu */
  close: () => void;
  /** Placeholder text from config */
  placeholder: string;
}

@Directive({
  selector: '[gmPanel]',
  standalone: true,
})
export class GigamenuPanelTemplate {
  readonly template = inject<TemplateRef<GigamenuPanelContext>>(TemplateRef);
}
