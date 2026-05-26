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

function resolveAppRoutePath(ruta: string, routes: SticRoute[]): string | undefined {
  const appRoutes = getAppRoutes(routes);
  const pathname = ruta.startsWith('/') ? ruta : `/${ruta}`;
  const exact = appRoutes.find(route => route.path === pathname);
  if (exact?.path) {
    return exact.path;
  }
  const slug = pathname.slice(1);
  return appRoutes.find(
    route => route.path === `/stic-${slug}` || route.path.endsWith(`/${slug}`)
  )?.path;
}

export class SticAppNameRouterViewModel extends SticRouterViewModel {
  @property({ type: String }) route = '';
  @property({ type: String }) ruta = '';
  @property({ type: String }) text = '';

  protected _routes: SticRoute[] = ROUTES;
  private _initialRouteApplied = false;

  override firstUpdated(): void {
    void this._applyInitialRoute();
  }

  override update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (this.route.length > 1) {
      void this._findRouteToNavigate(this.route);
    }
    if (changedProperties.has('ruta') && this._initialRouteApplied) {
      void this._applyInitialRoute();
    }
    if (changedProperties.has('text')) {
      this._applyTextToActiveView();
    }
  }

  setInitialRoute(path: string): void {
    this.ruta = path;
    void this._applyInitialRoute();
  }

  private _resolveInitialPath(): string | undefined {
    if (this.ruta) {
      return resolveAppRoutePath(this.ruta, this._routes);
    }
    const { pathname } = window.location;
    if (isAppRoutePathname(pathname, this._routes)) {
      return pathname;
    }
    return getFirstAppRoutePath(this._routes);
  }

  private async _applyInitialRoute(): Promise<void> {
    const path = this._resolveInitialPath();
    if (!path) {
      return;
    }
    await this._router.internalNavigate(path);
    this._initialRouteApplied = true;
    this._applyTextToActiveView();
  }

  private async _findRouteToNavigate(value: string): Promise<void> {
    const matchedRoute = this._routes.find(route => route.name === value);
    if (matchedRoute?.path) {
      await this._router.internalNavigate(matchedRoute.path);
      this._applyTextToActiveView();
    }
  }

  private _applyTextToActiveView(): void {
    const activeView = this.firstElementChild as (HTMLElement & { text?: string }) | null;
    if (activeView && 'text' in activeView) {
      activeView.text = this.text;
    }
  }
}
