import { SticNavigationClickedItemEvent, SticNavigationItems } from '@sas/wc-stic-navigation';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SticAppNameTheme } from '../../shared/theme/stic-appname-theme';

export class LayoutViewModel extends LitElement {
  @property({ type: String }) routeName = '';
  protected sticNavigationItems: SticNavigationItems = [
    {
      icon: 'menu',
      label: '',
      value: 'menu'
    },
    {
      label: 'Avisos',
      icon: 'warning',
      value: 'Example',
    },
    {
      label: 'Contador',
      icon: 'calculate',
      value: 'Counter',
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
