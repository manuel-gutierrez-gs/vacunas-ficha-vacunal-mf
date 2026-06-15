import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AlergiasContraindicacionesViewModel } from './alergias-contraindicaciones.viewmodel';

import '@sas/wc-stic-segmented-control';
import '@sas/wc-stic-table';
import '@sas/wc-stic-icon';
import '@sas/wc-stic-tag';

@customElement('vacunas-alergias-contraindicaciones-modal')
export class AlergiasContraindicacionesModalView extends AlergiasContraindicacionesViewModel {
  render() {
    const lista =
      this.selectedTab === 'alergias'
        ? this.listadoAlergiasInicial
        : this.listadoContraindicacionesInicial;

    const numeroResultados = lista?.length ?? 0;

    const textoResultados =
      this.selectedTab === 'alergias'
        ? `${numeroResultados} alergias encontradas`
        : `${numeroResultados} contraindicaciones encontradas`;

    return html`
      <div class="container">
        <stic-segmented-control
          name="alergiasContra"
          .dataSource=${this.segmentedControlDataSource}
          size="md"
          @segmentedControl:click=${this._handleSegmentClick}
        ></stic-segmented-control>

        <p class="results-count">${textoResultados}</p>

        ${this.errorMessage
          ? html`<div class="error">${this.errorMessage}</div>`
          : this.isLoading && lista.length === 0
            ? html`<div class="loading">Cargando información...</div>`
            : lista.length === 0
              ? html``
              : html`
                  <div class="tabla">
                    <stic-table
                      .items=${lista}
                      .headerRow=${this.getHeaderRow()}
                      .dataRow=${this.getDataRow()}
                      .dataSource=${lista as any}
                      .selectedKey=${this.selectedRegistro?.id ?? null}
                      @table:detail=${this._onRowClick}
                    ></stic-table>
                  </div>
                `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vacunas-alergias-contraindicaciones-modal': AlergiasContraindicacionesModalView;
  }
}
