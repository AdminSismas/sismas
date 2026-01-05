import type { ReactNode } from 'react';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import { FirstSteps } from './pages/FirstSteps';
import { Wiki } from './pages/Wiki';

import { wikiRoutes } from './features/Home/components/wikiPage/wiki-page.routes';
import { NotFound } from './pages/NotFound';

export interface RouteConfig {
  path: string;
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
    path: '/guide',
    element: <FirstSteps />
  },
  {
    path: '/wikiPage',
    element: <Wiki />,
    children: wikiRoutes
  },
  {
    path: '*',
    element: <NotFound />
  }
];
