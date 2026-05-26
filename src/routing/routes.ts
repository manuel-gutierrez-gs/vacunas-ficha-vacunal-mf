import { SticRoute, sticBaseRoutes } from '@sas/lib-stic-route';

export const ROUTES: SticRoute[] = [
  {
    path: '/stic-avisos',
    component: 'stic-avisos',
    name: 'Avisos',
    action: async () => {
      await import('@module/avisos/stic-avisos.view');
    },
  },
  {
    path: '/stic-errores',
    component: 'stic-errores',
    name: 'Errores',
    action: async () => {
      await import('@module/errores/stic-errores.view');
    },
  },
  ...sticBaseRoutes,
];
