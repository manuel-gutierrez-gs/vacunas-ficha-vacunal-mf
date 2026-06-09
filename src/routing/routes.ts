import { SticRoute, sticBaseRoutes } from '@sas/lib-stic-route';

export const ROUTES: SticRoute[] = [
  {
    path: '/',
    component: 'vacunas-ficha-vacunal-home',
    name: 'Ficha Vacunal',
    action: async () => {
      await import('../app/vacunas-ficha-vacunal-home.view');
    },
  },
  ...sticBaseRoutes,
];
