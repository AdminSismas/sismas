import type { RouteConfig } from '@/routes';
import { WikiEdit } from './components/WikiEdit';
import { WikiCreate } from './components/WikiCreate';

export const wikiEditRoutes: RouteConfig[] = [
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
