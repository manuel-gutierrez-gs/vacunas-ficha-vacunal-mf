import type { SticRoute } from '@sas/lib-stic-route';
import { VaadinSticRouter } from '@sas/lib-stic-route';

export class VacunasFichaVacunalRouterDelegate {
  private readonly _router = new VaadinSticRouter();
  private _currentRoutePath = '/';

  public internalNavigation = true;

  attach(outlet: HTMLElement, routes: SticRoute[]): void {
    this._router.setOutletHtml(outlet);
    this._router.setRoutes(routes);
    this._router.subscribe();
  }

  setRoutes(routes: SticRoute[]): void {
    this._router.setRoutes(routes);
  }

  get currentRoutePath(): string {
    return this._currentRoutePath;
  }

  set currentRoutePath(path: string) {
    if (this._currentRoutePath === path) return;

    if (this.internalNavigation) {
      void this._router.internalNavigate(path);
    } else {
      this._router.browserUrlNavigate(path);
    }

    this._currentRoutePath = path;
  }

  disconnect(): void {
    this._router.unSubscribe();
  }
}
