import { SticRoute, sticBaseRoutes } from '@sas/lib-stic-route';

export const ROUTES: SticRoute[] = [
  {
    path: '/stic-example',
    component: 'stic-example',
    name: 'Example',
    action: async () => {
      await import('../module/example/stic-example.view');
    },
  },
  ...sticBaseRoutes,
];
