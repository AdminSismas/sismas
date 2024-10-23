import { VexRoutes } from '@vex/interfaces/vex-route.interface';

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
              import('./ticketOffice/generate-services/generate-services.component').then(
                (m) => m.GenerateServicesComponent
              )
          },
          {
            path: 'serviceHistory',
            loadComponent: () =>
              import('./ticketOffice/service-history/service-history.component').then(
                (m) => m.ServiceHistoryComponent
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
    ]
  },
];

export default routes;
