import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  form: FormGroup;

  submitted = false;
  serverError?: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    // TODO: llamar al servicio de autenticación aquí.
    // Por ahora, simulamos un login exitoso en la consola.
    console.log('Login intento:', { email, password });
    this.serverError = undefined;
  }
}
