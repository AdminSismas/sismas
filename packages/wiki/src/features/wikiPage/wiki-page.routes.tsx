import type { RouteConfig } from '@/routes';
import { IntroWiki } from './components/introduction/IntroWiki';
import { Chapter1 } from './components/chapter1/Chapter1';

export const wikiRoutes: RouteConfig[] = [
  {
    path: '/wikiPage/introduction',
    title: 'Introducción',
    element: <IntroWiki />
  },
  {
    path: '/wikiPage/chapter1',
    title: 'Capítulo 1',
    element: <Chapter1 />
  }
];
