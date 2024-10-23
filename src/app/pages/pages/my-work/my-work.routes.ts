import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'cadastralSearch',
        pathMatch: 'full'
      },
      {
        path: 'cadastralSearch',
        loadComponent: () =>
          import('./cadastral-search/cadastral-search.component')
            .then((m) => m.CadastralSearchComponent
            )
      },
      {
        path: 'fileProcedure',
        loadComponent: () =>
          import('./file-procedure/file-procedure.component').then(
            (m) => m.FileProcedureComponent
          )
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/my-work-tasks.routes')
      },
      {
        path: 'manage',
        loadChildren: () => import('./manage/my-work-manage.routes')
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
