import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private authService = inject(AuthService);

  form: FormGroup;
  submitted = false;
  sent = false;
  serverError?: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async submit(): Promise<void> {
    this.submitted = true;
    if (this.form.invalid) return;

    const { email } = this.form.value;
    const result = await this.authService.forgotPassword(email);

    this.sent = result.success;
    this.serverError = undefined;
  }
}
