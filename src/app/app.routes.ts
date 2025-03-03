import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./calendar-view/calendar-view.component').then(m => m.CalendarViewComponent)
  },
];