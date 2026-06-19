import type { Inmunizacion } from '@module/ficha-vacunal/model/ficha-vacunal.model';
import type { AccionVacunalUI } from '@module/ficha-vacunal/model/accion-vacunal-ui.model';
import { fetchAccionVacunalCached } from '@module/ficha-vacunal/adapter/api/accion-vacunal.api';
import { resolveRuntimeConfig } from '@shared/config/runtime-config';

import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { PacienteContextRequestEvent } from '@shared/context/paciente-context';
import type { PacienteContext } from '@shared/context/paciente-context';

import {
  VacunasFichaVacunalMfError,
  toMfErrorCode,
  toMfErrorMessage,
} from '@shared/errors/mf-error';

import { verifySticThemeLoaded } from '@shared/ui/stic-theme-loader';

import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import {
  MF_EVENT_ERROR,
  MF_EVENT_LOADED,
  type MfErrorEventDetail,
  type MfLoadedEventDetail,
} from '@shared/contract/vacunas-ficha-vacunal.contract';

import { loadFichaVacunalAggregate } from '@module/ficha-vacunal/service/ficha-vacunal.service';
import { bootstrapVacunasFichaVacunalMf } from '@app/bootstrap/bootstrap';

import { fetchCalendarioCached } from '@module/ficha-vacunal/adapter/api/calendario.api';

import type {
  PublicElementErrorState,
  PublicElementReadyState,
  PublicElementStatus,
} from './model/public-state';

import {
  MF_EVENT_NAVIGATE_DETALLE,
  type MfNavigateDetalleEventDetail,
} from '@shared/contract/vacunas-ficha-vacunal.contract';

export class VacunasFichaVacunalHomeViewModel extends LitElement {
  @property({ type: String }) nuhsa = '';
  @property({ attribute: false }) runtimeConfig?: VacunasFichaVacunalRuntimeConfig;

  @state() hasHeader = true;

  @state() status: PublicElementStatus = 'idle';
  @state() errorState: PublicElementErrorState | null = null;
  @state() readyState: PublicElementReadyState | null = null;

  @state() selectedAccion: AccionVacunalUI | null = null;
  @state() sheetOpen = false;

  private loadGeneration = 0;
  private _loadedAccionId?: string;
  private _unsubscribeContext?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    verifySticThemeLoaded();

    const event = new PacienteContextRequestEvent(this.handleContextChange, true);
    this.dispatchEvent(event);
    this._unsubscribeContext = event.unsubscribe;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubscribeContext) {
      this._unsubscribeContext();
      this._unsubscribeContext = undefined;
    }
  }

  private handleContextChange = (context: PacienteContext): void => {
    if (this.nuhsa !== context.nuhsa) {
      this.nuhsa = context.nuhsa;
    }
    if (this.runtimeConfig !== context.runtimeConfig) {
      this.runtimeConfig = context.runtimeConfig;
    }
    if (this.hasHeader !== context.hasHeader) {
      this.hasHeader = context.hasHeader;
    }
  };

  protected firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(changedProperties);
    if (!this.nuhsa) {
      // Force bootstrap on first update if nuhsa was not set, to show the error state.
      void this.bootstrap();
    }
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);

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
    const detalleFichaSeleccionada = e.detail;

    if (!detalleFichaSeleccionada.accionVacunalId) return;

    const situacionesNavegacion = [
      'PROGRAMADA',
      'FUERA_PLAZO',
      'PENDIENTE_EN_PLAZO',
      'NO_ADMINISTRADA',
    ];

    if (this._loadedAccionId === detalleFichaSeleccionada.accionVacunalId && this.selectedAccion) {
      if (situacionesNavegacion.includes(detalleFichaSeleccionada.situacion)) {
        this.navigateToDetalle(
          detalleFichaSeleccionada.accionVacunalId,
          detalleFichaSeleccionada.situacion
        );
        return;
      }
      this.sheetOpen = true;
      return;
    }

    try {
      const config = resolveRuntimeConfig(this.runtimeConfig);

      const detalleAccionVacunal = await fetchAccionVacunalCached(
        Number(detalleFichaSeleccionada.accionVacunalId),
        config
      );

      let calendarioNombre;
      if (detalleAccionVacunal.calendario) {
        try {
          const calendario = await fetchCalendarioCached(
            Number(detalleAccionVacunal.calendario),
            config
          );

          calendarioNombre = calendario.nombre;
        } catch (error) {
          console.error(
            `No se pudo cargar el calendario ${detalleAccionVacunal.calendario}`,
            error
          );
        }
      }

      let accionPreviaNombre;
      const idAccionPrevia =
        detalleAccionVacunal.tipoAccionVacunal === 'NO_VACUNACION'
          ? detalleAccionVacunal.datosNoVacunacion?.idAccionPrevia
          : undefined;

      if (idAccionPrevia) {
        try {
          const accionPrevia = await fetchAccionVacunalCached(Number(idAccionPrevia), config);

          accionPreviaNombre = accionPrevia.descripcion;
        } catch (error) {
          console.error(`No se pudo cargar la acción previa ${idAccionPrevia}`, error);
        }
      }

      const uiModel: AccionVacunalUI = {
        detalleAccionVacunal,
        detalleFichaVacunalSeleccionada: {
          administradaPorEntePrivado: detalleFichaSeleccionada.administradaPorEntePrivado,
          documentada: detalleFichaSeleccionada.documentada,
          negacionDePaciente: detalleFichaSeleccionada.negacionDePaciente,
          situacion: detalleFichaSeleccionada.situacion,
        },

        calendarioNombre,
        accionPreviaNombre,
      };

      this.selectedAccion = uiModel;
      this._loadedAccionId = detalleFichaSeleccionada.accionVacunalId;

      if (situacionesNavegacion.includes(detalleFichaSeleccionada.situacion)) {
        this.navigateToDetalle(
          detalleFichaSeleccionada.accionVacunalId,
          detalleFichaSeleccionada.situacion
        );
        return;
      }

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

  private navigateToDetalle(id: string, situacion: string): void {
    this.dispatchEvent(
      new CustomEvent<MfNavigateDetalleEventDetail>(MF_EVENT_NAVIGATE_DETALLE, {
        detail: { id, situacion },
        bubbles: true,
        composed: true,
      })
    );
  }
}
