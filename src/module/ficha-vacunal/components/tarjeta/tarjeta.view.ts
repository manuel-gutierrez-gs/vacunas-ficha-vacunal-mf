import '@sas/wc-stic-ripple';
import '@sas/wc-stic-icon';
import '@sas/wc-stic-tooltip';
import '@sas/wc-stic-tag-set';

import { html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import { TarjetaViewModel } from './tarjeta.viewmodel';
import { tarjetaStyles } from './css/tarjeta.css';

export class TarjetaView extends TarjetaViewModel {
  static styles = tarjetaStyles;

  render() {
    const icons = this.getIcons();
    const tags = this.getTagSetDataSource();
    const detalle = this.getDetalleSituacion();
    const pendiente = this.esPendientePrimeraDosis();

    return html`
      <div class=${classMap(this.getCardClassNames())} @click=${this.onSelect}>
        <div class="ficha-vacunal-card__click-area">
          <stic-ripple></stic-ripple>
          <div class="ficha-vacunal-card__header">
            <span class="ficha-vacunal-card__title"> ${this.getNombreVacuna()} </span>

            ${icons.length
              ? html`
                  <div class="ficha-vacunal-card__icons">${icons.map(i => this.renderIcon(i))}</div>
                `
              : nothing}
          </div>

          <div class="ficha-vacunal-card__footer">
            ${tags.length
              ? html` <stic-tag-set .dataSource=${tags} size="md" wrap></stic-tag-set>`
              : nothing}
            ${pendiente && detalle
              ? html` <span class="ficha-vacunal-card__detalle"> ${detalle} </span> `
              : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define('ficha-vacunal-tarjeta', TarjetaView);
declare global {
  interface HTMLElementTagNameMap {
    'ficha-vacunal-tarjeta': TarjetaView;
  }
}
