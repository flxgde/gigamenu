import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">User Details</h2>
      <div class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
        <p class="text-neutral-600 dark:text-neutral-400">
          User ID: <strong class="text-neutral-900 dark:text-neutral-100">{{ userId() }}</strong>
        </p>
      </div>
      <p class="text-sm text-neutral-500">
        This page was reached by typing "user &lt;id&gt;" in the command palette.
      </p>
    </div>
  `,
})
export class UserDetailComponent {
  private readonly route = inject(ActivatedRoute);
  userId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
}
