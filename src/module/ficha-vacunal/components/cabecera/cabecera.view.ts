import { CSSResultGroup, CSSResultOrNative, html } from 'lit';
import { FichaVacunalCabeceraViewModel } from './cabecera.viewmodel';
import { FichaVacunalCabeceraThemeCss } from './css/cabecera.css';
import '@sas/wc-stic-divider';
import '@sas/wc-stic-icon';
import '@sas/wc-stic-text';

export class VacFichaVacunalCabeceraView extends FichaVacunalCabeceraViewModel {

  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...FichaVacunalCabeceraThemeCss.fichaVacunalCabeceraThemeCss,
  ];

  render() {
    return html`
      <div class="header-container">
        <div class="ficha-vacunal-cabecera__name">
          <strong>${this.nombreCompleto}</strong>
          <stic-divider vertical></stic-divider>
        </div>
        <div class="ficha-vacunal-cabecera__info">
          <stic-text text="${this.sexoYEdad}"></stic-text>
          <div class="divider">
            <stic-divider vertical></stic-divider>
          </div>
          <div class="ficha-vacunal-cabecera__divider">
            <stic-divider vertical></stic-divider>
          </div>
          <stic-text text="${this.nuhsaDisplay}"></stic-text>
          <div class="ficha-vacunal-cabecera__divider">
            <stic-divider vertical></stic-divider>
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define('ficha-vacunal-cabecera', VacFichaVacunalCabeceraView);
declare global {
  interface HTMLElementTagNameMap {
    'ficha-vacunal-cabecera': VacFichaVacunalCabeceraView;
  }
}
