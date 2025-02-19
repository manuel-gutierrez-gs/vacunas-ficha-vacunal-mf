import { CSSResultGroup, CSSResultOrNative, html } from 'lit';
import { SticExampleTheme } from './css/stic-example-theme.css';
import { SticExampleViewModel } from './stic-example.viewmodel';

export class SticExampleView extends SticExampleViewModel {
  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...SticExampleTheme.SticExampleTheme,
  ];

  render() {
    return html`
      <div class="container">
        <h1>Example</h1>
        <p>This is an example of a module.</p>
        <p>${this.text}</p>
      </div>
    `;
  }
}

window.customElements.define('stic-example', SticExampleView);

declare global {
  interface HTMLElementTagNameMap {
    'stic-example': SticExampleView;
  }
}
