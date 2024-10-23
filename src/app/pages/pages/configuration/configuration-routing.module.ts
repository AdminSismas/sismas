import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'domainLADM_COL',
        pathMatch: 'full'
      },
      {
        path: 'cadastral',
        children:[
          {
            path: 'domainLADM_COL',
            loadComponent: () =>
              import('./cadastral/domain-ladm-col/domain-ladm-col.component').then(
                (m) => m.DomainLADMCOLComponent
              )
          },
          {
            path: 'sequences',
            loadComponent: () =>
              import('./cadastral/sequences/sequences.component').then(
                (m) => m.SequencesComponent
              )
          },
          {
            path: 'servicesRates',
            loadComponent: () =>
              import('./cadastral/services-rates/services-rates.component').then(
                (m) => m.ServicesRatesComponent
              )
          },
          {
            path: 'economicModLand',
            loadComponent: () =>
              import('./cadastral/economic-mod-land/economic-mod-land.component').then(
                (m) => m.EconomicModLandComponent
              )
          },
          {
            path: 'economicModConstruction',
            loadComponent: () =>
              import('./cadastral/economic-mod-construction/economic-mod-construction.component').then(
                (m) => m.EconomicModConstructionComponent
              )
          },
          {
            path: 'integralEconomicMod',
            loadComponent: () =>
              import('./cadastral/integral-economic-mod/integral-economic-mod.component').then(
                (m) => m.IntegralEconomicModComponent
              )
          },
        ]
      },
      {
        path: 'general',
        children:[
          {
            path: 'users',
            loadComponent: () =>
              import('./general/users/users.component').then(
                (m) => m.UsersComponent
              )
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./general/calendar/calendar.component').then(
                (m) => m.CalendarComponent
              )
          }
        ]
      },
      {
        path: 'cadastralProcedures',
        children:[
          {
            path: 'entryDocuments',
            loadComponent: () =>
              import('./cadastralProcedures/entry-documents/entry-documents.component').then(
                (m) => m.EntryDocumentsComponent
              )
          },
          {
            path: 'workflowProcedures',
            loadComponent: () =>
              import('./cadastralProcedures/workflow-procedures/workflow-procedures.component').then(
                (m) => m.WorkflowProceduresComponent
              )
          },
          {
            path: 'workgroups',
            loadComponent: () =>
              import('./cadastralProcedures/workgroups/workgroups.component').then(
                (m) => m.WorkgroupsComponent
              )
          },
          {
            path: 'documentsAssociatedProcedures',
            loadComponent: () =>
              import('./cadastralProcedures/documents-associated-procedures/documents-associated-procedures.component').then(
                (m) => m.DocumentsAssociatedProceduresComponent
              )
          },
          {
            path: 'outputFormats',
            loadComponent: () =>
              import('./cadastralProcedures/output-formats/output-formats.component').then(
                (m) => m.OutputFormatsComponent
              )
          },
          {
            path: 'digitalizedSignatures',
            loadComponent: () =>
              import('./cadastralProcedures/digitalized-signatures/digitalized-signatures.component').then(
                (m) => m.DigitalizedSignaturesComponent
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
