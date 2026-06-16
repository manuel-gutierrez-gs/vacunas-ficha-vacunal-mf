import type { CSSResult, CSSResultOrNative } from 'lit';
import { css } from 'lit';

export class FiltrosThemeCss {
  static cssBase: CSSResult = css`
    .ficha-vacunal-filtros {
      padding: 8px 0;
    }
  `;

  static filtrosThemeCss: CSSResultOrNative[] = [FiltrosThemeCss.cssBase];
}
