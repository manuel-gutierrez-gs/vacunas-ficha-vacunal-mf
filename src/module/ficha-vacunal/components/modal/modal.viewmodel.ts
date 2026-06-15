import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { VacunasModalSize, VacunasModalType } from './model/modal.model';
import { VACUNAS_MODAL_TYPE_REGISTRY } from './registry/modal-type.registry';

export class VacunasModalViewModel extends LitElement {
  @property({ type: String }) public id = '';
  @property({ type: Boolean }) public open = false;
  @property({ type: String }) public title = '';
  @property({ type: String }) public description = '';
  @property({ type: String }) public size: VacunasModalSize = 'md';
  @property({ type: String }) public slotKey = '';

  public get type(): VacunasModalType {
    if (this.slotKey && VACUNAS_MODAL_TYPE_REGISTRY[this.slotKey]) {
      return VACUNAS_MODAL_TYPE_REGISTRY[this.slotKey].type;
    }
    return 'passive';
  }
}
