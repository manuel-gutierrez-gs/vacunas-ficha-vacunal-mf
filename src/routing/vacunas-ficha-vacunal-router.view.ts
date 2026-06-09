import { CSSResultGroup, CSSResultOrNative, html } from 'lit';
import { VacunasFichaVacunalRouterTheme } from './css/vacunas-ficha-vacunal-router-theme.css';
import { VacunasFichaVacunalRouterViewModel } from './vacunas-ficha-vacunal-router.viewmodel';

export class VacunasFichaVacunalRouterView extends VacunasFichaVacunalRouterViewModel {
  protected static finalizeStyles(styles?: CSSResultGroup | undefined): CSSResultOrNative[] {
    return [
      ...super.finalizeStyles(styles),
      ...VacunasFichaVacunalRouterTheme.VacunasFichaVacunalRouterTheme,
    ];
  }
  public render() {
    return html` <slot></slot> `;
  }
}

window.customElements.define('vacunas-ficha-vacunal-mf', VacunasFichaVacunalRouterView);

declare global {
  interface HTMLElementTagNameMap {
    'vacunas-ficha-vacunal-mf': VacunasFichaVacunalRouterView;
  }
}
