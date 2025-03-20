import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./map/map.component').then((m) => m.MapComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../pages/errors/error-404/error-404.component').then(
        (m) => m.Error404Component
      )
  },
];
export default routes;
