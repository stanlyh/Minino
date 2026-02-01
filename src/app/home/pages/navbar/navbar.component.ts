import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <nav class="flex items-center justify-between bg-dracula-current px-6 py-3 shadow-md shadow-black/20">
      <span class="text-xl font-bold text-dracula-purple">Minino</span>
      <div class="flex items-center gap-4">
        <span class="text-sm text-dracula-fg">{{ authService.user()?.name }}</span>
        <button
          (click)="authService.logout()"
          class="rounded-lg bg-dracula-red/20 px-4 py-1.5 text-sm font-medium text-dracula-red transition hover:bg-dracula-red/30"
        >
          Cerrar sesion
        </button>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
}
