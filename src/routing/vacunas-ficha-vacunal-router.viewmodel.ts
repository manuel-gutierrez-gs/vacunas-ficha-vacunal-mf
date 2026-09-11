import type { SticRoute } from '@sas/lib-stic-route';
import { CreateIsolatedCapability, type CapabilityFeatureFlag } from '@sas/lib-stic-capabilities';
import { SticMicrofrontendViewModel } from '@sas/wc-stic-microfrontend';
import { property } from 'lit/decorators.js';

import { ROUTES } from './routes';
import { VacunasFichaVacunalRouterDelegate } from './vacunas-ficha-vacunal-router.delegate';

import type { MfNavigateDetalleEventDetail } from '@shared/contract/vacunas-ficha-vacunal.contract';
import {
  MF_EVENT_ERROR,
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
import { verifySticThemeLoaded } from '@shared/ui/stic-theme-loader';

export const MFE_CAPABILITY_CONFIGURATION: CapabilityFeatureFlag[] = [
  {
    type: 'Isolated',
    isEnabled: true,
    capability: CreateIsolatedCapability,
    configuration: {
      eventKeyCollection: [MF_EVENT_ERROR],
      activateHostTheming: true,
    },
  },
];

export class VacunasFichaVacunalRouterViewModel extends SticMicrofrontendViewModel {
  @property({ type: String }) route = '';
  @property({ type: String, reflect: true }) nuhsa = '';
  @property({ attribute: false }) runtimeConfig?: VacunasFichaVacunalRuntimeConfig;
  @property({ type: Boolean }) hasHeader = true;

  @property({ type: String })
  public currentRoutePath = '/';

  @property({ type: Boolean })
  public internalNavigation = true;

  private readonly _router = new VacunasFichaVacunalRouterDelegate();
  private _contextSubscribers = new Set<PacienteContextCallback>();
  private _routerInitialized = false;

  protected _routes: SticRoute[] = ROUTES;

  constructor() {
    super();
    this._registerCapabilityConfiguration(MFE_CAPABILITY_CONFIGURATION);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (window.self === window.top) {
      verifySticThemeLoaded();
    }
    this.addEventListener(MF_EVENT_NAVIGATE_HOME, this.onNavigateHome);
    this.addEventListener(MF_EVENT_NAVIGATE_DETALLE, this.onNavigateDetalle);
    this.addEventListener(MF_EVENT_PACIENTE_CONTEXT_REQUEST, this.handleContextRequest);

    this._router.internalNavigation = this.internalNavigation;
    this._routerInitialized = true;
    this._router.attach(this, this._routes);
  }

  disconnectedCallback(): void {
    this._routerInitialized = false;
    this._router.disconnect();
    super.disconnectedCallback();
    this.removeEventListener(MF_EVENT_NAVIGATE_HOME, this.onNavigateHome);
    this.removeEventListener(MF_EVENT_NAVIGATE_DETALLE, this.onNavigateDetalle);
    this.removeEventListener(MF_EVENT_PACIENTE_CONTEXT_REQUEST, this.handleContextRequest);
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('internalNavigation')) {
      this._router.internalNavigation = this.internalNavigation;
    }

    if (changedProperties.has('currentRoutePath') && this._routerInitialized) {
      this._router.currentRoutePath = this.currentRoutePath;
    }

    if (
      changedProperties.has('runtimeConfig') ||
      changedProperties.has('nuhsa') ||
      changedProperties.has('hasHeader')
    ) {
      this.notifyContextSubscribers();
    }
  }

  protected _setRoutes(routes: SticRoute[]): void {
    this._routes = routes;
    if (this._routerInitialized) {
      this._router.setRoutes(routes);
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

  private notifyContextSubscribers(): void {
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
