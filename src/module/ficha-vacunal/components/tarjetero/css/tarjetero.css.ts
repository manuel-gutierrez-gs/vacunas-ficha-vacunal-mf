import type { CSSResult, CSSResultOrNative } from 'lit';
import { css } from 'lit';

export class tarjeteroThemeCss {
  static cssBase: CSSResult = css`
    .ficha-vacunal-tarjetero__title-row {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .ficha-vacunal-tarjetero__filters {
      margin-bottom: 16px;
    }

    .ficha-vacunal-tarjetero__franja-label {
      font-family: 'Noto Sans', sans-serif;
      margin-bottom: 8px;
    }

    .ficha-vacunal-tarjetero__cards {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px;
      width: 100%;
    }

    .ficha-vacunal-tarjetero__franja {
      display: flex;
      flex-direction: column;
      padding: 16px;
      overflow-x: hidden;
      row-gap: 10px;
    }
  `;

  static tarjeteroThemeCss: CSSResultOrNative[] = [tarjeteroThemeCss.cssBase];
}
