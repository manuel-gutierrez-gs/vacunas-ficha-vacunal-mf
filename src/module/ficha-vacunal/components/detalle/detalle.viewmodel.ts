import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import type {
  TipoAccion,
  LugarVacunacion,
  LoteConocido,
  TipoLoteDocumentado,
  LoteAdquiridoPor,
  RouterLocation,
  RadioGroupChangeDetail,
  RadioItem,
} from './model/detalle.model';
import {
  DEFAULT_TIPO_ACCION,
  DEFAULT_LOTE_ADQUIRIDO_POR,
  DEFAULT_LUGAR_VACUNACION,
  DEFAULT_LOTE_CONOCIDO,
  DEFAULT_TIPO_LOTE_DOCUMENTADO,
} from './model/detalle.model';

import { MF_EVENT_NAVIGATE_HOME } from '@shared/contract/vacunas-ficha-vacunal.contract';
import { fetchAccionVacunalCached } from '@module/ficha-vacunal/adapter/api/accion-vacunal.api';
import { resolveRuntimeConfig } from '@shared/index';
import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';

export class FichaVacunalDetalleViewModel extends LitElement {
  @state() aliasProductoInmunizacion?: string;
  @state() situacion?: string;
  @state() tipoAccion = DEFAULT_TIPO_ACCION;
  @state() loteAdquiridoPor = DEFAULT_LOTE_ADQUIRIDO_POR;
  @state() lugarVacunacion = DEFAULT_LUGAR_VACUNACION;
  @state() loteConocido = DEFAULT_LOTE_CONOCIDO;
  @state() tipoLoteDocumentado = DEFAULT_TIPO_LOTE_DOCUMENTADO;

  private _loadedId?: string;
  private runtimeConfig?: VacunasFichaVacunalRuntimeConfig;

  override connectedCallback(): void {
    super.connectedCallback();

    const routerLocation = (this as { location?: RouterLocation }).location;
    const id = routerLocation?.params?.id;
    const situacion = routerLocation?.params?.situacion;

    if (!id) return;

    this.situacion = situacion;

    if (this._loadedId !== id) {
      this._loadedId = id;
      this.loadDetalle(id);
    }
  }

  private async loadDetalle(id: string): Promise<void> {
    const config = resolveRuntimeConfig(this.runtimeConfig);
    const accion = await fetchAccionVacunalCached(Number(id), config);
    this.aliasProductoInmunizacion = accion.productoInmunizacion?.alias;
  }

  protected setTipoAccion(valor: TipoAccion): void {
    if (this.tipoAccion !== valor) {
      this.tipoAccion = valor;
      if (valor === 'documentada') {
        this.lugarVacunacion = 'andalucia';
        this.loteConocido = 'si';
        this.tipoLoteDocumentado = 'registrado';
      }
    }
  }

  protected setLoteAdquiridoPor(valor: LoteAdquiridoPor): void {
    this.loteAdquiridoPor = valor;
  }

  protected setLugarVacunacion(valor: LugarVacunacion): void {
    this.lugarVacunacion = valor;
    this.loteConocido = valor === 'fueraEspanna' ? 'no' : 'si';

    if (valor !== 'fueraEspanna') {
      this.tipoLoteDocumentado = 'registrado';
    }
  }

  protected setLoteConocido(valor: LoteConocido): void {
    this.loteConocido = valor;
  }

  protected setTipoLoteDocumentado(valor: TipoLoteDocumentado): void {
    this.tipoLoteDocumentado = valor;
  }

  protected onAccionChanged(e: CustomEvent<RadioGroupChangeDetail>): void {
    const selected = e.detail.radioItems?.find((r: RadioItem) => r.checked);

    if (selected) {
      this.setTipoAccion(selected.value);
    }
  }

  protected navigateBack(): void {
    this.dispatchEvent(
      new CustomEvent(MF_EVENT_NAVIGATE_HOME, {
        bubbles: true,
        composed: true,
      })
    );
  }

  protected getCrumbs() {
    return [
      { url: '', text: 'Búsqueda de paciente', disabled: false },
      { url: '', text: 'Ficha vacunal', disabled: false },
      {
        url: '',
        text: this.aliasProductoInmunizacion ?? 'Detalle',
        disabled: true,
      },
    ];
  }
}
