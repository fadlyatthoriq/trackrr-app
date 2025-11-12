import { Routes } from '@angular/router';
import { Login } from './Authentication/login/login';
import { Register } from './Authentication/register/register';
import { ForgotPassword } from './Authentication/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: '**', redirectTo: 'login' }
];
