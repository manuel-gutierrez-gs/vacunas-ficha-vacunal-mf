import { SticRoute, SticRouterViewModel } from '@sas/lib-stic-route';
import { ROUTES } from './routes';
import { property } from 'lit/decorators.js';

import {
  MF_EVENT_NAVIGATE_HOME,
  MF_EVENT_NAVIGATE_DETALLE,
  MfNavigateDetalleEventDetail,
} from '@shared/contract/vacunas-ficha-vacunal.contract';

export class VacunasFichaVacunalRouterViewModel extends SticRouterViewModel {
  @property({ type: String }) route = '';
  @property({ attribute: false }) runtimeConfig?: any;

  protected _routes: SticRoute[] = ROUTES;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(MF_EVENT_NAVIGATE_HOME, this.onNavigateHome);
    this.addEventListener(MF_EVENT_NAVIGATE_DETALLE, this.onNavigateDetalle);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(MF_EVENT_NAVIGATE_HOME, this.onNavigateHome);
    this.removeEventListener(MF_EVENT_NAVIGATE_DETALLE, this.onNavigateDetalle);
  }

  private onNavigateHome = (): void => {
    this.currentRoutePath = '/';
  };

  private onNavigateDetalle = (e: Event): void => {
    const detail = (e as CustomEvent<MfNavigateDetalleEventDetail>).detail;
    const situacion = encodeURIComponent(detail.situacion ?? '');

    this.currentRoutePath = `/detalle/${detail.id}/${situacion}`;
  };
}
