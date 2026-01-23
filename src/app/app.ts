import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterPage } from './auth/pages/register-page/register-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Minino');
}
