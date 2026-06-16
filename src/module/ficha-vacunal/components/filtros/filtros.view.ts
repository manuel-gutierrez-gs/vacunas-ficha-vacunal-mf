import '@sas/wc-stic-filters-area';
import { html } from 'lit';
import { STICTheme } from '@sas/wc-stic-theme';
import { FiltrosViewModel } from './filtros.viewmodel';

export class FiltrosView extends FiltrosViewModel {
  render() {
    new STICTheme().loadHeadStyles();

    return html`
      <div class="ficha-vacunal-filtros">
        <stic-filters-area
          .dataSource=${this.filterSet}
          @filtersArea:selectedValuesChanged=${this.onValuesChanged}
          @filtersArea:setDefault=${this.onSetDefault}
        >
        </stic-filters-area>
      </div>
    `;
  }
}

window.customElements.define('ficha-vacunal-filtros', FiltrosView);
declare global {
  interface HTMLElementTagNameMap {
    'ficha-vacunal-filtros': FiltrosView;
  }
}
