
import { CSSResultGroup, CSSResultOrNative, html } from 'lit';

import { TarjeteroViewModel } from './tarjetero.viewmodel';
import { tarjeteroThemeCss } from './css/tarjetero.css';

import '../tarjeta/tarjeta.view';
import '@sas/wc-stic-divider';

export class TarjeteroView extends TarjeteroViewModel {
  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...tarjeteroThemeCss.tarjeteroThemeCss,
  ];

  render() {
    const franjas = this.franjasFiltradas;

    return html`
      <div class="ficha-vacunal-tarjetero">
        <div class="ficha-vacunal-tarjetero__list">
          ${franjas.map(
            (franja, index) => html`
              <div class="ficha-vacunal-tarjetero__franja">
                <div class="ficha-vacunal-tarjetero__franja-label">
                  <strong>${this.formatFranjaLabel(franja)}</strong>
                </div>

                <div class="ficha-vacunal-tarjetero__cards">
                  ${franja.inmunizaciones.map(vacunaData => {
                    return html`
                      <ficha-vacunal-tarjeta
                        .data=${vacunaData}
                      ></ficha-vacunal-tarjeta>
                    `;
                  })}
                </div>

                ${index !== franjas.length - 1
                    ? html`<stic-divider></stic-divider>`
                    : null}

              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

window.customElements.define('ficha-vacunal-tarjetero', TarjeteroView);
declare global {
  interface HTMLElementTagNameMap {
    'ficha-vacunal-tarjetero': TarjeteroView;
  }
}
