import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { EXECUTIONERS_ROLE_LIST_WITHOUT_USER_TRAM } from '@shared/constants/constants';
import { RoleGuard } from '@shared/guards/role.guard';

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
        children: [
          {
            path: 'prioritizeWork',
            loadComponent: () =>
              import(
                './procedures/prioritize-work/prioritize-work.component'
              ).then((m) => m.PrioritizeWorkComponent)
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
        path: 'workAssignment',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./work-assignment/work-assignment.component').then(
                (m) => m.WorkAssignmentComponent
              )
          },
          {
            path: 'workDistribution',
            loadComponent: () =>
              import(
                './work-assignment/work-distribution/work-distribution.component'
              ).then((m) => m.WorkDistributionComponent),
            canActivate: [RoleGuard],
            data: {
              operationSupportWorkDistributionRoles: ['ADMIN'],
              parameter: 'operationSupportWorkDistributionRoles'
            }
          }
        ]
      },
      {
        path: 'reports',
        canActivate: [RoleGuard],
        data: {
          operationSupportReportsRoles:
            EXECUTIONERS_ROLE_LIST_WITHOUT_USER_TRAM,
          parameter: 'operationSupportReportsRoles'
        },
        children: [
          {
            path: 'operationalAnalytics',
            loadComponent: () =>
              import(
                './reports/operational-analytics/operational-analytics.component'
              ).then((m) => m.OperationalAnalyticsComponent)
          },
          {
            path: 'downloadReports',
            loadComponent: () =>
              import(
                '@features/operation-support/components/reports/download-reports/report-manager/report-manager.component'
              ).then((m) => m.ReportManagerComponent)
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
          import('@pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      }
    ]
  }
];

export default routes;
