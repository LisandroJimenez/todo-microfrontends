import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];