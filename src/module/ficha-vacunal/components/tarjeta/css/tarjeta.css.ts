import { css } from 'lit';

export const tarjetaStyles = css`
  .ficha-vacunal-card {
    background-color: var(--stic-card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--color-border-1, #ccc);
    box-sizing: border-box;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    padding: 12px 16px;
    position: relative;
    width: 350px;
  }

  .ficha-vacunal-card__click-area {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ficha-vacunal-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .ficha-vacunal-card__title {
    font-family: 'Noto Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
  }

  .ficha-vacunal-card__icons {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .ficha-vacunal-card__footer {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .ficha-vacunal-card__detalle {
    font-size: 12px;
    color: #555;
  }

  .ficha-vacunal-card--administrada {
    background-color: #f5faf9;
  }

  .ficha-vacunal-card--administrada-aislada {
    border-color: #028465;
  }

  .ficha-vacunal-card--no-administrada,
  .ficha-vacunal-card--no-administrada-aislada {
    background-color: #fde8e8;
  }

  .ficha-vacunal-card--pendiente {
    background-color: #fff8e6;
  }

  .ficha-vacunal-card--excluida,
  .ficha-vacunal-card--excluida-aislada {
    background-color: #fde8e8;
  }

  .ficha-vacunal-card--programada {
    background-color: #fff8e6;
  }
`;