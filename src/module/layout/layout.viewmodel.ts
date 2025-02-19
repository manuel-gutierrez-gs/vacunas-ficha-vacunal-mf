import { SticNavigationItems } from '@sas/wc-stic-navigation';
import { LitElement } from 'lit';

export class LayoutViewModel extends LitElement {
  protected sticNavigationItems: SticNavigationItems = [
    {
      value: 'menu',
      icon: 'menu',
      label: '',
    },
    {
      label: 'Avisos',
      icon: 'warning',
      value: 'First',
    },
    {
      label: 'Guardar',
      icon: 'favorite',
      value: 'Second',
    },
  ];
}
