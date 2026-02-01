import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  form: FormGroup;
  submitted = false;
  sent = false;
  serverError?: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const { email } = this.form.value;
    // TODO: llamar al servicio para enviar correo de recuperación
    console.log('Recuperar contraseña para:', email);
    this.sent = true;
    this.serverError = undefined;
  }
}
