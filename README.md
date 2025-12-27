# Gigamenu

A keyboard-driven command palette menu for Angular applications. Inspired by VS Code's Command Palette, Spotlight, and Linear's command menu.

## Features

- Keyboard shortcuts: `Ctrl/Cmd+K` and `/` (when no input is focused)
- Auto-discovery of routes from Angular Router
- Manual command registration API
- Full keyboard navigation (arrow keys, Enter, Escape)
- Fuzzy search filtering
- Dark mode support
- Tailwind CSS styling

## Installation

```bash
npm install gigamenu
```

## Usage

### 1. Import the component

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { GigamenuComponent, GigamenuService } from 'gigamenu';

@Component({
  selector: 'app-root',
  imports: [GigamenuComponent],
  template: `
    <router-outlet />
    <gm-gigamenu />
  `,
})
export class App implements OnInit {
  private readonly gigamenu = inject(GigamenuService);

  ngOnInit(): void {
    // Auto-discover routes from Angular Router
    this.gigamenu.discoverRoutes();
  }
}
```

### 2. Register custom commands

```typescript
this.gigamenu.registerCommand({
  id: 'cmd:toggle-dark',
  label: 'Toggle Dark Mode',
  description: 'Switch between light and dark theme',
  icon: '🌙',
  keywords: ['theme', 'dark', 'light'],
  action: () => document.documentElement.classList.toggle('dark'),
});
```

### 3. Register custom pages

```typescript
this.gigamenu.registerPage({
  id: 'page:dashboard',
  label: 'Dashboard',
  path: '/dashboard',
  description: 'Go to the main dashboard',
});
```

## API

### GigamenuService

| Method | Description |
|--------|-------------|
| `open()` | Open the menu |
| `close()` | Close the menu |
| `toggle()` | Toggle menu visibility |
| `discoverRoutes(routes?)` | Auto-discover pages from Angular Router |
| `registerCommand(command)` | Register a custom command |
| `registerPage(page)` | Register a custom page |
| `registerItem(item)` | Register a generic menu item |
| `unregisterItem(id)` | Remove an item by ID |
| `configure(config)` | Update configuration |

### Configuration

```typescript
interface GigamenuConfig {
  placeholder?: string;      // Search input placeholder
  maxResults?: number;       // Maximum items to show (default: 10)
  autoDiscoverRoutes?: boolean; // Auto-discover on init
}
```

### Types

```typescript
interface GigamenuItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  keywords?: string[];
  category: 'page' | 'command';
  action: () => void;
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+K` | Open menu |
| `/` | Open menu (when no input focused) |
| `↑` / `↓` | Navigate items |
| `Enter` | Execute selected item |
| `Escape` | Close menu |

## Styling

Gigamenu uses Tailwind CSS and supports dark mode via the `dark` class on `<html>`.

## License

MIT
