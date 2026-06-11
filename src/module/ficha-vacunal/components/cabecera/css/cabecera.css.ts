import { CSSResult, css, CSSResultOrNative } from 'lit';

export class FichaVacunalCabeceraThemeCss {
  static cssBase: CSSResult = css`
    :host {
      background-color: #fff;
      display: block;
      font-family: 'Noto Sans';
      padding: 1em;
    }

    .header-container {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .header-container__left {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .header-container__right {
      display: flex;
      justify-content: flex-end;
    }

    .ficha-vacunal-cabecera__name {
      font-family: 'Noto Sans';
      font-size: 18px;
      font-weight: bold;
      margin-left: 10px;
    }

    .ficha-vacunal-cabecera__info {
      align-items: center;
      color: #333;
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      gap: 8px;
      margin-left: 10px;
      max-width: 100%;
    }

    .ficha-vacunal-cabecera__divider {
      height: 20px;
    }
  `;

  static fichaVacunalCabeceraThemeCss: CSSResultOrNative[] = [FichaVacunalCabeceraThemeCss.cssBase];
}
