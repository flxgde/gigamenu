import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Home</h2>
      <p class="text-neutral-600 dark:text-neutral-400">
        Welcome to the Gigamenu test application. This app demonstrates the command palette functionality.
      </p>
      <div class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
        <h3 class="font-medium mb-2">Test Cases:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>Type "about" and press Enter to navigate</li>
          <li>Type "toggle" to find the theme toggle command</li>
          <li>Type "alert hello world" to test args (shows "hello world")</li>
          <li>Type "user 123" to navigate to /users/123</li>
          <li>Type "post 42 7" to navigate to /posts/42/comments/7</li>
        </ul>
      </div>
    </div>
  `,
})
export class HomeComponent {}
