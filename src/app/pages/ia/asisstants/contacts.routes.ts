import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: 'grid',
    children: [
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
      },
      {
        path: ':activeCategory',
        loadComponent: () =>
          import('./assistants-grid/assistants-grid.component').then(
            (m) => m.AssistantsGridComponent
          ),
        data: {
          scrollDisabled: true,
          toolbarShadowEnabled: false
        }
      }
    ]
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./contacts-table/assistants-table.component').then(
        (m) => m.AssistantsTableComponent
      ),
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: true
    }
  }
];

export default routes;
