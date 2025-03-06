import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/welcome-component/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'change-meeting',
    loadComponent: () => import('./components/change-meeting/change-meeting.component').then(m => m.ChangeMeetingComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./components/calendar-view/calendar-view.component').then(m => m.CalendarViewComponent)
  },
];
