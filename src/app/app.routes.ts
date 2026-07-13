import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  }
  // Customers, KYC, and Admin feature areas (each with Operation / Setup / Report
  // sub-routes) get their own lazy-loaded routes here, following the same
  // loadComponent/loadChildren pattern as `dashboard` above.
];
