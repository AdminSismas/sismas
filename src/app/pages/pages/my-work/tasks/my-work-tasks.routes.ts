import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: 'tasksPanel',
    children: [
      {
        path: '',
        redirectTo: 'assignedTasks',
        pathMatch: 'full'
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./tasks-panel/tasks-panel.component').then(
            (m) => m.TasksPanelComponent
          ),
        data: {
          scrollDisabled: true,
          toolbarShadowEnabled: false
        }
      }
    ]
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
