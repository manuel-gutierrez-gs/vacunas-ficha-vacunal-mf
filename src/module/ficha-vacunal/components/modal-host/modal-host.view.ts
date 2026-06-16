import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { VacunasModalHostViewModel } from './modal-host.viewmodel';
import '../modal/modal.view';

export class VacunasModalHostView extends VacunasModalHostViewModel {
  render(): TemplateResult | typeof nothing {
    if (!this.modal || !this.modal.slotKey) {
      return nothing;
    }

    const renderer = this.slotRegistry[this.modal.slotKey];
    if (!renderer) {
      return nothing;
    }

    return html`
      <vacunas-modal
        .id=${this.modal.id}
        .open=${true}
        .title=${this.modal.title || ''}
        .description=${this.modal.description || ''}
        .size=${this.modal.size || 'md'}
        .slotKey=${this.modal.slotKey}
        @vacunas-modal:close=${this.handleCloseEvent}
      >
        ${renderer(this.modal.props)}
      </vacunas-modal>
    `;
  }
}

window.customElements.define('vacunas-modal-host', VacunasModalHostView);

declare global {
  interface HTMLElementTagNameMap {
    'vacunas-modal-host': VacunasModalHostView;
  }
}
