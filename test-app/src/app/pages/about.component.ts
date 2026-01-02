import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">About</h2>
      <p class="text-neutral-600 dark:text-neutral-400">
        Gigamenu is a keyboard-driven command palette for Angular applications.
      </p>
    </div>
  `,
})
export class AboutComponent {}
