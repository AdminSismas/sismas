import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { TOP_ROLE_LIST } from '@shared/constants/constants';
import { RoleGuard } from '@shared/guards/role.guard';

const routes: VexRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'generalMaps',
        pathMatch: 'full'
      },
      {
        path: 'generalMaps',
        loadComponent: () =>
          import('./general-maps/general-maps.component').then((m) => m.GeneralMapsComponent)
      },
      {
        path: 'cadastralSearchDA',
        loadComponent: () =>
          import('./cadastral-search-da/cadastral-search-da.component').then((m) => m.CadastralSearchDAComponent)
      },
      {
        path: 'downloads',
        canActivate: [RoleGuard],
        data: { openDataDownloadRoles: TOP_ROLE_LIST, parameter: 'openDataDownloadRoles' },
        children:[
          {
            path: 'geodatabase',
            loadComponent: () =>
              import('./downloads/geodatabase/geodatabase.component').then(
                (m) => m.GeodatabaseComponent
              )
          },
          {
            path: 'alphanumeric',
            loadComponent: () =>
              import('./downloads/alphanumeric/alphanumeric.component').then(
                (m) => m.AlphanumericComponent
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
      },
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('@pages/errors/error-404/error-404.component').then(
        (m) => m.Error404Component
      )
  },
];

export default routes;

