import { css, CSSResult, CSSResultOrNative } from 'lit';

export class SticExampleMfTheme {
  static readonly cssBase: CSSResult = css`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      height: 100vh;
      width: 100vw;
    }

    stic-navigation {
      grid-column: 1;
    }

    stic-appname-router {
      grid-column: 2;
      overflow: auto;
      padding: 20px;
    }
  `;

  static readonly SticExampleMfTheme: CSSResultOrNative[] = [SticExampleMfTheme.cssBase];
}
