import { SticRoute, SticRouterViewModel } from '@sas/lib-stic-route';
import { ROUTES } from './routes';
import { property } from 'lit/decorators.js';
import { PropertyValueMap } from 'lit';

function getAppRoutes(routes: SticRoute[]): SticRoute[] {
  return routes.filter(route => route.path && !route.path.includes('(') && !route.redirect);
}

function getFirstAppRoutePath(routes: SticRoute[]): string | undefined {
  return getAppRoutes(routes)[0]?.path;
}

function isAppRoutePathname(pathname: string, routes: SticRoute[]): boolean {
  return getAppRoutes(routes).some(route => route.path === pathname);
}

export class SticAppNameRouterViewModel extends SticRouterViewModel {
  @property({ type: String }) route = '';
  protected _routes: SticRoute[] = ROUTES;

  override connectedCallback(): void {
    super.connectedCallback();
    const pathname = window.location.pathname;
    if (!isAppRoutePathname(pathname, this._routes)) {
      const firstPath = getFirstAppRoutePath(this._routes);
      if (firstPath) {
        void this._router.internalNavigate(firstPath);
      }
    }
  }

  override update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (this.route.length > 1) {
      this._findRouteToNavigate(this.route);
    }
  }

  private _findRouteToNavigate(value: string) {
    const matchedRoute = this._routes.find(route => route.name === value);
    if (matchedRoute?.path) {
      void this._router.internalNavigate(matchedRoute.path);
    }
  }
}
