import { css, CSSResult, CSSResultOrNative } from 'lit';

export class LayoutTheme {
  static readonly cssBase: CSSResult = css`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      height: 100vh;
      width: 100vw;
    }

    stic-navigation {
      grid-column: 1;
      height: 100%;
    }

    stic-appname-router {
      grid-column: 2;
      height: 100%;
      overflow: auto;
      padding: 20px;
    }
  `;

  static readonly LayoutTheme: CSSResultOrNative[] = [LayoutTheme.cssBase];
}
