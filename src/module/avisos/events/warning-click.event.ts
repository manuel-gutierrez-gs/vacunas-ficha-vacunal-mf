import { BaseEmptyDetailEvent } from '@sas/lib-stic-kernel';

export class SticMfWarningClickEvent extends BaseEmptyDetailEvent {
  constructor() {
    super('stic-mf:warning:click');
  }
}

