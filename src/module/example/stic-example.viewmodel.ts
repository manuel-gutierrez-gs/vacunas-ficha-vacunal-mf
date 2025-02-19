import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

export class SticExampleViewModel extends LitElement {
  @state() text = 'Hello world!';
}
