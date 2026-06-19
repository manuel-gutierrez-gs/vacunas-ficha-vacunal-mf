import type { SticRoute } from '@sas/lib-stic-route';
import { SticRouterViewModel } from '@sas/lib-stic-route';
import { ROUTES } from './routes';
import { property } from 'lit/decorators.js';

import type { MfNavigateDetalleEventDetail } from '@shared/contract/vacunas-ficha-vacunal.contract';
import {
  MF_EVENT_NAVIGATE_HOME,
  MF_EVENT_NAVIGATE_DETALLE,
} from '@shared/contract/vacunas-ficha-vacunal.contract';
import type { VacunasFichaVacunalRuntimeConfig } from '@shared/index';
import type {
  PacienteContext,
  PacienteContextCallback,
  PacienteContextRequestEvent,
} from '@shared/context/paciente-context';
import { MF_EVENT_PACIENTE_CONTEXT_REQUEST } from '@shared/context/paciente-context';

export class VacunasFichaVacunalRouterViewModel extends SticRouterViewModel {
  @property({ type: String }) route = '';
  @property({ type: String, reflect: true }) nuhsa = '';
  @property({ attribute: false }) runtimeConfig?: VacunasFichaVacunalRuntimeConfig;
  @property({ type: Boolean }) hasHeader = true;

  private _contextSubscribers = new Set<PacienteContextCallback>();

  protected _routes: SticRoute[] = ROUTES;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(MF_EVENT_NAVIGATE_HOME, this.onNavigateHome);
    this.addEventListener(MF_EVENT_NAVIGATE_DETALLE, this.onNavigateDetalle);
    this.addEventListener(MF_EVENT_PACIENTE_CONTEXT_REQUEST, this.handleContextRequest);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(MF_EVENT_NAVIGATE_HOME, this.onNavigateHome);
    this.removeEventListener(MF_EVENT_NAVIGATE_DETALLE, this.onNavigateDetalle);
    this.removeEventListener(MF_EVENT_PACIENTE_CONTEXT_REQUEST, this.handleContextRequest);
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('nuhsa') ||
      changedProperties.has('runtimeConfig') ||
      changedProperties.has('hasHeader')
    ) {
      this.notifyContextSubscribers();
    }
  }

  private handleContextRequest = (e: Event): void => {
    const event = e as PacienteContextRequestEvent;
    event.stopPropagation();

    if (event.subscribe) {
      this._contextSubscribers.add(event.callback);
      event.unsubscribe = () => {
        this._contextSubscribers.delete(event.callback);
      };
    }

    event.callback(this.getContext());
  };

  private getContext(): PacienteContext {
    return {
      nuhsa: this.nuhsa,
      runtimeConfig: this.runtimeConfig,
      hasHeader: this.hasHeader,
    };
  }

  private notifyContextSubscribers() {
    const context = this.getContext();
    for (const callback of this._contextSubscribers) {
      callback(context);
    }
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
