import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { RoleGuard } from './guards/role.guard';
import { authGuard } from './guards/auth.guard';
import { ADMIN_ROLE_LIST, BASIC_USERS_ROLE_LIST, CAN_RESOLVE_LIST, EXECUTIONERS_ROLE_LIST_WITH_USER_TRAM, MODIFY_PEOPLE, NOT_GUEST_USERS_ROLE_LIST } from './apps/constants/general/constants';

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
    loadChildren: () => import('./pages/pages/auth/auth-routing.module'),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'myWork',
        loadChildren: () => import('./pages/pages/my-work/my-work.routes'),
        canActivate: [RoleGuard],
        data: { baseRoles: NOT_GUEST_USERS_ROLE_LIST, parameter: 'baseRoles' }
      },
      {
        path: 'operationSupport',
        loadChildren: () => import('./pages/pages/operation-support/operation-support-routing.module'),
        canActivate: [RoleGuard],
        data: { baseRoles: EXECUTIONERS_ROLE_LIST_WITH_USER_TRAM, parameter: 'baseRoles' }
      },
      {
        path: 'openData',
        loadChildren: () => import('./pages/pages/open-data/open-data-routing.module'),
        canActivate: [RoleGuard],
        data: { baseRoles: CAN_RESOLVE_LIST, parameter: 'baseRoles' }
      },
      {
        path: 'publicService',
        loadChildren: () => import('./pages/pages/public-service/public-service-routing.module'),
        canActivate: [RoleGuard],
        data: { baseRoles: BASIC_USERS_ROLE_LIST, parameter: 'baseRoles' }
      },
      {
        path: 'thematicMap',
        loadChildren: () => import('./pages/pages/thematic-map/thematic-map-routing.module'),
        canActivate: [RoleGuard],
        data: { baseRoles: BASIC_USERS_ROLE_LIST, parameter: 'baseRoles' }
      },
      {
        path: 'configuration',
        loadChildren: () => import('./pages/pages/configuration/configuration-routing.module'),
        canActivate: [RoleGuard],
        data: { baseRoles: MODIFY_PEOPLE, parameter: 'baseRoles' }
      },
      {
        path: 'audit',
        loadChildren: () => import('./pages/pages/audit/audit-routing.module'),
        canActivate: [RoleGuard],
        data: { baseRoles: ADMIN_ROLE_LIST, parameter: 'baseRoles' }
      },
      {
        path: 'bpm',
        loadChildren: () => import('./pages/pages/bpm/bpm-routing'),
        canActivate: [RoleGuard],
        data: { baseRoles: NOT_GUEST_USERS_ROLE_LIST, parameter: 'baseRoles' }
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
    canActivate: [authGuard],
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
