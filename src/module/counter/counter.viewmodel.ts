import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class CounterViewModel extends LitElement {
  @property({ type: Number }) count = 0;
}
