import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { GigamenuComponent, GigamenuService } from '@flxgde/gigamenu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GigamenuComponent],
  template: `
    <div class="p-8">
      <header class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Gigamenu Test App</h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          Press <kbd class="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded">Ctrl+K</kbd> or
          <kbd class="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded">/</kbd> to open the command palette
        </p>
      </header>

      <main>
        <router-outlet />
      </main>
    </div>

    <gm-gigamenu />
  `,
})
export class AppComponent implements OnInit {
  private readonly gigamenu = inject(GigamenuService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Set the router for navigation features
    this.gigamenu.setRouter(this.router);

    // Configure the menu
    this.gigamenu.configure({
      placeholder: 'Search pages and commands...',
      maxResults: 10,
    });

    // Auto-discover routes from the router
    this.gigamenu.discoverRoutes();

    // Register some custom commands
    this.gigamenu.registerCommand({
      id: 'cmd:toggle-theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      icon: '🌓',
      keywords: ['dark', 'light', 'mode'],
      action: () => {
        this.gigamenu.toggleDarkMode();
      },
    });

    this.gigamenu.registerCommand({
      id: 'cmd:alert',
      label: 'Show Alert',
      description: 'Display an alert with custom message',
      icon: '💬',
      keywords: ['message', 'popup'],
      action: (args) => {
        alert(args || 'Hello from Gigamenu!');
      },
    });

    this.gigamenu.registerCommand({
      id: 'cmd:copy-url',
      label: 'Copy Current URL',
      description: 'Copy the current page URL to clipboard',
      icon: '📋',
      keywords: ['clipboard', 'link'],
      action: () => {
        navigator.clipboard.writeText(window.location.href);
      },
    });
  }
}
