import '@module/ficha-vacunal/components/cabecera/cabecera.view';
import '@module/ficha-vacunal/components/filtros/filtros.view';
import '@module/ficha-vacunal/components/tarjetero/tarjetero.view';
import '@module/ficha-vacunal/components/sheet/sheet.view';

import { html, nothing } from 'lit';

import { vacunasFichaVacunalMfStyles } from './css/vacunas-ficha-vacunal-mf.css';
import { VacunasFichaVacunalMfViewModel } from './vacunas-ficha-vacunal-mf.viewmodel';

export class VacunasFichaVacunalMfView extends VacunasFichaVacunalMfViewModel {
  static styles = vacunasFichaVacunalMfStyles;

  render() {
    if (this.status === 'loading' || this.status === 'idle') {
      return html`<div class="mf-state">Cargando ficha vacunal…</div>`;
    }

    if (this.status === 'error' && this.errorState) {
      return html`
        <div class="mf-state mf-state--error">
          <p><strong>${this.errorState.code}</strong></p>
          <p>${this.errorState.message}</p>
        </div>
      `;
    }

    if (this.status !== 'ready' || !this.readyState) {
      return nothing;
    }

    const { aggregate, seleccion } = this.readyState;

    return html`
      <div class="mf-root">
        <ficha-vacunal-cabecera
          .resumenPaciente=${aggregate.resumenPaciente}
        ></ficha-vacunal-cabecera>

        <div class="mf-root__body">
          <div class="mf-root__body-header">
            <div class="mf-root__header-title">Ficha Vacunación</div>

            <div class="mf-root__header-actions">
              <stic-icon-button icon="settings" size="md" disabled></stic-icon-button>
              <stic-divider vertical></stic-divider>
              <stic-icon-button icon="download" size="md" disabled></stic-icon-button>
              <stic-button
                label="Nueva vacuna aislada"
                variant="primary"
                size="md"
                disabled
              ></stic-button>
            </div>
          </div>

          <ficha-vacunal-filtros
            .filterSet=${aggregate.filterSet}
            @filtros-actualizados=${this.handleFiltrosChanged}
            @filtros-eliminados=${this.handleFiltrosChanged}
          ></ficha-vacunal-filtros>

          <ficha-vacunal-tarjetero
            .franjasEdad=${aggregate.franjasEdad}
            .seleccion=${seleccion}
            @card-select=${this.handleCardSelect}
          ></ficha-vacunal-tarjetero>
        </div>

        <ficha-vacunal-sheet
          .open=${this.sheetOpen}
          .accion=${this.selectedAccion}
          .calendarioNombre=${this.calendarioNombre}
          .accionVacunalPreviaNombre=${this.accionVacunalPreviaNombre}
          @sheet-closed=${this.handleSheetClosed}
        ></ficha-vacunal-sheet>
        
      </div>
    `;
  }
}

window.customElements.define('vacunas-ficha-vacunal-mf', VacunasFichaVacunalMfView);
declare global {
  interface HTMLElementTagNameMap {
    'vacunas-ficha-vacunal-mf': VacunasFichaVacunalMfView;
  }
}
