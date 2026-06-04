import '@sas/wc-stic-sheet';
import '@sas/wc-stic-divider';
import '@sas/wc-stic-result';
import '@sas/wc-stic-text';
import '@sas/wc-stic-input';

import { html, nothing } from 'lit';
import { FichaVacunalSheetViewModel } from './sheet.viewmodel';
import { fichaVacunalSheetStyles } from './css/sheet.css';

export class FichaVacunalSheetView extends FichaVacunalSheetViewModel {
  static styles = fichaVacunalSheetStyles;

  render() {
    if (!this.open || !this.accion) return nothing;
    console.log(this.accion)
    return html`
      <stic-sheet-modal-overlay
        .open=${this.open}
        title=${this.accion?.productoInmunizacion?.alias ?? ''}
        tag=${this.accion.situacion}
        @sheet:closed=${this.onClose}
      >
        <div class="ficha-vacunal-sheet__container">
          <div class="box">
            <stic-result-grid
              readonly
              .dataSource=${this.itemsAccionVacunacion}
            ></stic-result-grid>

            <stic-result-grid
              class="grid-2"
              readonly
              .dataSource=${this.itemsAccionVacunacionSegundo}
            ></stic-result-grid>
          </div>

          <stic-divider></stic-divider>

          <div class="box">
            <div class="title">
              Reacciones Adversas
            </div>

            <div>
              <stic-text
                text="Asociadas (${this.itemsReaccionAdversa?.length ?? 0})"
              ></stic-text>

            </div>
            <div>
              ${
                this.itemsReaccionAdversa?.length
                  ? html`
                      <stic-result-list
                        .dataSource=${this.itemsReaccionAdversa}
                      ></stic-result-list>
                    `
                  : html`
                      <stic-text
                        text="No hay reacciones adversas asociadas"
                      ></stic-text>
                    `
              }
            </div>
            <div class="title">
              Disponibles
            </div>

            <stic-input-v2-text
              labelText="Buscar"
              labelIcon="search"
              value=""
            ></stic-input-v2-text>

            <div class="empty-state">
              <stic-text text="No hay reacciones adversas disponibles"></stic-text>
            </div>

          </div>

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