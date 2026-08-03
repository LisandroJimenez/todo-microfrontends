import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'login',
    loadComponent: () =>
      loadRemoteModule('auth-mfe', './Login')
        .then((remoteModule) => remoteModule.Login)
  },
  {
    path: 'registro',
    loadComponent: () =>
      loadRemoteModule('auth-mfe', './Register')
        .then((remoteModule) => remoteModule.Register)
  },
  {
    path: 'todos',
    canActivate: [authGuard],
    loadComponent: () =>
      loadRemoteModule('todos-mfe', './Todos')
        .then((remoteModule) => remoteModule.Todos)
  },
  
  {
    path: '**',
    component: NotFound
  }
];

