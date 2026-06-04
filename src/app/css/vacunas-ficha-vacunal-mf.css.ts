import { css } from 'lit';

export const vacunasFichaVacunalMfStyles = [
  css`
    :host {
      background-color: rgb(238, 238, 238);
      display: block;
      font-family: 'Noto Sans', sans-serif;
      min-height: 200px;
    }

    .mf-root {
      min-height: 200px;
      flex-direction: column;
      display: flex;
    }

    .mf-root__body {
      background-color: #FFF;
      border-radius: 25px;
      flex: 1;
      margin: 1.5em;
      overflow: hidden;
      padding: 1.5em;
    }

    .mf-root__body-header {
      display: flex;
      flex-direction: row;
      padding: 10px 0;
    }

    .mf-root__header-content {
      overflow: hidden;
      flex: 1;
      flex-direction: column;
      display: flex;
    }

    .mf-root__header-title {
      font-family: 'Noto Sans';
      font-size: 18px;
      font-weight: bold;
      margin-left: 10px;
    }

    .mf-root__header-actions {
      margin-left: auto;
      display: inline-flex;
    }

    .mf-root__header-settings {
      margin-left: 10px;
      margin-right: 20px;
      margin-top: 6px;
    }

    .mf-root__header-download {
      margin-left: 10px;
      margin-right: 20px;
      margin-top: 6px;
    }

    .mf-root__header-isolated-vaccine-button {
      margin-left: 15px;
    }

    .mf-state {
      align-items: center;
      display: flex;
      justify-content: center;
      min-height: 200px;
      padding: 24px;
      text-align: center;
    }

    .mf-state--error {
      color: #b00020;
    }
  `,
];
