import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { proFlowDataResolver } from './data-access/proFlowDataResolver';
import { resourcesDataResolver } from './data-access/resourcesDataResolver';

const routes: VexRoutes = [
  {
    path: '',
    redirectTo: 'myWork/tasks/tasksPanel/assignedTasks',
    pathMatch: 'full'
  },
  {
    path: 'bpm-core/:id',
    loadComponent: () =>
      import('./../bpm/bmp-core/bmp-core.component').then(
        (m) => m.BmpCoreComponent
      ),
    resolve: { proFlow: proFlowDataResolver, resources: resourcesDataResolver }
  },
  {
    path: 'initiateFilingProcedure/:id',
    loadComponent: () =>
      import('./../bpm/initiate-filing-procedure/initiate-filing-procedure.component').then(
        (m) => m.InitiateFilingProcedureComponent
      )
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../pages/errors/error-404/error-404.component').then(
        (m) => m.Error404Component
      )
  }
];

export default routes;
