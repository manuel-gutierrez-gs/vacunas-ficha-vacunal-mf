export class VacunasModalCloseEvent extends CustomEvent<{ id: string }> {
  static readonly eventName = 'vacunas-modal:close';

  constructor(detail: { id: string }) {
    super(VacunasModalCloseEvent.eventName, {
      bubbles: true,
      composed: true,
      detail,
    });
  }
}
