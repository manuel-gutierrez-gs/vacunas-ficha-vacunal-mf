import { CSSResult, css, CSSResultOrNative } from 'lit';

export class FichaVacunalCabeceraThemeCss {
  static cssBase: CSSResult = css`
    :host {
      padding: 1em;
      font-family: 'Noto Sans';
      display: block;
      background-color: #FFF;
    }

    .header-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ficha-vacunal-cabecera__name {
      font-size: 18px;
      font-weight: bold;
      margin-left: 10px;
      font-family: 'Noto Sans';
    }

    .ficha-vacunal-cabecera__info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-left: 10px;
      font-size: 14px;
      color: #333;
      max-width: 100%;
    }

    .ficha-vacunal-cabecera__divider {
      height: 20px;
    }
  `;

  static fichaVacunalCabeceraThemeCss: CSSResultOrNative[] = [FichaVacunalCabeceraThemeCss.cssBase];
}
