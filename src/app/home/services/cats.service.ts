import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../../auth/services/database.service';

export interface Cat {
  id: number;
  name: string;
  breed: string;
  age_months: number;
  description: string;
  image_url: string;
  adopted: number;
}

export interface AdoptionHome {
  id: number;
  owner_name: string;
  cat_name: string;
  lat: number;
  lng: number;
  adopted_at: string;
}

export interface AdoptionStats {
  total: number;
  adopted: number;
  pending: number;
  homes: number;
}

@Injectable({ providedIn: 'root' })
export class CatsService {
  private readonly db = inject(DatabaseService);

  getCats(): Cat[] {
    return this.db.getAll('SELECT * FROM cats WHERE adopted = 0');
  }

  getAdoptionHomes(): AdoptionHome[] {
    return this.db.getAll('SELECT * FROM adoption_homes');
  }

  addHome(ownerName: string, catName: string, lat: number, lng: number): void {
    this.db.run(
      'INSERT INTO adoption_homes (owner_name, cat_name, lat, lng) VALUES (?, ?, ?, ?)',
      [ownerName, catName, lat, lng]
    );
  }

  getStats(): AdoptionStats {
    const total = this.db.count('SELECT COUNT(*) FROM cats');
    const adopted = this.db.count('SELECT COUNT(*) FROM cats WHERE adopted = 1');
    const homes = this.db.count('SELECT COUNT(*) FROM adoption_homes');
    return {
      total,
      adopted,
      pending: total - adopted,
      homes,
    };
  }
}
