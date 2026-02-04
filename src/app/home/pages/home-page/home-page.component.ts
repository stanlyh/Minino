import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CatCardComponent } from '../cat-card/cat-card.component';
import { AdoptionMapComponent } from '../adoption-map/adoption-map.component';
import { StatsComponent } from '../stats/stats.component';
import { CatsService, Cat, AdoptionHome, AdoptionStats } from '../../services/cats.service';
import { DatabaseService } from '../../../auth/services/database.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, CatCardComponent, AdoptionMapComponent, StatsComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-dracula-bg">
      <app-navbar />

      <main class="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <!-- Seccion superior: Carrusel de gatitos -->
        <section class="mx-auto max-w-6xl">
          <h2 class="mb-6 text-center text-xl font-bold text-dracula-purple sm:text-2xl lg:text-3xl">
            Gatitos en adopcion
          </h2>

          <!-- Carrusel -->
          <div class="relative flex items-center justify-center">
            <!-- Boton anterior -->
            <button
              (click)="prev()"
              class="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-dracula-purple text-dracula-bg shadow-lg transition hover:bg-dracula-pink sm:h-12 sm:w-12"
              aria-label="Anterior"
            >
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Cards del carrusel -->
            <div class="flex w-full items-center justify-center gap-2 overflow-hidden px-12 sm:gap-4 sm:px-16">
              @for (cat of visibleCats(); track cat.id; let i = $index) {
                <div
                  class="transition-all duration-300"
                  [class]="getCardClasses(i)"
                >
                  <app-cat-card [cat]="cat" />
                </div>
              }
            </div>

            <!-- Boton siguiente -->
            <button
              (click)="next()"
              class="absolute right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-dracula-purple text-dracula-bg shadow-lg transition hover:bg-dracula-pink sm:h-12 sm:w-12"
              aria-label="Siguiente"
            >
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Indicadores -->
          <div class="mt-6 flex justify-center gap-2">
            @for (cat of cats(); track cat.id; let i = $index) {
              <button
                (click)="goTo(i)"
                class="h-2.5 w-2.5 rounded-full transition-all sm:h-3 sm:w-3"
                [class]="currentIndex() === i ? 'bg-dracula-purple scale-125' : 'bg-dracula-comment/50 hover:bg-dracula-comment'"
                [attr.aria-label]="'Ir a gatito ' + (i + 1)"
              ></button>
            }
          </div>
        </section>

        <!-- Seccion inferior: Mapa y estadisticas -->
        <section class="mx-auto mt-10 max-w-7xl sm:mt-12 lg:mt-16">
          <h2 class="mb-6 text-center text-xl font-bold text-dracula-purple sm:text-2xl lg:text-3xl">
            Hogares adoptivos y estadisticas
          </h2>
          <div class="flex flex-col gap-6 lg:flex-row">
            <div class="w-full lg:w-3/5">
              @if (homes().length > 0) {
                <app-adoption-map [homes]="homes()" />
              }
            </div>
            <div class="w-full lg:w-2/5">
              <app-stats [stats]="stats()" />
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private readonly catsService = inject(CatsService);
  private readonly dbService = inject(DatabaseService);

  readonly cats = signal<Cat[]>([]);
  readonly homes = signal<AdoptionHome[]>([]);
  readonly stats = signal<AdoptionStats>({ total: 0, adopted: 0, pending: 0, homes: 0 });
  readonly currentIndex = signal(0);

  readonly visibleCats = computed(() => {
    const allCats = this.cats();
    if (allCats.length === 0) return [];

    const idx = this.currentIndex();
    const total = allCats.length;

    // Mostrar 3 cards: anterior, actual, siguiente (con wrap-around)
    const prevIdx = (idx - 1 + total) % total;
    const nextIdx = (idx + 1) % total;

    return [allCats[prevIdx], allCats[idx], allCats[nextIdx]];
  });

  async ngOnInit(): Promise<void> {
    await this.dbService.whenReady();
    this.cats.set(this.catsService.getCats());
    this.homes.set(this.catsService.getAdoptionHomes());
    this.stats.set(this.catsService.getStats());
  }

  prev(): void {
    const total = this.cats().length;
    if (total === 0) return;
    this.currentIndex.set((this.currentIndex() - 1 + total) % total);
  }

  next(): void {
    const total = this.cats().length;
    if (total === 0) return;
    this.currentIndex.set((this.currentIndex() + 1) % total);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  getCardClasses(position: number): string {
    // position 0 = izquierda, 1 = centro, 2 = derecha
    if (position === 1) {
      // Card central - más grande
      return 'w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] scale-100 opacity-100 z-10';
    }
    // Cards laterales - más pequeñas y semi-transparentes
    return 'hidden sm:block w-full max-w-[240px] lg:max-w-[280px] scale-90 opacity-60';
  }
}
