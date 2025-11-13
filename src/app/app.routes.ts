import { Routes } from '@angular/router';
import { Login } from './Authentication/login/login';
import { Register } from './Authentication/register/register';
import { ForgotPassword } from './Authentication/forgot-password/forgot-password';
import { GreetingComponent } from './greeting-component/greeting-component';
import { MenuComponent } from './menu-component/menu-component';
import { AuthGuard } from './Authentication/auth.guard';

export const routes: Routes = [

  {
    path: 'home',
    component: GreetingComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: '**', redirectTo: 'login' },
];
