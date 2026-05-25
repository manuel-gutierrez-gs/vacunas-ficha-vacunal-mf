import { SticRoute, SticRouterViewModel } from '@sas/lib-stic-route';
import { ROUTES } from './routes';
import { property } from 'lit/decorators.js';
import { PropertyValueMap } from 'lit';

export class SticAppNameRouterViewModel extends SticRouterViewModel {
  @property({ type: String }) route = '';
  protected _routes: SticRoute[] = ROUTES;

  override update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (this.route.length > 1) {
      this._findRouteToNavigate(this.route);
    }
  }

  private _findRouteToNavigate(value: string) {
    const a = this._routes.find(route => route.name === value);
    this._navigateToPath(a!);
  }

  private _navigateToPath(route: SticRoute) {
    this._router.internalNavigate(route.path);
  }
}
