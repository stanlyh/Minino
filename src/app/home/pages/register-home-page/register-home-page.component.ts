import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { NavbarComponent } from '../navbar/navbar.component';
import { CatsService } from '../../services/cats.service';
import { DatabaseService } from '../../../auth/services/database.service';

@Component({
  selector: 'app-register-home-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-dracula-bg">
      <app-navbar />

      <main class="flex flex-1 items-start justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm rounded-2xl bg-dracula-current p-6 shadow-lg shadow-black/30 sm:max-w-lg sm:p-8 lg:max-w-2xl lg:p-10">
          <h1 class="mb-6 text-center text-2xl font-bold text-dracula-purple sm:text-3xl">
            Registrar hogar adoptivo
          </h1>

          @if (!saved()) {
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="space-y-4 sm:space-y-5">
              <!-- Nombre del dueño -->
              <div>
                <label for="ownerName" class="mb-1 block text-sm font-medium text-dracula-fg">Nombre del dueño</label>
                <input
                  id="ownerName"
                  formControlName="ownerName"
                  placeholder="Ej: Maria Lopez"
                  class="w-full rounded-lg border border-dracula-comment bg-dracula-bg px-3 py-2 text-sm text-dracula-fg placeholder-dracula-comment outline-none transition focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/40 sm:px-4 sm:py-2.5 sm:text-base"
                />
                @if (submitted() && form.get('ownerName')?.invalid) {
                  <div class="mt-1 text-sm text-dracula-red">El nombre es obligatorio.</div>
                }
              </div>

              <!-- Nombre del gato -->
              <div>
                <label for="catName" class="mb-1 block text-sm font-medium text-dracula-fg">Nombre del gato adoptado</label>
                <input
                  id="catName"
                  formControlName="catName"
                  placeholder="Ej: Luna"
                  class="w-full rounded-lg border border-dracula-comment bg-dracula-bg px-3 py-2 text-sm text-dracula-fg placeholder-dracula-comment outline-none transition focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/40 sm:px-4 sm:py-2.5 sm:text-base"
                />
                @if (submitted() && form.get('catName')?.invalid) {
                  <div class="mt-1 text-sm text-dracula-red">El nombre del gato es obligatorio.</div>
                }
              </div>

              <!-- Mapa para seleccionar ubicación -->
              <div>
                <label class="mb-1 block text-sm font-medium text-dracula-fg">
                  Ubicacion del hogar
                  <span class="text-dracula-comment">(haz click en el mapa)</span>
                </label>
                <div #mapContainer class="h-48 w-full overflow-hidden rounded-xl border border-dracula-comment sm:h-64 lg:h-72"></div>
                @if (submitted() && !hasLocation()) {
                  <div class="mt-1 text-sm text-dracula-red">Selecciona una ubicacion en el mapa.</div>
                }
                @if (hasLocation()) {
                  <p class="mt-1 text-xs text-dracula-green">
                    Ubicacion seleccionada: {{ selectedLat().toFixed(4) }}, {{ selectedLng().toFixed(4) }}
                  </p>
                }
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="w-full rounded-lg bg-dracula-purple py-2.5 font-semibold text-dracula-bg transition hover:bg-dracula-pink disabled:cursor-not-allowed disabled:opacity-50 sm:py-3"
              >
                Registrar hogar
              </button>
            </form>
          }

          @if (saved()) {
            <div class="text-center">
              <div class="rounded-lg bg-dracula-green/20 p-4">
                <p class="text-lg font-medium text-dracula-green">Hogar registrado exitosamente</p>
                <p class="mt-1 text-sm text-dracula-fg">
                  El hogar de <strong class="text-dracula-cyan">{{ form.value.catName }}</strong> ha sido agregado al mapa.
                </p>
              </div>
              <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  (click)="reset()"
                  class="rounded-lg bg-dracula-purple px-6 py-2.5 font-semibold text-dracula-bg transition hover:bg-dracula-pink"
                >
                  Registrar otro
                </button>
                <a
                  routerLink="/home"
                  class="rounded-lg bg-dracula-comment/30 px-6 py-2.5 text-center font-semibold text-dracula-fg transition hover:bg-dracula-comment/50"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: `
    :host { display: block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterHomePageComponent implements AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly catsService = inject(CatsService);
  private readonly dbService = inject(DatabaseService);
  private readonly ngZone = inject(NgZone);

  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private map?: L.Map;
  private marker?: L.Marker;

  readonly submitted = signal(false);
  readonly saved = signal(false);
  readonly selectedLat = signal(0);
  readonly selectedLng = signal(0);
  readonly hasLocation = signal(false);

  readonly form = this.fb.group({
    ownerName: ['', Validators.required],
    catName: ['', Validators.required],
  });

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.initMap(), 0);
    });
  }

  private initMap(): void {
    const el = this.mapContainer().nativeElement;

    this.map = L.map(el, {
      center: [-0.5015, -78.5616],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng], { icon }).addTo(this.map!);
      }

      this.ngZone.run(() => {
        this.selectedLat.set(lat);
        this.selectedLng.set(lng);
        this.hasLocation.set(true);
      });
    });

    setTimeout(() => this.map?.invalidateSize(), 100);
  }

  async submit(): Promise<void> {
    this.submitted.set(true);

    if (this.form.invalid || !this.hasLocation()) return;

    await this.dbService.whenReady();
    this.catsService.addHome(
      this.form.value.ownerName!,
      this.form.value.catName!,
      this.selectedLat(),
      this.selectedLng()
    );

    this.saved.set(true);
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.saved.set(false);
    this.hasLocation.set(false);
    this.selectedLat.set(0);
    this.selectedLng.set(0);

    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = undefined;
    }

    // Reinicializar mapa después del reset
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.map?.invalidateSize(), 100);
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
