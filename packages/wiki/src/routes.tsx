import type { ReactNode } from 'react';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import { FirstSteps } from './pages/FirstSteps';
import { NotFound } from './pages/NotFound';
import { Wiki } from './pages/Wiki';

interface RouteConfig {
  path: string;
  element: ReactNode;
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
    element: <Wiki />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
