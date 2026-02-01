import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  submitted = false;
  serverError?: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async submit(): Promise<void> {
    this.submitted = true;
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    const result = await this.authService.login(email, password);

    if (result.success) {
      this.router.navigate(['/home']);
    } else {
      this.serverError = result.error;
    }
  }
}
