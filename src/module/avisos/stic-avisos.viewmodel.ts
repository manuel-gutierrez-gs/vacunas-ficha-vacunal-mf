import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SticMfWarningClickEvent } from './events/warning-click.event';

export class SticAvisosViewModel extends LitElement {
  @property({ type: String }) text = '';

  protected handleWarningButtonClick(): void {
    this.dispatchEvent(new SticMfWarningClickEvent());
  }
}
