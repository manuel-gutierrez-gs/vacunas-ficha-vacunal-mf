import { CSSResult, CSSResultOrNative, css } from 'lit';

export class SticAppNameRouterTheme {
  static cssBase: CSSResult = css`
    :host {
      display: block;
      height: 100vh;
    }
  `;

  static SticAppNameRouterTheme: CSSResultOrNative[] = [SticAppNameRouterTheme.cssBase];
}
