import { BaseCustomEvent } from '@sas/lib-stic-kernel';

export interface VacunasModalOpenEventData<TProps = unknown> {
  id: string;
  slotKey: string;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  props?: TProps;
}

export class VacunasModalOpenEvent<TProps = unknown> extends BaseCustomEvent<
  VacunasModalOpenEventData<TProps>
> {
  constructor(detail: VacunasModalOpenEventData<TProps>) {
    super('vacunas-modal:open', detail);
  }
}
