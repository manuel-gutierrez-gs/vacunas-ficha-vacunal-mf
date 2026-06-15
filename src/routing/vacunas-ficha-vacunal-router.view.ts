import { CSSResultGroup, CSSResultOrNative, html } from 'lit';
import { VacunasFichaVacunalRouterTheme } from './css/vacunas-ficha-vacunal-router-theme.css';
import { VacunasFichaVacunalRouterViewModel } from './vacunas-ficha-vacunal-router.viewmodel';

import '@module/ficha-vacunal/components/modal-host/modal-host.view';

export class VacunasFichaVacunalRouterView extends VacunasFichaVacunalRouterViewModel {
  protected static finalizeStyles(styles?: CSSResultGroup | undefined): CSSResultOrNative[] {
    return [
      ...super.finalizeStyles(styles),
      ...VacunasFichaVacunalRouterTheme.VacunasFichaVacunalRouterTheme,
    ];
  }
  public render() {
    return html`
      <slot></slot>
      <vacunas-modal-host></vacunas-modal-host>
    `;
  }
}

window.customElements.define('vacunas-ficha-vacunal-mf', VacunasFichaVacunalRouterView);

declare global {
  interface HTMLElementTagNameMap {
    'vacunas-ficha-vacunal-mf': VacunasFichaVacunalRouterView;
  }
}
