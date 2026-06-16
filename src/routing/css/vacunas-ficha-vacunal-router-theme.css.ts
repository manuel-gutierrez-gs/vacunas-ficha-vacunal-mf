import type { CSSResult, CSSResultOrNative } from 'lit';
import { css } from 'lit';

export class VacunasFichaVacunalRouterTheme {
  static cssBase: CSSResult = css`
    :host {
      display: block;
    }
  `;

  static VacunasFichaVacunalRouterTheme: CSSResultOrNative[] = [
    VacunasFichaVacunalRouterTheme.cssBase,
  ];
}
