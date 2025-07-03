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
          },
          {
            path: 'workHistorical',
            loadComponent: () =>
              import('./procedures/work-historical/work-historical.component').then(
                (m) => m.WorkHistoricalComponent
              )
          }
        ]
      },
      {
        path: 'workAssignment',
        loadComponent: () =>
          import('./work-assignment/work-assignment.component').then(
            (m) => m.WorkAssignmentComponent
          )
      },
      {
      path: 'reports',
      children: [
        {
          path: 'operationalAnalytics',
          loadComponent: () =>
            import('./reports/operational-analytics/operational-analytics.component').then(
              (m) => m.OperationalAnalyticsComponent
            )
        },
        {
          path: 'downloadReports',
          loadComponent: () =>
            import('./reports/download-reports/report-manager/report-manager.component').then(
              (m) => m.ReportManagerComponent
            )
        },
        {
          path: 'downloadXTF',
          loadComponent: () =>
            import('./reports/download-xtf/download-xtf.component').then(
              (m) => m.DownloadXtfComponent
            )
        }
        ]
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
