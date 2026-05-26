import { CSSResultGroup, CSSResultOrNative, html, TemplateResult } from 'lit';
import { SticErroresViewModel } from './stic-errores.viewmodel';
import { SticErroresTheme } from './css/stic-errores-theme.css';
import('@sas/wc-stic-button');

export class SticErroresView extends SticErroresViewModel {

  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...SticErroresTheme.SticErroresTheme,
  ];
  
  render(): TemplateResult {
    return html`
      <h1>Errores</h1>
      <p>Introducción al módulo de errores.</p>
      <p>${this.text}</p>
      <stic-button
        variant="primary"
        label="Enviar error"
        @button:click=${this.handleErrorButtonClick}
      ></stic-button>
    `;
  }
}

window.customElements.define('stic-errores', SticErroresView);

declare global {
  interface HTMLElementTagNameMap {
    'stic-errores': SticErroresView;
  }
}
