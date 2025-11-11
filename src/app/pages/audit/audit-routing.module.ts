import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'accessRecords',
        pathMatch: 'full'
      },
      {
        path: 'accessRecords',
        loadComponent: () =>
          import('./access-records/access-records.component')
            .then((m) => m.AccessRecordsComponent
            )
      },
      {
        path: 'cadastralManagementRecords',
        loadComponent: () =>
          import('./cadastral-management-records/cadastral-management-records.component')
            .then((m) => m.CadastralManagementRecordsComponent
            )
      },
      {
        path: '**',
        loadComponent: () =>
          import('@pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      },
    ]
  },
];

export default routes;
