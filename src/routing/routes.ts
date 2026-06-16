import type { SticRoute } from '@sas/lib-stic-route';
import { sticBaseRoutes } from '@sas/lib-stic-route';

export const ROUTES: SticRoute[] = [
  {
    path: '/',
    component: 'vacunas-ficha-vacunal-home',
    name: 'Ficha Vacunal',
    action: async () => {
      await import('../app/vacunas-ficha-vacunal-home.view');
    },
  },
  {
    path: '/detalle/:id/:situacion',
    component: 'ficha-vacunal-detalle',
    action: async () => {
      await import('../module/ficha-vacunal/components/detalle/detalle.view');
    },
  },
  ...sticBaseRoutes,
];
