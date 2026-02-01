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

  private persist(): void {
    const data = this.db.export();
    const binary = String.fromCharCode(...data);
    localStorage.setItem('minino_db', btoa(binary));
  }
}
