import type { TemplateResult } from 'lit';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import type { ModalSlotProps, SlotMap, VacunasModalInstance } from './model/modal-instance.model';

import type { VacunasModalOpenEvent } from '../alergia-button/event/alergia-button-modal-open.event';
import { VacunasModalCloseEvent } from '../modal/event/modal-close.event';

import { PacienteContextRequestEvent } from '@shared/context/paciente-context';
import type { PacienteContext } from '@shared/context/paciente-context';

export class VacunasModalHostViewModel extends LitElement {
  public static instance: VacunasModalHostViewModel | null = null;

  @state() protected modal: VacunasModalInstance | null = null;

  private _nuhsa?: string;
  private _unsubscribeContext?: () => void;

  protected isResetting = false;

  protected slotRegistry: Record<string, (props?: unknown) => TemplateResult> = {};

  public registerSlot<K extends keyof SlotMap>(
    key: K,
    renderer: (props?: SlotMap[K]) => TemplateResult
  ): void {
    this.slotRegistry[key as string] = renderer as (props?: unknown) => TemplateResult;
  }

  connectedCallback(): void {
    super.connectedCallback();

    VacunasModalHostViewModel.instance = this;

    document.addEventListener('vacunas-modal:open', this.handleOpenEvent);
    document.addEventListener(VacunasModalCloseEvent.eventName, this.handleCloseEvent);

    const event = new PacienteContextRequestEvent(this.handleContextChange, true);

    this.dispatchEvent(event);
    this._unsubscribeContext = event.unsubscribe;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    if (VacunasModalHostViewModel.instance === this) {
      VacunasModalHostViewModel.instance = null;
    }

    document.removeEventListener('vacunas-modal:open', this.handleOpenEvent);
    document.removeEventListener(VacunasModalCloseEvent.eventName, this.handleCloseEvent);

    this._unsubscribeContext?.();
    this._unsubscribeContext = undefined;
  }

  private handleOpenEvent = (event: Event): void => {
    if (this.isResetting) return;

    const customEvent = event as VacunasModalOpenEvent;

    if (!customEvent.detail?.slotKey) return;

    this.modal = {
      id: customEvent.detail.id,
      title: customEvent.detail.title,
      description: customEvent.detail.description,
      size: customEvent.detail.size,
      slotKey: customEvent.detail.slotKey,
      props: customEvent.detail.props as ModalSlotProps,
    };
  };

  protected handleCloseEvent = (event: Event): void => {
    if (this.isResetting) return;

    const customEvent = event as VacunasModalCloseEvent;

    if (this.modal && this.modal.id === customEvent.detail.id) {
      this.modal = null;
    }
  };

  private handleContextChange = (context: PacienteContext): void => {
    if (this._nuhsa === context.nuhsa) return;

    this._nuhsa = context.nuhsa;

    this.safeCloseModalOnContextChange();
  };

  private safeCloseModalOnContextChange(): void {
    if (this.isResetting || !this.modal) return;

    this.isResetting = true;

    this.modal = null;

    requestAnimationFrame(() => {
      this.isResetting = false;
    });
  }
}
