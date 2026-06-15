import { CSSResultGroup, CSSResultOrNative, html, TemplateResult } from 'lit';
import '@sas/wc-stic-modal';
import { VacunasModalTheme } from './css/modal-theme.css';
import { VacunasModalViewModel } from './modal.viewmodel';
import { VacunasModalCloseEvent } from './event/modal-close.event';

export class VacunasModalView extends VacunasModalViewModel {
  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...VacunasModalTheme.VacunasModalTheme,
  ];

  render(): TemplateResult {
    switch (this.type) {
      case 'form':
        return html`
          <stic-modal-form
            .showModal=${this.open}
            .size=${this.size}
            title=${this.title}
            .description=${this.description}
            @modalForm:closed=${this.handleClose}
            @modalForm:closedByKeyboard=${this.handleClose}
            @modalForm:closedByClickingOutside=${this.handleClose}
          >
            <slot></slot>
          </stic-modal-form>
        `;
      case 'warning':
        return html`
          <stic-modal-warning
            .showModal=${this.open}
            .size=${this.size}
            title=${this.title}
            .description=${this.description}
            @modalWarning:closed=${this.handleClose}
            @modalWarning:closedByKeyboard=${this.handleClose}
            @modalWarning:closedByClickingOutside=${this.handleClose}
          >
            <slot></slot>
          </stic-modal-warning>
        `;
      case 'confirmation':
        return html`
          <stic-modal-confirmation
            .showModal=${this.open}
            .size=${this.size}
            title="${this.title}"
            .description=${this.description}
            @modalConfirmation:closed=${this.handleClose}
            @modalConfirmation:closedByKeyboard=${this.handleClose}
            @modalConfirmation:closedByClickingOutside=${this.handleClose}
          >
            <slot></slot>
          </stic-modal-confirmation>
        `;
      case 'passive':
      default:
        return html`
          <stic-modal-passive
            .showModal=${this.open}
            .size=${this.size}
            title=${this.title}
            .description=${this.description}
            @modalPassive:closed=${this.handleClose}
            @modalPassive:closedByKeyboard=${this.handleClose}
            @modalPassive:closedByClickingOutside=${this.handleClose}
          >
            <slot></slot>
          </stic-modal-passive>
        `;
    }
  }

  private handleClose(): void {
    this.dispatchEvent(new VacunasModalCloseEvent({ id: this.id }));
  }
}

window.customElements.define('vacunas-modal', VacunasModalView);

declare global {
  interface HTMLElementTagNameMap {
    'vacunas-modal': VacunasModalView;
  }
}
