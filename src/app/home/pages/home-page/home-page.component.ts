import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-dracula-bg">
      <app-navbar />
      <main class="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="mb-4 text-2xl font-bold text-dracula-purple sm:text-3xl md:text-4xl lg:text-5xl">
            Bienvenido, {{ authService.user()?.name }}
          </h1>
          <p class="text-base text-dracula-comment sm:text-lg">Tu sesion esta activa.</p>
        </div>
      </main>
    </div>
  `,
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly authService = inject(AuthService);
}
