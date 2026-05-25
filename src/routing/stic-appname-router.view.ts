import { CSSResultGroup, CSSResultOrNative, html } from 'lit';
import { SticAppNameRouterTheme } from './css/stic-appname-router-theme.css';
import { SticAppNameRouterViewModel } from './stic-appname-router.viewmodel';

export class SticAppNameRouterView extends SticAppNameRouterViewModel {
  protected static finalizeStyles(styles?: CSSResultGroup | undefined): CSSResultOrNative[] {
    return [...super.finalizeStyles(styles), ...SticAppNameRouterTheme.SticAppNameRouterTheme];
  }
  public render() {
    return html`
      <slot></slot>
    `;
  }
}

window.customElements.define('stic-appname-router', SticAppNameRouterView);

declare global {
  interface HTMLElementTagNameMap {
    'stic-appname-router': SticAppNameRouterView;
  }
}
