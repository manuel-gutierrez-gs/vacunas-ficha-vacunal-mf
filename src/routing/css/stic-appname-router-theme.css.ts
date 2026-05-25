import { CSSResult, CSSResultOrNative, css } from 'lit';

export class SticAppNameRouterTheme {
  static cssBase: CSSResult = css`
    :host {
      display: block;
    }
  `;

  static SticAppNameRouterTheme: CSSResultOrNative[] = [SticAppNameRouterTheme.cssBase];
}
