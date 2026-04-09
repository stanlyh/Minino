import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="bg-dracula-current shadow-md shadow-black/20">
      <div class="flex items-center justify-between px-4 py-3 md:px-6">
        <span class="text-lg font-bold text-dracula-purple md:text-xl">Minino</span>

        <!-- Desktop menu -->
        <div class="hidden items-center gap-4 md:flex">
          <a routerLink="/register-cat" class="text-sm text-dracula-cyan transition hover:text-dracula-pink">
            Registrar gatito
          </a>
          <a routerLink="/register-home" class="text-sm text-dracula-cyan transition hover:text-dracula-pink">
            Registrar hogar
          </a>
          <span class="text-sm text-dracula-fg">{{ authService.user()?.name }}</span>
          <button
            (click)="themeService.toggle()"
            class="flex items-center justify-center rounded-lg p-2 text-dracula-fg transition hover:bg-dracula-bg/50"
            [attr.aria-label]="themeService.theme() === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
          >
            @if (themeService.theme() === 'dark') {
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M6.343 6.343l.707.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
              </svg>
            } @else {
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            }
          </button>
          <button
            (click)="authService.logout()"
            class="rounded-lg bg-dracula-red/20 px-4 py-1.5 text-sm font-medium text-dracula-red transition hover:bg-dracula-red/30"
          >
            Cerrar sesion
          </button>
        </div>

        <!-- Mobile hamburger button -->
        <button
          (click)="menuOpen.set(!menuOpen())"
          class="flex items-center justify-center rounded-lg p-2 text-dracula-fg transition hover:bg-dracula-bg/50 md:hidden"
          aria-label="Abrir menu"
        >
          @if (!menuOpen()) {
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          } @else {
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        </button>
      </div>

      <!-- Mobile menu -->
      @if (menuOpen()) {
        <div class="border-t border-dracula-bg/30 px-4 pb-3 pt-2 md:hidden">
          <span class="block py-2 text-sm text-dracula-fg">{{ authService.user()?.name }}</span>
          <a
            routerLink="/register-cat"
            (click)="menuOpen.set(false)"
            class="block py-2 text-sm text-dracula-cyan transition hover:text-dracula-pink"
          >
            Registrar gatito
          </a>
          <a
            routerLink="/register-home"
            (click)="menuOpen.set(false)"
            class="block py-2 text-sm text-dracula-cyan transition hover:text-dracula-pink"
          >
            Registrar hogar
          </a>
          <button
            (click)="themeService.toggle()"
            class="mt-1 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-dracula-fg transition hover:bg-dracula-bg/50"
          >
            @if (themeService.theme() === 'dark') {
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M6.343 6.343l.707.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
              </svg>
              Tema claro
            } @else {
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Tema oscuro
            }
          </button>
          <button
            (click)="authService.logout()"
            class="mt-1 w-full rounded-lg bg-dracula-red/20 px-4 py-2 text-sm font-medium text-dracula-red transition hover:bg-dracula-red/30"
          >
            Cerrar sesion
          </button>
        </div>
      }
    </nav>
  `,
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly menuOpen = signal(false);
}
