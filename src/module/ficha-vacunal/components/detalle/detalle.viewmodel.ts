import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { MF_EVENT_NAVIGATE_HOME } from '@shared/contract/vacunas-ficha-vacunal.contract';
import { fetchAccionVacunalById } from '@module/ficha-vacunal/adapter/api/accion-vacunal.api';
import { resolveRuntimeConfig } from '@shared/index';

export class FichaVacunalDetalleViewModel extends LitElement {
  @state() aliasProductoInmunizacion?: string;
  @state() situacion?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    const routerLocation = (this as any).location;
    const id = routerLocation?.params?.id;
    const situacion = routerLocation?.params?.situacion;

    if (!id) return;

    this.situacion = situacion;

    this.loadDetalle(id);
  }

  private async loadDetalle(id: string): Promise<void> {
    const config = resolveRuntimeConfig((this as any).runtimeConfig);
    const accion = await fetchAccionVacunalById(Number(id), config);
    this.aliasProductoInmunizacion = accion.productoInmunizacion?.alias;
  }

  protected navigateBack(): void {
    this.dispatchEvent(
      new CustomEvent(MF_EVENT_NAVIGATE_HOME, {
        bubbles: true,
        composed: true,
      })
    );
  }
}
