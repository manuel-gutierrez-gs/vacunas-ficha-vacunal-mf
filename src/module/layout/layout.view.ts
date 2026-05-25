import { CSSResultGroup, CSSResultOrNative, html, TemplateResult } from 'lit';
import { LayoutViewModel } from './layout.viewmodel';
import { LayoutTheme } from './css/layout-theme.css';

export class LayoutView extends LayoutViewModel {
  static override readonly finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...LayoutTheme.LayoutTheme,
  ];

  protected override render(): TemplateResult {
    return html`${this.renderNavigation()}${this.renderHeader()}${this.renderContent()}`;
  }

  protected renderHeader(): TemplateResult {
    import('@sas/wc-stic-header');
    return html`<stic-header
      logo="sas"
      avatarIcon="person"
      text="Aplicación de ejemplo"
      dividers="all"
    ></stic-header>`;
  }

  protected renderNavigation(): TemplateResult {
    import('@sas/wc-stic-navigation');
    return html`<stic-navigation
      open
      .dataSource=${this.sticNavigationItems}
      @navigation:clickitem=${this.handelNavigationClickEvent}
    ></stic-navigation>`;
  }

  protected renderContent(): TemplateResult {
    import('../../routing/stic-appname-router.view');
    return html`<stic-appname-router .route=${this.routeName}></stic-appname-router>`;
  }
}

window.customElements.define('layout-container', LayoutView);

declare global {
  interface HTMLElementTagNameMap {
    'layout-container': LayoutView;
  }
}
