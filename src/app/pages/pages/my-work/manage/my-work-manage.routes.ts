import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: 'analytics',
    loadComponent: () =>
      import('./../manage/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      )
  },
  {
    path: 'timeLine',
    loadComponent: () =>
      import('./../manage/time-line/time-line.component').then(
        (m) => m.TimeLineComponent
      )
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./../manage/calendar/calendar.component').then(
        (m) => m.CalendarComponent
      )
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../../pages/errors/error-404/error-404.component').then(
        (m) => m.Error404Component
      )
  },
];

export default routes;
