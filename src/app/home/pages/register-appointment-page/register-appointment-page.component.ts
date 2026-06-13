import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppointmentsService } from '../../services/appointments.service';
import { DatabaseService } from '../../../auth/services/database.service';

const INPUT_CLASS =
  'w-full rounded-lg border border-dracula-comment bg-dracula-bg px-3 py-2 text-sm text-dracula-fg placeholder-dracula-comment outline-none transition focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/40 sm:px-4 sm:py-2.5 sm:text-base';

@Component({
  selector: 'app-register-appointment-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-dracula-bg">
      <app-navbar />

      <main class="flex flex-1 items-start justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm rounded-2xl bg-dracula-current p-6 shadow-lg shadow-black/30 sm:max-w-lg sm:p-8 lg:max-w-2xl lg:p-10">
          <h1 class="mb-6 text-center text-2xl font-bold text-dracula-purple sm:text-3xl">
            Registrar cita veterinaria
          </h1>

          @if (!saved()) {
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="space-y-4 sm:space-y-5">

              <!-- Nombre del gatito -->
              <div>
                <label for="catName" class="mb-1 block text-sm font-medium text-dracula-fg">Nombre del gatito</label>
                <input id="catName" formControlName="catName" placeholder="Ej: Luna" [class]="inputClass" />
                @if (submitted() && form.get('catName')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">El nombre del gatito es obligatorio.</p>
                }
              </div>

              <!-- Veterinario -->
              <div>
                <label for="vetName" class="mb-1 block text-sm font-medium text-dracula-fg">Nombre del veterinario</label>
                <input id="vetName" formControlName="vetName" placeholder="Ej: Dr. Carlos Ruiz" [class]="inputClass" />
                @if (submitted() && form.get('vetName')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">El nombre del veterinario es obligatorio.</p>
                }
              </div>

              <!-- Clinica -->
              <div>
                <label for="clinic" class="mb-1 block text-sm font-medium text-dracula-fg">Clinica / Hospital</label>
                <input id="clinic" formControlName="clinic" placeholder="Ej: Clinica Veterinaria Patitas" [class]="inputClass" />
                @if (submitted() && form.get('clinic')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">La clinica es obligatoria.</p>
                }
              </div>

              <!-- Fecha y hora -->
              <div>
                <label for="appointmentDate" class="mb-1 block text-sm font-medium text-dracula-fg">Fecha y hora</label>
                <input
                  id="appointmentDate"
                  type="datetime-local"
                  formControlName="appointmentDate"
                  [class]="inputClass"
                />
                @if (submitted() && form.get('appointmentDate')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">La fecha y hora son obligatorias.</p>
                }
              </div>

              <!-- Motivo -->
              <div>
                <label for="reason" class="mb-1 block text-sm font-medium text-dracula-fg">Motivo de la consulta</label>
                <textarea
                  id="reason"
                  formControlName="reason"
                  rows="3"
                  placeholder="Ej: Vacunacion anual, revision general..."
                  class="w-full resize-none rounded-lg border border-dracula-comment bg-dracula-bg px-3 py-2 text-sm text-dracula-fg placeholder-dracula-comment outline-none transition focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/40 sm:px-4 sm:py-2.5 sm:text-base"
                ></textarea>
                @if (submitted() && form.get('reason')?.invalid) {
                  <p class="mt-1 text-sm text-dracula-red">El motivo es obligatorio.</p>
                }
              </div>

              <!-- Submit / Cancel -->
              <div class="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  class="w-full rounded-lg bg-dracula-purple py-2.5 font-semibold text-dracula-bg transition hover:bg-dracula-pink sm:py-3"
                >
                  Registrar cita
                </button>
                <a
                  routerLink="/home"
                  class="w-full rounded-lg bg-dracula-comment/30 py-2.5 text-center font-semibold text-dracula-fg transition hover:bg-dracula-comment/50 sm:py-3"
                >
                  Cancelar
                </a>
              </div>
            </form>
          }

          @if (saved()) {
            <div class="text-center">
              <div class="rounded-lg bg-dracula-green/20 p-4">
                <p class="text-lg font-medium text-dracula-green">Cita registrada</p>
                <p class="mt-1 text-sm text-dracula-fg">
                  La cita para <strong class="text-dracula-cyan">{{ savedCatName() }}</strong>
                  ha sido agendada con exito.
                </p>
              </div>
              <div class="mt-4 rounded-lg border border-dracula-comment/40 bg-dracula-bg/50 p-4 text-left text-sm space-y-1">
                <p class="text-dracula-comment"><span class="text-dracula-fg font-medium">Veterinario:</span> {{ savedVetName() }}</p>
                <p class="text-dracula-comment"><span class="text-dracula-fg font-medium">Clinica:</span> {{ savedClinic() }}</p>
                <p class="text-dracula-comment"><span class="text-dracula-fg font-medium">Fecha:</span> {{ savedDate() }}</p>
                <p class="text-dracula-comment"><span class="text-dracula-fg font-medium">Motivo:</span> {{ savedReason() }}</p>
              </div>
              <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  (click)="reset()"
                  class="rounded-lg bg-dracula-purple px-6 py-2.5 font-semibold text-dracula-bg transition hover:bg-dracula-pink"
                >
                  Registrar otra cita
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
export class RegisterAppointmentPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly dbService = inject(DatabaseService);

  readonly inputClass = INPUT_CLASS;
  readonly submitted = signal(false);
  readonly saved = signal(false);
  readonly savedCatName = signal('');
  readonly savedVetName = signal('');
  readonly savedClinic = signal('');
  readonly savedDate = signal('');
  readonly savedReason = signal('');

  readonly form = this.fb.group({
    catName:         ['', Validators.required],
    vetName:         ['', Validators.required],
    clinic:          ['', Validators.required],
    appointmentDate: ['', Validators.required],
    reason:          ['', Validators.required],
  });

  async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const { catName, vetName, clinic, appointmentDate, reason } = this.form.value;

    await this.dbService.whenReady();
    this.appointmentsService.addAppointment(catName!, vetName!, clinic!, appointmentDate!, reason!);

    this.savedCatName.set(catName!);
    this.savedVetName.set(vetName!);
    this.savedClinic.set(clinic!);
    this.savedDate.set(this.formatDate(appointmentDate!));
    this.savedReason.set(reason!);
    this.saved.set(true);
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.saved.set(false);
    this.savedCatName.set('');
    this.savedVetName.set('');
    this.savedClinic.set('');
    this.savedDate.set('');
    this.savedReason.set('');
  }

  private formatDate(datetimeLocal: string): string {
    const d = new Date(datetimeLocal);
    return d.toLocaleString('es-EC', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  }
}
