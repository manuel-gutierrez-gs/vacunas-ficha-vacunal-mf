import { SticRoute, SticRouterViewModel } from '@sas/lib-stic-route';
import { ROUTES } from './routes';
import { property } from 'lit/decorators.js';
import { PropertyValueMap } from 'lit';

export class VacunasFichaVacunalRouterViewModel extends SticRouterViewModel {
  @property({ type: String }) route = '';
  @property({ attribute: false }) runtimeConfig?: any;

  protected _routes: SticRoute[] = ROUTES;

  setRuntimeConfig(config: any): void {
    this.runtimeConfig = config;
    // Pass it to the active view if it's already rendered
    const child = this.querySelector('vacunas-ficha-vacunal-home') as any;
    if (child && typeof child.setRuntimeConfig === 'function') {
      child.setRuntimeConfig(config);
    }
  }

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
