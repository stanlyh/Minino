import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db: any;
  private ready: Promise<void>;

  constructor() {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    // Cargar sql.js dinámicamente desde el script global
    const SQL = await (window as any).initSqlJs({
      locateFile: () => '/assets/sql-wasm.wasm',
    });

    // Restaurar base de datos desde localStorage si existe
    const saved = localStorage.getItem('minino_db');
    if (saved) {
      const buf = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
      this.db = new SQL.Database(buf);
    } else {
      this.db = new SQL.Database();
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS cats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        breed TEXT NOT NULL,
        age_months INTEGER NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        adopted INTEGER DEFAULT 0
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS adoption_homes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_name TEXT NOT NULL,
        cat_name TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        adopted_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.seedData();
    this.persist();
  }

  async whenReady(): Promise<void> {
    return this.ready;
  }

  run(sql: string, params?: any[]): void {
    this.db.run(sql, params);
    this.persist();
  }

  get(sql: string, params?: any[]): any | undefined {
    const stmt = this.db.prepare(sql);
    if (params) stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return undefined;
  }

  getAll(sql: string, params?: any[]): any[] {
    const results: any[] = [];
    const stmt = this.db.prepare(sql);
    if (params) stmt.bind(params);
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  count(sql: string, params?: any[]): number {
    const row = this.get(sql, params);
    if (!row) return 0;
    const keys = Object.keys(row);
    return keys.length > 0 ? Number(row[keys[0]]) : 0;
  }

  private seedData(): void {
    const catCount = this.get('SELECT COUNT(*) as c FROM cats');
    if (catCount && catCount.c > 0) return;

    const cats = [
      ['Luna', 'Mestizo', 8, 'Juguetona y cariñosa, le encanta perseguir mariposas.', 'https://placekitten.com/400/300'],
      ['Milo', 'Siames', 12, 'Tranquilo y observador, perfecto compañero de lectura.', 'https://placekitten.com/401/300'],
      ['Canela', 'Persa', 6, 'Dulce y dormilona, ama los rincones soleados.', 'https://placekitten.com/402/300'],
      ['Simba', 'Maine Coon', 10, 'Aventurero y valiente, siempre explorando nuevos lugares.', 'https://placekitten.com/403/300'],
      ['Nina', 'Angora', 4, 'Timida al principio pero muy leal cuando te conoce.', 'https://placekitten.com/404/300'],
      ['Felix', 'Mestizo', 18, 'Independiente y elegante, le gusta observar desde las alturas.', 'https://placekitten.com/405/300'],
      ['Cleo', 'Bengal', 7, 'Energetica y atletica, necesita espacio para jugar.', 'https://placekitten.com/406/300'],
      ['Tomas', 'Ragdoll', 14, 'Relajado y sociable, se lleva bien con otros animales.', 'https://placekitten.com/407/300'],
      ['Mia', 'Mestizo', 3, 'Curiosa y traviesa, siempre buscando aventuras.', 'https://placekitten.com/408/300'],
      ['Pancho', 'Bombay', 24, 'Calmado y maduro, ideal para hogares tranquilos.', 'https://placekitten.com/409/300'],
    ];

    for (const cat of cats) {
      this.db.run(
        'INSERT INTO cats (name, breed, age_months, description, image_url) VALUES (?, ?, ?, ?, ?)',
        cat
      );
    }

    // Hogares adoptivos en el Canton Mejia, Ecuador
    const homes = [
      ['Maria Lopez', 'Pelusa', -0.5015, -78.5616],      // Machachi
      ['Carlos Ruiz', 'Bigotes', -0.5138, -78.5699],      // Aloasi
      ['Ana Torres', 'Copito', -0.4823, -78.5543],         // Tambillo
      ['Pedro Vega', 'Manchas', -0.5267, -78.5872],        // El Chaupi
      ['Laura Diaz', 'Nube', -0.4691, -78.5489],           // Cutuglagua
      ['Jose Paredes', 'Tigre', -0.5412, -78.5534],        // Uyumbicho
    ];

    for (const home of homes) {
      this.db.run(
        'INSERT INTO adoption_homes (owner_name, cat_name, lat, lng) VALUES (?, ?, ?, ?)',
        home
      );
    }
  }

  private persist(): void {
    const data = this.db.export();
    const binary = String.fromCharCode(...data);
    localStorage.setItem('minino_db', btoa(binary));
  }
}
