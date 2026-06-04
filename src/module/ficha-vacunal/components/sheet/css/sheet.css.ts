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

  stic-result-grid {
    --stic-result-grid-template-columns: repeat(2, 1fr);
    --stic-result-grid-gap: 1px 10%;
    --stic-result-item-background-color: white;
    --color-background-2: white;
  }
    
  .grid-2 {
    --stic-result-grid-template-columns: repeat(1, 1fr);
    --stic-result-grid-gap: 1px 150px;
    --stic-result-item-background-color: white;
    --color-background-2: white;
  }
`;