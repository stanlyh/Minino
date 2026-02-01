import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  submitted = false;
  serverError?: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(group: FormGroup) {
    const p = group.get('password')?.value;
    const cp = group.get('confirmPassword')?.value;
    return p === cp ? null : { passwordsMismatch: true };
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.form.invalid) return;

    const { name, email, password } = this.form.value;
    const result = await this.authService.register(name, email, password);

    if (result.success) {
      this.router.navigate(['/home']);
    } else {
      this.serverError = result.error;
    }
  }
}
