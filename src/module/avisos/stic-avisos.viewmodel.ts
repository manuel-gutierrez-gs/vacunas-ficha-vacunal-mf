import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

export class SticAvisosViewModel extends LitElement {
  @state() text = 'Este es el texto del modilo de avisos interno!';
}
