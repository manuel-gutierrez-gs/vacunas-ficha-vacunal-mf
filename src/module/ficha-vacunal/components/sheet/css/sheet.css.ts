import { css } from 'lit';

export const fichaVacunalSheetStyles = css`
  .ficha-vacunal-sheet__container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    width: 90%;
  }

  .ficha-vacunal-sheet__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ficha-vacunal-sheet__grid {
    --stic-result-grid-template-columns: repeat(2, 1fr);
    --stic-result-grid-gap: 1px 10%;
    --stic-result-item-background-color: white;
    --color-background-2: white;
  }

  .ficha-vacunal-sheet__divider {
    margin: 8px 0;
  }

  .ficha-vacunal-sheet__title {
    margin: 8px 0;
    font-weight: 600;
  }

  .ficha-vacunal-sheet__counter {
    margin-bottom: 8px;
  }

  .ficha-vacunal-sheet__list {
    margin-bottom: 8px;
  }

  .ficha-vacunal-sheet__result-list {
    --stic-result-item-background-color: white;
    --stic-result-item-background-color-odd: white;
  }

  .ficha-vacunal-sheet__result-list::part(item) {
    border-bottom: 1px solid #cccccc;
    margin: 10px 0;
  }

  .ficha-vacunal-sheet__search {
    margin: 12px 0;
  }

  stic-input-v2-text {
    background-color: var(--color-background-3);
    border: none;
  }

  .ficha-vacunal-sheet__empty {
    margin-top: 8px;
    color: var(--color-text-2);
  }
`;
