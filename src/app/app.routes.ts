import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { AuthGuard } from './pages/pages/auth/login/guards/auth.guard';
import { RoleGuard } from './pages/pages/auth/login/guards/role.guard';
import { firstGuardGuard } from './guards/first-guard.guard';

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
    canActivate: [firstGuardGuard],
    children: [
      {
        path: 'myWork',
        loadChildren: () => import('./pages/pages/my-work/my-work.routes'),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'USER'] }
      },
      {
        path: 'operationSupport',
        loadChildren: () => import('./pages/pages/operation-support/operation-support-routing.module'),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'USER'] }
      },
      {
        path: 'openData',
        loadChildren: () => import('./pages/pages/open-data/open-data-routing.module'),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'USER', 'GUEST'] }
      },
      {
        path: 'publicService',
        loadChildren: () => import('./pages/pages/public-service/public-service-routing.module'),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'USER', 'GUEST'] }
      },
      {
        path: 'configuration',
        loadChildren: () => import('./pages/pages/configuration/configuration-routing.module'),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'audit',
        loadChildren: () => import('./pages/pages/audit/audit-routing.module'),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'bpm',
        loadChildren: () => import('./pages/pages/bpm/bpm-routing'),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'USER'] }
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      // {
      //   path: 'chat',
      //   loadChildren: () =>
      //     import('./pages/pages/ia/asisstants/chat/chat.routes').then(
      //       (m) => m.default
      //     ),
      // },
      // {
      //   path: 'assistants',
      //   loadComponent: () =>
      //     import('./pages/pages/ia/asisstants/assistants-grid/assistants-grid.component').then(
      //       (m) => m.AssistantsGridComponent
      //     ),
      // },
      {
        path: 'assistant',
        loadComponent: () =>
          import('./pages/pages/ia/asisstants/asisstants.component').then(
            (m) => m.AsisstantsComponent
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          ),
      }
    ]
  },
];
