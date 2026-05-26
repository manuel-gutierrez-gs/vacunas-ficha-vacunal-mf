import { CSSResultGroup, CSSResultOrNative, html } from 'lit';
import { SticAvisosTheme } from './css/stic-avisos-theme.css';
import { SticAvisosViewModel } from './stic-avisos.viewmodel';

export class SticAvisosView extends SticAvisosViewModel {
  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...SticAvisosTheme.SticAvisosTheme,
  ];

  render() {
    return html`
      <h1>Avisos</h1>
      <p>Introducción al módulo de avisos.</p>
      <p>${this.text}</p>
    `;
  }
}

window.customElements.define('stic-avisos', SticAvisosView);

declare global {
  interface HTMLElementTagNameMap {
    'stic-avisos': SticAvisosView;
  }
}
