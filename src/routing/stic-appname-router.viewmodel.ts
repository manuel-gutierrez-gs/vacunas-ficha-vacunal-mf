import { SticRoute, SticRouterViewModel } from '@sas/lib-stic-route';
import { ROUTES } from './routes';

export class SticAppNameRouterViewModel extends SticRouterViewModel {
  protected _routes: SticRoute[] = ROUTES;
}
