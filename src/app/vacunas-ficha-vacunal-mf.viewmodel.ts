import type { Inmunizacion } from '@module/ficha-vacunal/model/ficha-vacunal.model';
import type { AccionVacunalDetalleUI } from '@module/ficha-vacunal/model/accion-vacunal-ui.model';
import { mapAccionVacunalToUI } from '@module/ficha-vacunal/adapter/mapper/accion-vacunal-ui.mapper';
import { fetchAccionVacunalById } from '@module/ficha-vacunal/adapter/api/accion-vacunal.api';
import { resolveRuntimeConfig } from '@shared/config/runtime-config';

import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';

import {
  VacunasFichaVacunalMfError,
  toMfErrorCode,
  toMfErrorMessage,
} from '@shared/errors/mf-error';

import { verifySticThemeLoaded } from '@shared/ui/stic-theme-loader';

import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';


import {
  MF_EVENT_CARD_SELECTED,
  MF_EVENT_ERROR,
  MF_EVENT_LOADED,
  type MfCardSelectedEventDetail,
  type MfErrorEventDetail,
  type MfLoadedEventDetail,
} from '@shared/contract/vacunas-ficha-vacunal.contract';

import { loadFichaVacunalAggregate } from '@module/ficha-vacunal/service/ficha-vacunal.service';
import { bootstrapVacunasFichaVacunalMf } from '@app/bootstrap/bootstrap';

import { fetchCalendarioById } from '@module/ficha-vacunal/adapter/api/calendario.api';
import { AccionVacunal } from '@module/ficha-vacunal/model/accion-vacunal.model';

import type {
  PublicElementErrorState,
  PublicElementReadyState,
  PublicElementStatus,
} from './model/public-state';

export class VacunasFichaVacunalMfViewModel extends LitElement {
  @property({ type: String }) nuhsa = '';
  @property({ attribute: false }) runtimeConfig?: VacunasFichaVacunalRuntimeConfig;

  @state() status: PublicElementStatus = 'idle';
  @state() errorState: PublicElementErrorState | null = null;
  @state() readyState: PublicElementReadyState | null = null;

  @state() calendarioNombre = '';
  @state() accionVacunalPreviaNombre = '';
  
  @state() selectedAccion: AccionVacunalDetalleUI | null = null;
  @state() sheetOpen = false;

  private loadGeneration = 0;

  connectedCallback(): void {
    super.connectedCallback();
    verifySticThemeLoaded();
    void this.bootstrap();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has('nuhsa') || changed.has('runtimeConfig')) {
      void this.bootstrap();
    }
  }

  async refresh(): Promise<void> {
    await this.bootstrap();
  }

  setRuntimeConfig(config: VacunasFichaVacunalRuntimeConfig): void {
    this.runtimeConfig = config;
    void this.bootstrap();
  }

  handleFiltrosChanged(e: CustomEvent): void {
    if (!this.readyState) return;

    const seleccion = (e.detail as string[]) ?? [];

    this.readyState = {
      ...this.readyState,
      seleccion,
    };
  }

  async handleCardSelect(e: CustomEvent<Inmunizacion>): Promise<void> {
    const accion = e.detail;

    const payload: MfCardSelectedEventDetail = {
      nuhsa: this.nuhsa,
      accionVacunalId: accion.accionVacunalId,
      productoInmunizacionAlias: accion.productoInmunizacion?.alias,
      situacionEnum: accion.situacion,
    };

    this.dispatchEvent(
      new CustomEvent(MF_EVENT_CARD_SELECTED, {
        detail: payload,
        bubbles: true,
        composed: true,
      })
    );

    if (!accion.accionVacunalId) return;

    try {
      const config = resolveRuntimeConfig(this.runtimeConfig);

      const detalle = await fetchAccionVacunalById(Number(accion.accionVacunalId), config);

      const uiModel = await mapAccionVacunalToUI(detalle, config);

      this.selectedAccion = uiModel;

      this.sheetOpen = true;
    } catch (error) {
      console.error('Error cargando detalle de acción vacunal', error);
    }
  }

  handleSheetClosed = (): void => {
    this.sheetOpen = false;
    this.selectedAccion = null;
  };

  private async bootstrap(): Promise<void> {
    const generation = ++this.loadGeneration;

    this.status = 'loading';
    this.errorState = null;
    this.readyState = null;

    try {
      if (!this.nuhsa?.trim()) {
        throw new VacunasFichaVacunalMfError('NUHSA_MISSING', 'El atributo nuhsa es obligatorio');
      }

      const config = this.runtimeConfig
        ? resolveRuntimeConfig(this.runtimeConfig)
        : await bootstrapVacunasFichaVacunalMf();

      const aggregate = await loadFichaVacunalAggregate(this.nuhsa.trim(), config);

      if (generation !== this.loadGeneration) return;

      this.readyState = {
        aggregate,
        seleccion: [...aggregate.seleccionInicial],
      };

      this.status = 'ready';

      this.dispatchEvent(
        new CustomEvent<MfLoadedEventDetail>(MF_EVENT_LOADED, {
          detail: { nuhsa: this.nuhsa.trim() },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      if (generation !== this.loadGeneration) return;

      const code = toMfErrorCode(error);
      const message = toMfErrorMessage(error);

      this.errorState = { code, message };
      this.status = 'error';

      this.dispatchEvent(
        new CustomEvent<MfErrorEventDetail>(MF_EVENT_ERROR, {
          detail: { code, message },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}
