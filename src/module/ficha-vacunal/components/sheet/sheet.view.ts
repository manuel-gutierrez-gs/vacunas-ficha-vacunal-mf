import '@sas/wc-stic-sheet';
import '@sas/wc-stic-divider';
import '@sas/wc-stic-result';
import '@sas/wc-stic-text';
import '@sas/wc-stic-input';
import '@sas/wc-stic-tag';

import { html, nothing } from 'lit';
import { FichaVacunalSheetViewModel } from './sheet.viewmodel';
import { fichaVacunalSheetStyles } from './css/sheet.css';
import { capitalize } from '../../utils/string.utils';

export class FichaVacunalSheetView extends FichaVacunalSheetViewModel {
  static styles = fichaVacunalSheetStyles;

  render() {
    if (!this.open || !this.accion) return nothing;

    console.log(this.accion);

    return html`
      <stic-sheet-modal-overlay
        .open=${this.open}
        title=${this.accion?.detalleAccionVacunal?.productoInmunizacion?.alias ?? ''}
        tag=${capitalize(this.accion?.detalleFichaVacunalSeleccionada.situacion) ?? ''}
        @sheet:closed=${this.onClose}
      >
        <div class="ficha-vacunal-sheet__container">
          <section class="ficha-vacunal-sheet__section ficha-vacunal-sheet__section--main">
            <stic-result-grid
              readonly
              class="ficha-vacunal-sheet__grid"
              .dataSource=${this.itemsDatosSuperiores}
            ></stic-result-grid>
          </section>

          <stic-divider class="ficha-vacunal-sheet__divider"></stic-divider>

          <section class="ficha-vacunal-sheet__section ficha-vacunal-sheet__section--reactions">
            <h3 class="ficha-vacunal-sheet__title">Reacciones Adversas</h3>

            <div class="ficha-vacunal-sheet__counter">
              <stic-text text="Asociadas (${this.itemsReacciones?.length ?? 0})"></stic-text>
            </div>

            <div class="ficha-vacunal-sheet__list">
              ${this.itemsReacciones?.length
                ? html`
                    <stic-result-list
                      class="ficha-vacunal-sheet__result-list"
                      .dataSource=${this.itemsReacciones}
                    ></stic-result-list>
                  `
                : html` <stic-text text="No hay reacciones adversas asociadas"></stic-text> `}
            </div>

            <h3 class="ficha-vacunal-sheet__title">Disponibles</h3>

            <div class="ficha-vacunal-sheet__search">
              <stic-input-v2-text
                labelText="Buscar"
                labelIcon="search"
                value=""
              ></stic-input-v2-text>
            </div>

            <div class="ficha-vacunal-sheet__empty">
              <stic-text text="No hay reacciones adversas disponibles"></stic-text>
            </div>
          </section>
        </div>
      </stic-sheet-modal-overlay>
    `;
  }

  private onClose = () => {
    this.dispatchEvent(
      new CustomEvent('sheet-closed', {
        bubbles: true,
        composed: true,
      })
    );
  };
}

window.customElements.define('ficha-vacunal-sheet', FichaVacunalSheetView);

declare global {
  interface HTMLElementTagNameMap {
    'ficha-vacunal-sheet': FichaVacunalSheetView;
  }
}
