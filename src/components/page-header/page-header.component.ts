import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-shrink-0 mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ title() }}</h1>
      @if (description()) {
        <p class="text-gray-500 mt-1 max-w-2xl">{{ description() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  title = input.required<string>();
  description = input<string>();
}
