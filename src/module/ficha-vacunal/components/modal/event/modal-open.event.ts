import { VacunasModalInstance } from '../../modal-host/model/modal-instance.model';

export class VacunasModalOpenEvent extends CustomEvent<VacunasModalInstance> {
  static readonly eventName = 'vacunas-modal:open';

  constructor(detail: VacunasModalInstance) {
    super(VacunasModalOpenEvent.eventName, {
      bubbles: true,
      composed: true,
      detail,
    });
  }
}
