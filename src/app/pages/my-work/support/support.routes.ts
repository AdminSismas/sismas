import { SupportComponent } from './support.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    component: SupportComponent,
    data: {
      toolbarShadowEnabled: true
    },
    children: [
      {
        path: 'support',
        loadComponent: () =>
          import('./support.component').then(
            (m) => m.SupportComponent
          )
      },
      {
        path: 'answer-support',
        loadComponent: () =>
          import('@features/support/components/answer-support/answer-support.component').then(
            (m) => m.AnswerSupportComponent
          )
      }
    ]
  }
];

export default routes;
