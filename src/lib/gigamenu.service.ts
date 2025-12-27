import { Injectable, signal, computed } from '@angular/core';
import { Router, Route, Routes } from '@angular/router';
import {
  GigamenuItem,
  GigamenuCommand,
  GigamenuPage,
  GigamenuConfig,
  DEFAULT_CONFIG,
  DiscoverRoutesOptions,
  RouteInfo,
} from './types';

@Injectable({ providedIn: 'root' })
export class GigamenuService {
  private readonly _items = signal<Map<string, GigamenuItem>>(new Map());
  private readonly _isOpen = signal(false);
  private readonly _config = signal<GigamenuConfig>(DEFAULT_CONFIG);

  readonly items = computed(() => Array.from(this._items().values()));
  readonly isOpen = this._isOpen.asReadonly();
  readonly config = this._config.asReadonly();

  constructor(private readonly router: Router) {}

  configure(config: Partial<GigamenuConfig>): void {
    this._config.update((current) => ({ ...current, ...config }));
  }

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  toggle(): void {
    this._isOpen.update((v) => !v);
  }

  registerItem(item: GigamenuItem): void {
    this._items.update((items) => {
      const newItems = new Map(items);
      newItems.set(item.id, item);
      return newItems;
    });
  }

  unregisterItem(id: string): void {
    this._items.update((items) => {
      const newItems = new Map(items);
      newItems.delete(id);
      return newItems;
    });
  }

  registerCommand(command: GigamenuCommand): void {
    this.registerItem({
      ...command,
      category: 'command',
    });
  }

  registerPage(page: GigamenuPage): void {
    this.registerItem({
      ...page,
      category: 'page',
      action: () => this.router.navigate([page.path]),
    });
  }

  discoverRoutes(options?: DiscoverRoutesOptions): void;
  discoverRoutes(routes?: Routes, options?: DiscoverRoutesOptions): void;
  discoverRoutes(
    routesOrOptions?: Routes | DiscoverRoutesOptions,
    maybeOptions?: DiscoverRoutesOptions
  ): void {
    let routes: Routes;
    let options: DiscoverRoutesOptions | undefined;

    if (Array.isArray(routesOrOptions)) {
      routes = routesOrOptions;
      options = maybeOptions;
    } else {
      routes = this.router.config;
      options = routesOrOptions;
    }

    this.extractPagesFromRoutes(routes, '', options?.filter);
  }

  private extractPagesFromRoutes(
    routes: Routes,
    parentPath: string,
    filter?: (route: RouteInfo) => boolean
  ): void {
    for (const route of routes) {
      if (route.redirectTo !== undefined) continue;

      const fullPath = parentPath
        ? `${parentPath}/${route.path ?? ''}`
        : route.path ?? '';

      if (route.path !== undefined && route.path !== '**') {
        const routeInfo: RouteInfo = {
          path: route.path,
          fullPath: `/${fullPath}`,
          data: route.data as Record<string, unknown> | undefined,
          title: typeof route.title === 'string' ? route.title : undefined,
        };

        // Apply filter if provided
        if (filter && !filter(routeInfo)) {
          // Still process children even if this route is filtered
          if (route.children) {
            this.extractPagesFromRoutes(route.children, fullPath, filter);
          }
          continue;
        }

        const label = routeInfo.title || this.pathToLabel(route.path || 'Home');
        this.registerPage({
          id: `page:${fullPath || '/'}`,
          label,
          path: `/${fullPath}`,
          description: `Navigate to ${label}`,
        });
      }

      if (route.children) {
        this.extractPagesFromRoutes(route.children, fullPath, filter);
      }
    }
  }

  private pathToLabel(path: string): string {
    return path
      .split('/')
      .pop()!
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
