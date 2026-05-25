import { css, CSSResult, CSSResultOrNative } from 'lit';

export class CounterTheme {
  static readonly cssBase: CSSResult = css`
    :host {
      padding: 2rem;
    }
  `;

  static readonly CounterTheme: CSSResultOrNative[] = [CounterTheme.cssBase];
}
