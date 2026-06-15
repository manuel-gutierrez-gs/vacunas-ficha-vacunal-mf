import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import {
  HeaderRowImpl,
  StringHeaderCell,
  GenericDataRowImpl,
  DataCellImpl,
  StringDataCellDetailImpl,
} from '@sas/wc-stic-table';

import {
  SticSegmentedControlDataSource,
  SticSegmentedControlClickEventData,
} from '@sas/wc-stic-segmented-control';

import { Alergia, Contraindicacion } from '../../../model/alergias-y-contraindicaciones.model';

import { formatearFechaAlergiasYContraindicaciones } from '../../../utils/alergias-y-contraindicaciones';

import { resolveRuntimeConfig } from '@shared/config/runtime-config';
import { fetchAlergiasContraindicaciones } from '../../../adapter/api/alergias-contraindicaciones.api';

export interface RegistroAlergiaContraindicacion {
  id: string;
  nombre: string;
  nivelCerteza: string;
  fechaRegistro: string;
}

export class AlergiasContraindicacionesViewModel extends LitElement {
  @property({ type: String }) nuhsa = '';

  @property({ type: Array }) listadoAlergiasInicial: any[] = [];

  @property({ type: Array }) listadoContraindicacionesInicial: any[] = [];

  @property({ type: Boolean }) isLoading = false;

  @property({ type: String }) errorMessage = '';

  @property({ type: Object }) selectedRegistro: RegistroAlergiaContraindicacion | null = null;

  protected selectedTab: 'alergias' | 'contraindicaciones' = 'alergias';

  protected segmentedControlDataSource: SticSegmentedControlDataSource = [
    { id: 'alergias', label: 'Alergias', isActivated: true },
    { id: 'contraindicaciones', label: 'Contraindicaciones' },
  ];

  private _loadedNuhsa?: string;

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('nuhsa') && this.nuhsa && this.nuhsa !== this._loadedNuhsa) {
      this._loadedNuhsa = this.nuhsa;
      this.loadData(this.nuhsa);
    }
  }

  private async loadData(nuhsa: string) {
    this.listadoAlergiasInicial = [];
    this.listadoContraindicacionesInicial = [];
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const config = resolveRuntimeConfig((this as any).runtimeConfig);
      const apiResponse = await fetchAlergiasContraindicaciones(nuhsa, config);

      if (this.nuhsa !== nuhsa) return;

      this._actualizarListadoAlergias(apiResponse.alergias ?? []);
      this._actualizarListadoContraindicaciones(apiResponse.contraindicaciones ?? []);
    } catch (e) {
      if (this.nuhsa !== nuhsa) return;

      this.errorMessage =
        'No se ha podido recuperar la información de alergias y contraindicaciones.';
      this._actualizarListadoAlergias([]);
      this._actualizarListadoContraindicaciones([]);
    } finally {
      if (this.nuhsa === nuhsa) {
        this.isLoading = false;
      }
    }
  }

  private _actualizarListadoAlergias(alergias: Alergia[]) {
    this.listadoAlergiasInicial = alergias.map((a, i) => ({
      id: `al-${i}`,
      nombre: a.descripcion,
      nivelCerteza: String(a.estado),
      fechaRegistro: formatearFechaAlergiasYContraindicaciones(a.fechaDeteccion),
    }));
  }

  private _actualizarListadoContraindicaciones(contra: Contraindicacion[]) {
    this.listadoContraindicacionesInicial = contra.map((c, i) => ({
      id: `co-${i}`,
      nombre: c.descripcion,
      nivelCerteza: String(c.estado),
      fechaRegistro: formatearFechaAlergiasYContraindicaciones(c.fechaDeteccion),
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

  protected _onRowClick(e: Event) {
    const row = (e as CustomEvent).detail?.data;
    if (row) this.selectedRegistro = row;
  }
}
