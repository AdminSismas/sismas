import type { RouteConfig } from '@/routes';
import { WikiEdit } from './components/WikiEdit';
import { WikiCreate } from './components/WikiCreate';
import { WikiEditIntroduction } from './components/WikiEditIntroduction';

export const wikiEditRoutes: RouteConfig[] = [
  {
    path: '/wikiEdit',
    title: '❓ Introducción',
    element: <WikiEditIntroduction />
  },
  {
    path: '/wikiEdit/create',
    title: '🆕 Crear',
    element: <WikiCreate />
  },
  {
    path: '/wikiEdit/edit',
    title: '🏗️ Editar',
    element: <WikiEdit />
  }
];
