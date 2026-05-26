import { SticNavigationClickedItemEvent, SticNavigationItems } from '@sas/wc-stic-navigation';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SticAppNameTheme } from '@shared/theme/stic-appname-theme';

export class LayoutViewModel extends LitElement {
  @property({ type: String }) routeName = '';
  protected sticNavigationItems: SticNavigationItems = [
    {
      label: 'Avisos',
      icon: 'warning',
      value: 'Avisos',
    },
    {
      label: 'Errores',
      icon: 'error',
      value: 'Errores',
    },
  ];

  override connectedCallback() {
    super.connectedCallback();
    this._loadSticTheme();
  }

  protected handelNavigationClickEvent(e: SticNavigationClickedItemEvent) {
    this.routeName = e.detail.value!;
  }

  private _loadSticTheme() {
    new SticAppNameTheme().loadHeadStyles();
  }
}
