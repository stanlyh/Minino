import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
    <div #mapContainer class="h-64 w-full rounded-xl sm:h-80 lg:h-96"></div>
  `,
  styles: `
    :host { display: block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdoptionMapComponent implements AfterViewInit, OnDestroy {
  readonly homes = input.required<AdoptionHome[]>();
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private map?: L.Map;

  ngAfterViewInit(): void {
    const el = this.mapContainer().nativeElement;

    this.map = L.map(el).setView([-0.5015, -78.5616], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
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
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
