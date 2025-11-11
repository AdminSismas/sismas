import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { NOT_USER_SERV_AND_USER_TRAM } from '@shared/constants/constants';
import { RoleGuard } from '@shared/guards/role.guard';

const routes: VexRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'boxOffice/generateServices',
        pathMatch: 'full'
      },
      {
        path: 'citizens',
        canActivate: [RoleGuard],
        canActivateChild: [RoleGuard],
        data: { citizenRoles: NOT_USER_SERV_AND_USER_TRAM, parameter: 'citizenRoles' },
        children:[
          {
            path: 'validateAdministrativeActs',
            loadComponent: () =>
              import('./citizens/validate-administrative-acts/validate-administrative-acts.component').then(
                (m) => m.ValidateAdministrativeActsComponent
              )
          },
          {
            path: 'validateCertificates',
            loadComponent: () =>
              import('./citizens/validate-certificates/validate-certificates.component').then(
                (m) => m.ValidateCertificatesComponent
              )
          },
          {
            path: 'generateServices',
            loadComponent: () =>
              import('./citizens/generate-services-citizens/generate-services-citizens.component').then(
                (m) => m.GenerateServicesCitizensComponent
              )
          },
          {
            path: 'serviceHistory',
            loadComponent: () =>
              import('./citizens/service-history-citizens/service-history-citizens.component').then(
                (m) => m.ServiceHistoryCitizensComponent
              )
          }
        ]
      },
      {
        path: 'ticketOffice',
        children:[
          {
            path: 'generateServices',
            loadComponent: () =>
              import('./ticket-office/generate-services/generate-services.component').then(
                (m) => m.GenerateServicesComponent
              )
          },
          {
            path: 'serviceHistory',
            loadComponent: () =>
              import('./ticket-office/service-history/service-history.component').then(
                (m) => m.ServiceHistoryComponent
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
    redirectTo: ''
  }
];

export default routes;
