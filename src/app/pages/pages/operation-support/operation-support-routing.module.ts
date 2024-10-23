import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'procedures/prioritizeWork',
        pathMatch: 'full'
      },
      {
        path: 'people',
        loadComponent: () =>
          import('./people/people.component').then((m) => m.PeopleComponent)
      },
      {
        path: 'procedures',
        children:[
          {
            path: 'prioritizeWork',
            loadComponent: () =>
              import('./procedures/prioritize-work/prioritize-work.component').then(
                (m) => m.PrioritizeWorkComponent
              )
          },
          {
            path: 'workProgress',
            loadComponent: () =>
              import('./procedures/work-progress/work-progress.component').then(
                (m) => m.WorkProgressComponent
              )
          },
          {
            path: 'workFinished',
            loadComponent: () =>
              import('./procedures/work-finished/work-finished.component').then(
                (m) => m.WorkFinishedComponent
              )
          }
        ]
      },
      {
        path: 'historicalInformation',
        loadComponent: () =>
          import('./historical-information/historical-information.component').then(
            (m) => m.HistoricalInformationComponent
          )
      },
      {
        path: 'workAssignment',
        loadComponent: () =>
          import('./work-assignment/work-assignment.component').then(
            (m) => m.WorkAssignmentComponent
          )
      },
      {
        path: 'operationalAnalytics',
        loadComponent: () =>
          import('./operational-analytics/operational-analytics.component').then(
            (m) => m.OperationalAnalyticsComponent
          )
      },
      {
        path: '**',
        loadComponent: () =>
          import('../../pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      },
    ]
  },
];

export default routes;
