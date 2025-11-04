import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.component').then((m) => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent)
      },
      {
        path: '**',
        loadComponent: () =>
          import('../../../shared/utils/in-construction/in-construction.component').then(
            (m) => m.InConstructionComponent
          )
      }
    ]
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
