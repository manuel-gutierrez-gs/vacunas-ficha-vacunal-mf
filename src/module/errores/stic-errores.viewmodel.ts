import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SticMfErrorClickEvent } from './events/error-click.event';

export class SticErroresViewModel extends LitElement {
  @property({ type: String }) text = '';

  protected handleErrorButtonClick(): void {
    this.dispatchEvent(new SticMfErrorClickEvent());
  }
}
