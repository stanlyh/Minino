import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { AdoptionHome } from '../../services/cats.service';

@Component({
  selector: 'app-adoption-map',
  standalone: true,
  template: `
    <div #mapContainer class="h-64 w-full overflow-hidden rounded-xl sm:h-80 lg:h-96"></div>
  `,
  styles: `
    :host { display: block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdoptionMapComponent implements AfterViewInit, OnDestroy {
  readonly homes = input.required<AdoptionHome[]>();
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private readonly ngZone = inject(NgZone);
  private map?: L.Map;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.initMap(), 0);
    });
  }

  private initMap(): void {
    const el = this.mapContainer().nativeElement;

    this.map = L.map(el, {
      center: [-0.5015, -78.5616],
      zoom: 12,
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
      popupAnchor: [1, -34],
    });

    for (const home of this.homes()) {
      L.marker([home.lat, home.lng], { icon })
        .addTo(this.map)
        .bindPopup(
          `<strong>${home.cat_name}</strong><br/>Adoptado por: ${home.owner_name}`
        );
    }

    // Forzar recálculo del tamaño del mapa
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
