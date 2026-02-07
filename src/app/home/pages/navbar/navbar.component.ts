import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

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
          <a routerLink="/register-home" class="text-sm text-dracula-cyan transition hover:text-dracula-pink">
            Registrar hogar
          </a>
          <span class="text-sm text-dracula-fg">{{ authService.user()?.name }}</span>
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
            routerLink="/register-home"
            (click)="menuOpen.set(false)"
            class="block py-2 text-sm text-dracula-cyan transition hover:text-dracula-pink"
          >
            Registrar hogar
          </a>
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
  readonly menuOpen = signal(false);
}
