import { BaseCustomEvent } from '@sas/lib-stic-kernel';

export interface VacunasModalOpenEventData {
  id: string;
  slotKey: string;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  props?: Record<string, any>;
}

export class VacunasModalOpenEvent extends BaseCustomEvent<VacunasModalOpenEventData> {
  constructor(detail: VacunasModalOpenEventData) {
    super('vacunas-modal:open', detail);
  }
}
