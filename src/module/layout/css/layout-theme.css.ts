import { css, CSSResult, CSSResultOrNative } from 'lit';

export class LayoutTheme {
  static readonly cssBase: CSSResult = css`
    :host {
      display: grid;
      grid-template-areas:
        'header header'
        'nav content';
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr;
      height: 100vh;
      width: 100vw;
    }

    stic-navigation {
      grid-area: nav;
    }

    stic-header {
      grid-area: header;
    }

    stic-appname-router {
      grid-area: content;
      padding: 20px;
      overflow-y: auto;
      width: 90%;
    }
  `;

  static readonly LayoutTheme: CSSResultOrNative[] = [LayoutTheme.cssBase];
}
