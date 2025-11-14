import { Routes } from '@angular/router';
import { Login } from './component/authentication/login/login';
import { Register } from './component/authentication/register/register';
import { ForgotPassword } from './component/authentication/forgot-password/forgot-password';
import { GreetingComponent } from './component/greeting-component/greeting-component';
import { MenuComponent } from './component/menu-component/menu-component';
import { DailyNotesComponent } from './component/daily-notes-component/daily-notes-component';

import { authGuard } from './guard/auth.guard';

export const routes: Routes = [

  {
    path: 'home',
    component: GreetingComponent,
    canActivate: [authGuard],
  },

  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [authGuard],
  },

  {
    path: 'daily-notes',
    component: DailyNotesComponent,
    canActivate: [authGuard],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: '**', redirectTo: 'login' },
];
