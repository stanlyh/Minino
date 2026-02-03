import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AdoptionStats } from '../../services/cats.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  template: `
    <div class="grid grid-cols-2 gap-3 sm:gap-4">
      <div class="rounded-xl bg-dracula-current p-4 text-center shadow-md shadow-black/20 sm:p-5">
        <p class="text-2xl font-bold text-dracula-purple sm:text-3xl">{{ stats().total }}</p>
        <p class="mt-1 text-xs text-dracula-comment sm:text-sm">Total gatitos</p>
      </div>
      <div class="rounded-xl bg-dracula-current p-4 text-center shadow-md shadow-black/20 sm:p-5">
        <p class="text-2xl font-bold text-dracula-green sm:text-3xl">{{ stats().adopted }}</p>
        <p class="mt-1 text-xs text-dracula-comment sm:text-sm">Adoptados</p>
      </div>
      <div class="rounded-xl bg-dracula-current p-4 text-center shadow-md shadow-black/20 sm:p-5">
        <p class="text-2xl font-bold text-dracula-orange sm:text-3xl">{{ stats().pending }}</p>
        <p class="mt-1 text-xs text-dracula-comment sm:text-sm">En espera</p>
      </div>
      <div class="rounded-xl bg-dracula-current p-4 text-center shadow-md shadow-black/20 sm:p-5">
        <p class="text-2xl font-bold text-dracula-cyan sm:text-3xl">{{ stats().homes }}</p>
        <p class="mt-1 text-xs text-dracula-comment sm:text-sm">Hogares</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  readonly stats = input.required<AdoptionStats>();
}
