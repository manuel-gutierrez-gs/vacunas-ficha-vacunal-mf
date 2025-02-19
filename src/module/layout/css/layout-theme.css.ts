import { css, CSSResult, CSSResultOrNative } from 'lit';

export class LayoutTheme {
  static readonly cssBase: CSSResult = css`
    /* :host {
      display: grid;
      grid-template-areas:
        "header header"
        "sidebar content";
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr;
      height: 100vh;
      width: 100vw;
    }

    sidebar-menu {
      grid-area: sidebar;
      max-width: 300px;
      width: 100%;
      height: 100vh;
    }

    header-container {
      grid-area: header;
      width: 100%;
      display: flex;
      align-items: center;
    }

    content-container {
      grid-area: content;
      padding: 20px;
      overflow-y: auto;
      width: 90%;
    } */
  `;

  static readonly LayoutTheme: CSSResultOrNative[] = [LayoutTheme.cssBase];
}
