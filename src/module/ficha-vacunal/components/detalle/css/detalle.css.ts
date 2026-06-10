import { css, CSSResult } from 'lit';

export class FichaVacunalDetalleTheme {
  static base: CSSResult = css`
    :host {
      display: block;
      max-height: 100vh;
      overflow-y: auto;
      font-family: 'Noto Sans', sans-serif;
      padding: 1rem;
      box-sizing: border-box;
    }

    .container {
      max-width: 46.5rem;
      margin: 0 auto;
      width: 100%;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.3rem;
      margin: 0;
    }

    .section {
      margin-top: 1rem;
    }

    .muted {
      color: #666;
      font-size: 0.875rem;
    }
  `;
}
