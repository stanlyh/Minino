import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CatsService } from '../../services/cats.service';
import { DatabaseService } from '../../../auth/services/database.service';

const INPUT_CLASS =
  'w-full rounded-lg border border-dracula-comment bg-dracula-bg px-3 py-2 text-sm text-dracula-fg placeholder-dracula-comment outline-none transition focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/40 sm:px-4 sm:py-2.5 sm:text-base';

@Component({
  selector: 'app-register-cat-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-dracula-bg">
      <app-navbar />

      <main class="flex flex-1 items-start justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm rounded-2xl bg-dracula-current p-6 shadow-lg shadow-black/30 sm:max-w-lg sm:p-8 lg:max-w-2xl lg:p-10">
          <h1 class="mb-6 text-center text-2xl font-bold text-dracula-purple sm:text-3xl">
            Registrar gatito
          </h1>

          @if (!saved()) {
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="space-y-4 sm:space-y-5">

              <!-- Nombre -->
              <div>
                <label for="name" class="mb-1 block text-sm font-medium text-dracula-fg">Nombre</label>
                <input id="name" formControlName="name" placeholder="Ej: Luna" [class]="inputClass" />
                @if (submitted() && form.get('name')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">El nombre es obligatorio.</p>
                }
              </div>

              <!-- Raza -->
              <div>
                <label for="breed" class="mb-1 block text-sm font-medium text-dracula-fg">Raza</label>
                <input id="breed" formControlName="breed" placeholder="Ej: Siames" [class]="inputClass" />
                @if (submitted() && form.get('breed')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">La raza es obligatoria.</p>
                }
              </div>

              <!-- Edad -->
              <div>
                <label for="ageMonths" class="mb-1 block text-sm font-medium text-dracula-fg">
                  Edad <span class="text-dracula-comment">(en meses)</span>
                </label>
                <input
                  id="ageMonths"
                  type="number"
                  formControlName="ageMonths"
                  placeholder="Ej: 6"
                  min="1"
                  [class]="inputClass"
                />
                @if (submitted() && form.get('ageMonths')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">
                    @if (form.get('ageMonths')?.hasError('required')) { La edad es obligatoria. }
                    @if (form.get('ageMonths')?.hasError('min')) { Debe ser al menos 1 mes. }
                  </p>
                }
              </div>

              <!-- Descripcion / caracter -->
              <div>
                <label for="description" class="mb-1 block text-sm font-medium text-dracula-fg">
                  Caracter / descripcion
                </label>
                <textarea
                  id="description"
                  formControlName="description"
                  rows="3"
                  placeholder="Ej: Jugueton y curioso, le encanta explorar..."
                  class="w-full resize-none rounded-lg border border-dracula-comment bg-dracula-bg px-3 py-2 text-sm text-dracula-fg placeholder-dracula-comment outline-none transition focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/40 sm:px-4 sm:py-2.5 sm:text-base"
                ></textarea>
                @if (submitted() && form.get('description')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">La descripcion es obligatoria.</p>
                }
              </div>

              <!-- Foto -->
              <div>
                <label class="mb-1 block text-sm font-medium text-dracula-fg">Foto del gatito</label>
                <label
                  class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-dracula-comment bg-dracula-bg px-4 py-5 transition hover:border-dracula-purple hover:bg-dracula-bg/80"
                >
                  @if (imagePreview()) {
                    <img [src]="imagePreview()!" alt="Vista previa" class="h-36 w-full rounded-lg object-cover sm:h-44" />
                    <span class="text-xs text-dracula-comment">Click para cambiar la imagen</span>
                  } @else {
                    <svg class="h-10 w-10 text-dracula-comment" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3.75 3.75h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6A2.25 2.25 0 013.75 3.75z" />
                    </svg>
                    <span class="text-sm text-dracula-comment">Click para seleccionar una imagen</span>
                    <span class="text-xs text-dracula-comment/60">JPG, PNG, WebP</span>
                  }
                  <input type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)" />
                </label>
                @if (submitted() && !imagePreview()) {
                  <p class="mt-1 text-sm text-dracula-red">La foto es obligatoria.</p>
                }
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="w-full rounded-lg bg-dracula-purple py-2.5 font-semibold text-dracula-bg transition hover:bg-dracula-pink sm:py-3"
              >
                Registrar gatito
              </button>
            </form>
          }

          @if (saved()) {
            <div class="text-center">
              <div class="rounded-lg bg-dracula-green/20 p-4">
                <p class="text-lg font-medium text-dracula-green">Gatito registrado</p>
                <p class="mt-1 text-sm text-dracula-fg">
                  <strong class="text-dracula-cyan">{{ savedName() }}</strong> ya esta disponible para adopcion.
                </p>
              </div>
              @if (imagePreview()) {
                <img [src]="imagePreview()!" alt="Gatito registrado"
                  class="mx-auto mt-4 h-40 w-48 rounded-xl object-cover shadow-md shadow-black/30 sm:h-48 sm:w-56" />
              }
              <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  (click)="reset()"
                  class="rounded-lg bg-dracula-purple px-6 py-2.5 font-semibold text-dracula-bg transition hover:bg-dracula-pink"
                >
                  Registrar otro
                </button>
                <a
                  routerLink="/home"
                  class="rounded-lg bg-dracula-comment/30 px-6 py-2.5 text-center font-semibold text-dracula-fg transition hover:bg-dracula-comment/50"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: `:host { display: block; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCatPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly catsService = inject(CatsService);
  private readonly dbService = inject(DatabaseService);

  readonly inputClass = INPUT_CLASS;
  readonly submitted = signal(false);
  readonly saved = signal(false);
  readonly savedName = signal('');
  readonly imagePreview = signal<string | null>(null);

  readonly form = this.fb.group({
    name:        ['', Validators.required],
    breed:       ['', Validators.required],
    ageMonths:   [null as number | null, [Validators.required, Validators.min(1)]],
    description: ['', Validators.required],
  });

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid || !this.imagePreview()) return;

    const { name, breed, ageMonths, description } = this.form.value;

    await this.dbService.whenReady();
    this.catsService.addCat(name!, breed!, ageMonths!, description!, this.imagePreview()!);

    this.savedName.set(name!);
    this.saved.set(true);
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.saved.set(false);
    this.savedName.set('');
    this.imagePreview.set(null);
  }
}
