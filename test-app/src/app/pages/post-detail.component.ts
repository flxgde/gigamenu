import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Post Comment</h2>
      <div class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg space-y-2">
        <p class="text-neutral-600 dark:text-neutral-400">
          Post ID: <strong class="text-neutral-900 dark:text-neutral-100">{{ postId() }}</strong>
        </p>
        <p class="text-neutral-600 dark:text-neutral-400">
          Comment ID: <strong class="text-neutral-900 dark:text-neutral-100">{{ commentId() }}</strong>
        </p>
      </div>
      <p class="text-sm text-neutral-500">
        This page was reached by typing "post &lt;id&gt; &lt;commentId&gt;" in the command palette.
      </p>
    </div>
  `,
})
export class PostDetailComponent {
  private readonly route = inject(ActivatedRoute);
  postId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
  commentId = toSignal(this.route.paramMap.pipe(map(params => params.get('commentId'))));
}
