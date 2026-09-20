import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
export const routes: Routes = [
  { path: '', loadComponent: () =>
      import('./pages/home/home').then(m => m.Home) },
  { path: 'home', loadComponent: () =>
      import('./pages/home/home').then(m => m.Home) },
  { path: 'login', component: Login }
    
];
