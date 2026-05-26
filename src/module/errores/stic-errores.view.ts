import { html, TemplateResult } from 'lit';
import { SticErroresViewModel } from './stic-errores.viewmodel';

export class SticErroresView extends SticErroresViewModel {
  protected override render(): TemplateResult {
    import('@sas/wc-stic-button');
    return html`
    <h1>Errores</h1>
    <p>Introducción al módulo de errores.</p>
    <stic-button
      variant="primary"
      label=${`Enviar error`}
      @button:click=${() => console.error('Enviando error')}
    ></stic-button>`;
  }
}

window.customElements.define('stic-errores', SticErroresView);

declare global {
  interface HTMLElementTagNameMap {
    'stic-errores': SticErroresView;
  }
}
