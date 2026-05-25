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
  {
    path: '/counter',
    component: 'counter-component',
    name: 'Counter',
    action: async () => {
      await import('../module/counter/counter.view');
    },
  },
  ...sticBaseRoutes,
];
