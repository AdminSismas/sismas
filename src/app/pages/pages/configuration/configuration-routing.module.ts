import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import {
  ADMIN_ROLE_LIST,
  MODIFY_PEOPLE
} from '@shared/constants';
import { RoleGuard } from 'src/app/guards/role.guard';


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
        canMatch: [RoleGuard],
        data: { configRoles: ADMIN_ROLE_LIST, parameter: 'configRoles' },
        children: [
          {
            path: 'domainLADM_COL',
            loadComponent: () =>
              import(
                './cadastral/domain-ladm-col/domain-ladm-col.component'
              ).then((m) => m.DomainLADMCOLComponent)
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
              import(
                './cadastral/services-rates/services-rates.component'
              ).then((m) => m.ServicesRatesComponent)
          },
          {
            path: 'economicModLand',
            loadComponent: () =>
              import(
                './cadastral/economic-mod-land/economic-mod-land.component'
              ).then((m) => m.EconomicModLandComponent)
          },
          {
            path: 'economicModConstruction',
            loadComponent: () =>
              import(
                './cadastral/economic-mod-construction/economic-mod-construction.component'
              ).then((m) => m.EconomicModConstructionComponent)
          },
          {
            path: 'integralEconomicMod',
            loadComponent: () =>
              import(
                './cadastral/integral-economic-mod/integral-economic-mod.component'
              ).then((m) => m.IntegralEconomicModComponent)
          }
        ]
      },
      {
        path: 'general',
        canMatch: [RoleGuard],
        data: { configRoles: ADMIN_ROLE_LIST, parameter: 'configRoles' },
        children: [
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
        canMatch: [RoleGuard],
        data: { modifyUser: MODIFY_PEOPLE, parameter: 'modifyUser' },
        children: [
          {
            path: 'entryDocuments',
            canMatch: [RoleGuard],
            data: { configRoles: ADMIN_ROLE_LIST, parameter: 'configRoles' },
            loadComponent: () =>
              import(
                './cadastralProcedures/entry-documents/entry-documents.component'
              ).then((m) => m.EntryDocumentsComponent),

          },
          {
            path: 'workflowProcedures',
            canMatch: [RoleGuard],
            data: { cadastralProceduresRoles: ADMIN_ROLE_LIST, parameter: 'cadastralProceduresRoles' },
            loadComponent: () =>
              import(
                './cadastralProcedures/workflow-procedures/workflow-procedures.component'
              ).then((m) => m.WorkflowProceduresComponent)
          },
          {
            path: 'workgroups',
            canMatch: [RoleGuard],
            data: { cadastralProceduresRoles: MODIFY_PEOPLE, parameter: 'cadastralProceduresRoles' },
            loadComponent: () =>
              import(
                './cadastralProcedures/workgroups/workgroups.component'
              ).then((m) => m.WorkgroupsComponent)
          },
          {
            path: 'documentsAssociatedProcedures',
            canMatch: [RoleGuard],
            data: { cadastralProceduresRoles: ADMIN_ROLE_LIST, parameter: 'cadastralProceduresRoles' },
            loadComponent: () =>
              import(
                './cadastralProcedures/documents-associated-procedures/documents-associated-procedures.component'
              ).then((m) => m.DocumentsAssociatedProceduresComponent)
          },
          {
            path: 'outputFormats',
            canMatch: [RoleGuard],
            data: { cadastralProceduresRoles: ADMIN_ROLE_LIST, parameter: 'cadastralProceduresRoles' },
            loadComponent: () =>
              import(
                './cadastralProcedures/output-formats/output-formats.component'
              ).then((m) => m.OutputFormatsComponent)
          },
          {
            path: 'digitalizedSignatures',
            canMatch: [RoleGuard],
            data: { cadastralProceduresRoles: ADMIN_ROLE_LIST, parameter: 'cadastralProceduresRoles' },
            loadComponent: () =>
              import(
                './cadastralProcedures/digitalized-signatures/digitalized-signatures.component'
              ).then((m) => m.DigitalizedSignaturesComponent)
          }
        ]
      },
      {
        path: '**',
        canMatch: [RoleGuard],
        data: { configRoles: ADMIN_ROLE_LIST, parameter: 'configRoles' },
        loadComponent: () =>
          import('../../pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      }
    ]
  }
];

export default routes;
