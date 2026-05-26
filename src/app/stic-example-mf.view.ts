import { CSSResultGroup, CSSResultOrNative, html, TemplateResult } from 'lit';
import { SticExampleMfTheme } from './css/stic-example-theme.css';
import { SticExampleMfViewModel } from './stic-example-mf.viewmodel';

export class SticExampleMfView extends SticExampleMfViewModel {
  static override readonly finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...SticExampleMfTheme.SticExampleMfTheme,
  ];

  protected override render(): TemplateResult {
    return html`${this.renderNavigation()}${this.renderContent()}`;
  }

  protected renderNavigation(): TemplateResult {
    import('@sas/wc-stic-navigation');
    return html`<stic-navigation
      .dataSource=${this.sticNavigationItems}
      @navigation:clickitem=${this.handelNavigationClickEvent}
    ></stic-navigation>`;
  }

  protected renderContent(): TemplateResult {
    import('@routing/stic-appname-router.view');
    return html`<stic-appname-router
      .route=${this.routeName}
      .ruta=${this.ruta}
      .text=${this.texto}
    ></stic-appname-router>`;
  }
}

window.customElements.define('stic-example-mf', SticExampleMfView);

declare global {
  interface HTMLElementTagNameMap {
    'stic-example-mf': SticExampleMfView;
  }
}
