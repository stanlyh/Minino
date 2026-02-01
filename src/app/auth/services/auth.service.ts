import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  constructor(
    private dbService: DatabaseService,
    private router: Router,
  ) {
    const stored = localStorage.getItem('minino_user');
    if (stored) {
      this._user.set(JSON.parse(stored));
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    await this.dbService.whenReady();

    const existing = this.dbService.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return { success: false, error: 'El correo ya esta registrado' };
    }

    this.dbService.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      password,
    ]);

    const user = this.dbService.get('SELECT id, name, email FROM users WHERE email = ?', [email]);
    this.setUser(user);
    return { success: true };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    await this.dbService.whenReady();

    const user = this.dbService.get('SELECT id, name, email, password FROM users WHERE email = ?', [
      email,
    ]);
    if (!user) {
      return { success: false, error: 'Credenciales invalidas' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Credenciales invalidas' };
    }

    this.setUser({ id: user.id, name: user.name, email: user.email });
    return { success: true };
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await this.dbService.whenReady();

    // Siempre retorna éxito para evitar enumeración de emails
    return {
      success: true,
      message: 'Si el correo existe, se enviaron instrucciones de recuperacion',
    };
  }

  logout(): void {
    localStorage.removeItem('minino_user');
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private setUser(user: User): void {
    this._user.set(user);
    localStorage.setItem('minino_user', JSON.stringify(user));
  }
}
