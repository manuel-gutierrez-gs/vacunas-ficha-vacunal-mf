import { LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { VacunasModalInstance } from './model/modal-instance.model';
import { VacunasModalOpenEvent } from '../alergia-button/event/alergia-button-modal-open.event';
import { VacunasModalCloseEvent } from '../modal/event/modal-close.event';

export class VacunasModalHostViewModel extends LitElement {
  public static instance: VacunasModalHostViewModel | null = null;

  @state() protected modal: VacunasModalInstance | null = null;

  protected slotRegistry: Record<string, (props?: Record<string, any>) => TemplateResult> = {};

  public registerSlot(
    key: string,
    renderer: (props?: Record<string, any>) => TemplateResult
  ): void {
    this.slotRegistry[key] = renderer;
  }

  private handleOpenEvent = (event: Event): void => {
    const customEvent = event as VacunasModalOpenEvent;

    if (!customEvent.detail || !customEvent.detail.slotKey) {
      return;
    }

    this.modal = {
      id: customEvent.detail.id,
      title: customEvent.detail.title,
      description: customEvent.detail.description,
      size: customEvent.detail.size,
      slotKey: customEvent.detail.slotKey,
      props: customEvent.detail.props,
    };
  };

  private handleCloseEvent = (event: Event): void => {
    const customEvent = event as VacunasModalCloseEvent;
    if (this.modal && this.modal.id === customEvent.detail.id) {
      this.modal = null;
    }
  };

  connectedCallback(): void {
    super.connectedCallback();

    VacunasModalHostViewModel.instance = this;

    document.addEventListener('vacunas-modal:open', this.handleOpenEvent);
    document.addEventListener(VacunasModalCloseEvent.eventName, this.handleCloseEvent);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    if (VacunasModalHostViewModel.instance === this) {
      VacunasModalHostViewModel.instance = null;
    }

    document.removeEventListener('vacunas-modal:open', this.handleOpenEvent);
    document.removeEventListener(VacunasModalCloseEvent.eventName, this.handleCloseEvent);
  }

  protected handleClose(event: VacunasModalCloseEvent): void {
    if (this.modal && this.modal.id === event.detail.id) {
      this.modal = null;
    }
  }
}
