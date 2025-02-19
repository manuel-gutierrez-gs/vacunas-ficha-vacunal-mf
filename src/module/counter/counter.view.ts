import { html, TemplateResult } from 'lit';
import { CounterViewModel } from './counter.viewmodel';

export class CounterView extends CounterViewModel {
  protected override render(): TemplateResult {
    import('@sas/wc-stic-button');
    return html`<stic-button
      variant="primary"
      label=${`Contador es ${this.count}`}
      @button:click=${() => this.count++}
    ></stic-button>`;
  }
}

window.customElements.define('counter-component', CounterView);

declare global {
  interface HTMLElementTagNameMap {
    'counter-component': CounterView;
  }
}
