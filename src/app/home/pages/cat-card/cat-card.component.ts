import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Cat } from '../../services/cats.service';

@Component({
  selector: 'app-cat-card',
  standalone: true,
  template: `
    <div class="overflow-hidden rounded-xl bg-dracula-current shadow-lg shadow-black/20 transition hover:shadow-xl hover:shadow-black/30">
      <img
        [src]="cat().image_url"
        [alt]="cat().name"
        class="h-40 w-full object-cover sm:h-48 lg:h-52"
      />
      <div class="p-4 sm:p-5">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-lg font-bold text-dracula-purple sm:text-xl">{{ cat().name }}</h3>
          <span class="rounded-full bg-dracula-purple/20 px-2.5 py-0.5 text-xs font-medium text-dracula-purple sm:text-sm">
            {{ formatAge(cat().age_months) }}
          </span>
        </div>
        <p class="mb-2 text-xs font-medium text-dracula-cyan sm:text-sm">{{ cat().breed }}</p>
        <p class="text-xs leading-relaxed text-dracula-fg/80 sm:text-sm">{{ cat().description }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatCardComponent {
  readonly cat = input.required<Cat>();

  formatAge(months: number): string {
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remaining = months % 12;
    if (remaining === 0) return years === 1 ? '1 año' : `${years} años`;
    return `${years}a ${remaining}m`;
  }
}
