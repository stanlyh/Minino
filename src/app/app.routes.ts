import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/pages/register-page/register-page.component').then(m => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/pages/forgot-password-page/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
  },
  { path: '**', redirectTo: 'login' },
];
