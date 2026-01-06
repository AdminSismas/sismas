import type { ReactNode } from 'react';
import { Home } from './pages/Home';
import FAQ from './pages/FAQ';
import { FirstSteps } from './pages/FirstSteps';
import { wikiRoutes } from './features/Home/components/wikiPage/wiki-page.routes';
import { NotFound } from './pages/NotFound';
import { WikiPage } from './features/Home/components/wikiPage/components/WikiPage';

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
    path: '/guide',
    element: <FirstSteps />
  },
  {
    path: '/wikiPage',
    element: <WikiPage />,
    children: wikiRoutes
  },
  {
    path: '*',
    element: <NotFound />
  }
];
