import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Settings</h2>
      <p class="text-neutral-600 dark:text-neutral-400">
        Application settings would go here.
      </p>
    </div>
  `,
})
export class SettingsComponent {}
