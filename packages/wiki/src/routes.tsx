import type { ReactNode } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import { NotFound } from './pages/NotFound';

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
    path: '/about',
    element: <About />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
