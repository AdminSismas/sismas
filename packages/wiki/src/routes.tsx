import type { ReactNode } from 'react';
import { Home } from '@pages/Home';
import FAQ from '@pages/FAQ';
import { wikiRoutes } from '@features/wikiPage/wiki-page.routes';
import { NotFound } from '@pages/NotFound';
import { WikiPage } from '@/pages/WikiPage';
import { wikiEditRoutes } from './features/wikiEdit/wiki-edit.routes';

export interface RouteConfig {
  path: string;
  title?: string;
  element?: ReactNode;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/faq',
    element: <FAQ />
  },
  {
    path: '/wikiEdit',
    element: <WikiPage routes={wikiEditRoutes} />,
    children: wikiEditRoutes
  },
  {
    path: '/wikiPage',
    element: <WikiPage routes={wikiRoutes} />,
    children: wikiRoutes
  },
  {
    path: '*',
    element: <NotFound />
  }
];
