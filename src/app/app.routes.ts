import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { AuthGuard } from './pages/pages/auth/login/services/auth.guard';

export const appRoutes: VexRoutes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'coming-soon',
    loadComponent: () =>
      import('./pages/pages/coming-soon/coming-soon.component').then(
        (m) => m.ComingSoonComponent
      )
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/pages/auth/auth-routing.module')
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'myWork',
        loadChildren: () => import('./pages/pages/my-work/my-work.routes'),
        canActivate: [AuthGuard]  
      },
      {
        path: 'operationSupport',
        loadChildren: () => import('./pages/pages/operation-support/operation-support-routing.module'),
        canActivate: [AuthGuard]  
      },
      {
        path: 'openData',
        loadChildren: () => import('./pages/pages/open-data/open-data-routing.module'),
        canActivate: [AuthGuard]  
      },
      {
        path: 'publicService',
        loadChildren: () => import('./pages/pages/public-service/public-service-routing.module'),
        canActivate: [AuthGuard]  
      },
      {
        path: 'configuration',
        loadChildren: () => import('./pages/pages/configuration/configuration-routing.module'),
        canActivate: [AuthGuard]  
      },
      {
        path: 'audit',
        loadChildren: () => import('./pages/pages/audit/audit-routing.module'),
        canActivate: [AuthGuard] 
      },
      {
        path: 'bpm',
        loadChildren: () => import('./pages/pages/bpm/bpm-routing'),
        canActivate: [AuthGuard]  
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      }
    ]
  }
];
