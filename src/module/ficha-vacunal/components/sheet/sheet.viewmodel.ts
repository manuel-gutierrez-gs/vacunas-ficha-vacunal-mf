import type { AccionVacunalUI } from '@module/ficha-vacunal/model/accion-vacunal-ui.model';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { mapAccionVacunalToSheetModel } from '../../adapter/mapper/sheet.mapper';

export class FichaVacunalSheetViewModel extends LitElement {
  @property({ attribute: false }) open = false;
  @property({ type: Object }) accion: AccionVacunalUI | null = null;

  get model() {
    return mapAccionVacunalToSheetModel(this.accion);
  }

  get itemsDatosSuperiores() {
    return this.model.datosSuperiores;
  }

  get itemsReacciones() {
    return this.model.reacciones;
  }

}