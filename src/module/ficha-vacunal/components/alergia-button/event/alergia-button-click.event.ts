import { BaseCustomEvent } from '@sas/lib-stic-kernel';

export class VacunasAlergiaButtonClickEvent extends BaseCustomEvent<VacunasAlergiaButtonClickEventData> {
  constructor(detail: VacunasAlergiaButtonClickEventData) {
    super('vacunas-alergia-button:click', detail);
  }
}

export class VacunasAlergiaButtonClickEventData {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }
}
