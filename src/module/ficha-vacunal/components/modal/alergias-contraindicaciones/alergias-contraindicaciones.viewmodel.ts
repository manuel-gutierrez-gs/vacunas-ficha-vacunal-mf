import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import {
  HeaderRowImpl,
  StringHeaderCell,
  GenericDataRowImpl,
  DataCellImpl,
  StringDataCellDetailImpl,
} from '@sas/wc-stic-table';

import type {
  SticSegmentedControlDataSource,
  SticSegmentedControlClickEventData,
} from '@sas/wc-stic-segmented-control';

import type {
  Alergia,
  Contraindicacion,
} from '@module/ficha-vacunal/model/alergias-y-contraindicaciones.model';

import {
  formatearFechaAlergiasYContraindicaciones,
  renderNivelCertezaTag,
} from '@module/ficha-vacunal/utils/alergias-y-contraindicaciones';

import { resolveRuntimeConfig } from '@shared/config/runtime-config';
import { fetchAlergiasContraindicacionesCached } from '@module/ficha-vacunal/adapter/api/alergias-contraindicaciones.api';
import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import type { RegistroAlergiaContraindicacion } from './model/mode-alergias-contraindicaciones.model';
import { PacienteContextRequestEvent } from '@shared/context/paciente-context';
import type { PacienteContext } from '@shared/context/paciente-context';

export class AlergiasContraindicacionesViewModel extends LitElement {
  @property({ type: Array }) listadoAlergiasInicial: RegistroAlergiaContraindicacion[] = [];
  @property({ type: Array }) listadoContraindicacionesInicial: RegistroAlergiaContraindicacion[] =
    [];
  @property({ type: Boolean }) isLoading = false;
  @property({ type: String }) errorMessage = '';
  @property({ type: Object }) selectedRegistro: RegistroAlergiaContraindicacion | null = null;

  protected selectedTab: 'alergias' | 'contraindicaciones' = 'alergias';

  protected segmentedControlDataSource: SticSegmentedControlDataSource = [
    { id: 'alergias', label: 'Alergias', isActivated: true },
    { id: 'contraindicaciones', label: 'Contraindicaciones' },
  ];

  private _contextNuhsa = '';
  private runtimeConfig?: VacunasFichaVacunalRuntimeConfig;
  private _unsubscribeContext?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
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
    this.runtimeConfig = context.runtimeConfig;
    if (this._contextNuhsa !== context.nuhsa) {
      this._contextNuhsa = context.nuhsa;
      if (this._contextNuhsa) {
        void this.loadData(this._contextNuhsa);
      }
    }
  };

  private async loadData(nuhsa: string) {
    this.listadoAlergiasInicial = [];
    this.listadoContraindicacionesInicial = [];
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const config = resolveRuntimeConfig(this.runtimeConfig);
      const apiResponse = await fetchAlergiasContraindicacionesCached(nuhsa, config);

      if (this._contextNuhsa !== nuhsa) return;

      this._actualizarListadoAlergias(apiResponse.alergias ?? []);
      this._actualizarListadoContraindicaciones(apiResponse.listaContraindic ?? []);
    } catch (error) {
      console.error('Error al obtener alergias o contraindicaciones: ', error);
      if (this._contextNuhsa !== nuhsa) return;

      this.errorMessage =
        'No se ha podido recuperar la información de alergias y contraindicaciones.';
      this._actualizarListadoAlergias([]);
      this._actualizarListadoContraindicaciones([]);
    } finally {
      if (this._contextNuhsa === nuhsa) {
        this.isLoading = false;
      }
    }
  }

  private _actualizarListadoAlergias(alergias: Alergia[]) {
    this.listadoAlergiasInicial = alergias.map((alergia, index) => ({
      id: `alergia-${index}`,
      nombre: alergia.descripcion,
      nivelCerteza: String(alergia.estado),
      fechaRegistro: formatearFechaAlergiasYContraindicaciones(alergia.fechaDeteccion),
    }));
  }

  private _actualizarListadoContraindicaciones(contraindicaciones: Contraindicacion[]) {
    this.listadoContraindicacionesInicial = contraindicaciones.map((contraindicacion, index) => ({
      id: `contraindicacion-${index}`,
      nombre: contraindicacion.descripcion,
      nivelCerteza: String(contraindicacion.estado),
      fechaRegistro: formatearFechaAlergiasYContraindicaciones(contraindicacion.fechaDeteccion),
    }));
  }

  protected _handleSegmentClick(e: CustomEvent<SticSegmentedControlClickEventData>) {
    const { id, isActivated } = e.detail;
    if (!isActivated) return;

    if (id === 'alergias' || id === 'contraindicaciones') {
      this.selectedTab = id;
      this.requestUpdate();
    }
  }

  getHeaderRow() {
    const titulo = this.selectedTab === 'alergias' ? 'ALERGIA' : 'CONTRAINDICACIÓN';

    return new HeaderRowImpl({
      cell: [
        new StringHeaderCell({ cellDetail: { data: titulo } }),
        new StringHeaderCell({ cellDetail: { data: 'NIVEL DE CERTEZA' } }),
        new StringHeaderCell({ cellDetail: { data: 'FECHA REGISTRO' } }),
      ],
    });
  }

  getDataRow() {
    return new GenericDataRowImpl<RegistroAlergiaContraindicacion>({
      cell: [
        new DataCellImpl({
          cellDetail: new StringDataCellDetailImpl({
            cellPropertyExpression: x => x.nombre,
          }),
        }),
        new DataCellImpl({
          cellDetail: new StringDataCellDetailImpl({
            cellPropertyExpression: x => x.nivelCerteza,
            dataFormater: ((s: string) => renderNivelCertezaTag(s)) as unknown as (
              value: string
            ) => string,
          }),
        }),
        new DataCellImpl({
          cellDetail: new StringDataCellDetailImpl({
            cellPropertyExpression: x => x.fechaRegistro,
          }),
        }),
      ],
    });
  }
}
