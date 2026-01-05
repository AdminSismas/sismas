import type { RouteConfig } from '@/routes';
import { IntroWiki } from './components/IntroWiki';

export const wikiRoutes: RouteConfig[] = [
  {
    path: 'introduction',
    element: <IntroWiki />
  }
];
