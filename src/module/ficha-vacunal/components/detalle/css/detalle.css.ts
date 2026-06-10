import { css, CSSResult } from 'lit';

export class FichaVacunalDetalleTheme {
  static base: CSSResult = css`
    :host {
      display: block;
      max-height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
      font-family: 'Noto Sans', sans-serif;
      margin: 1rem;
      padding: 1rem 0.5rem;
      box-sizing: border-box;

      --sp-2: 2rem;
      --sp-1: 1rem;
      --sp-075: 0.75rem;
      --sp-05: 0.5rem;
      --sp-025: 0.25rem;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .detalle-ficha-vacunal {
      display: block;
    }

    .detalle-ficha-vacunal__container {
      max-width: 46.5rem;
      margin-inline: auto;
      width: 100%;
    }

    .detalle-ficha-vacunal__breadcrumb {
      margin-bottom: var(--sp-2);
      display: block;
    }

    .detalle-ficha-vacunal__header {
      display: flex;
      align-items: center;
      gap: var(--sp-075);
      margin-bottom: var(--sp-1);
    }

    .detalle-ficha-vacunal__title {
      margin: 0;
      font-size: 1.375rem;
      font-weight: 600;
      flex: 0 1 auto;
    }

    .detalle-ficha-vacunal__status {
      white-space: nowrap;
    }

    .detalle-ficha-vacunal__form {
      display: block;
    }

    .detalle-ficha-vacunal__section {
      margin-top: var(--sp-075);
    }

    .detalle-ficha-vacunal__section-title {
      margin: 0 0 var(--sp-05) 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .detalle-ficha-vacunal__muted {
      color: #666;
      font-size: 0.875rem;
      display: block;
    }

    stic-input-v2-date {
      display: block;
      margin: 0 0 var(--sp-025) 0;
    }

    stic-input-v2-date::part(label) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    stic-radio-group {
      display: block;
    }

    stic-input-v2-radio {
      display: block;
      margin: var(--sp-05) 0;
    }

    stic-select-v2,
    .detalle-ficha-vacunal__textarea stic-input-v2-textarea {
      display: block;
      width: 100%;
      max-width: 28rem;
      margin: var(--sp-05) 0;
    }

    .detalle-ficha-vacunal__textarea {
      margin-top: var(--sp-075);
    }

    .detalle-ficha-vacunal__lote-row {
      display: flex;
      gap: var(--sp-05);
      width: 100%;
      max-width: 28rem;
      flex-wrap: wrap;
      margin: var(--sp-05) 0;
    }

    .detalle-ficha-vacunal__lote-row stic-select-v2 {
      flex: 1 1 13.5rem;
      min-width: 12rem;
      max-width: 100%;
      margin: 0;
    }

    @media (max-width: 540px) {
      .detalle-ficha-vacunal__lote-row stic-select-v2 {
        flex-basis: 100%;
      }
    }

    stic-divider {
      display: block;
      margin: var(--sp-1) 0;
    }

    stic-divider + .detalle-ficha-vacunal__section {
      margin-top: 0;
    }

    stic-notification-v2-banner {
      margin-bottom: 10px;
    }

    .detalle-ficha-vacunal__button-group {
      display: flex;
      gap: var(--sp-075);
      margin: var(--sp-1) 0;
    }
  `;
}
