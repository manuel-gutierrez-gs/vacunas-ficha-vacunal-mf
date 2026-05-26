import { BaseEmptyDetailEvent } from '@sas/lib-stic-kernel';

export class SticMfErrorClickEvent extends BaseEmptyDetailEvent {
  constructor() {
    super('stic-mf:error:click');
  }
}