import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
        <!-- Seccion superior: Gatitos en adopcion -->
        <section class="mx-auto max-w-7xl">
          <h2 class="mb-6 text-center text-xl font-bold text-dracula-purple sm:text-2xl lg:text-3xl">
            Gatitos en adopcion
          </h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            @for (cat of cats(); track cat.id) {
              <app-cat-card [cat]="cat" />
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

  async ngOnInit(): Promise<void> {
    await this.dbService.whenReady();
    this.cats.set(this.catsService.getCats());
    this.homes.set(this.catsService.getAdoptionHomes());
    this.stats.set(this.catsService.getStats());
  }
}
