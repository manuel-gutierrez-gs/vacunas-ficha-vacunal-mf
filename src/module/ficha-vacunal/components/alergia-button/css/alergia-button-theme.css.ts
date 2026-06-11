import { css, CSSResult, CSSResultOrNative } from 'lit';

export class VacunasAlergiaButtonTheme {
  static cssBase: CSSResult = css`
    :host {
      cursor: pointer;
      display: inline-block;
    }

    .wrapper {
      display: inline-flex;
      position: relative;
    }

    .badge-anchor {
      align-items: center;
      bottom: -10px;
      display: flex;
      height: 20px;
      justify-content: center;
      left: -10px;
      position: absolute;
      width: 20px;
    }

    .icon-badge {
      --stic-icon-font-size: 20px;
      align-items: center;
      border-radius: var(--shape-full);
      cursor: pointer;
      display: flex;
      height: 20px;
      justify-content: center;
      width: 20px;
    }

    .container {
      align-items: center;
      background: transparent;
      border-radius: var(--shape-sm);
      border: none;
      cursor: pointer;
      display: flex;
      font-family: var(--font-family-primary);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      justify-content: center;
      letter-spacing: var(--font-letter-spacing-none);
      line-height: var(--font-line-height-md);
      outline: none;
      position: relative;
      text-decoration: none;
    }

    .container:focus-visible {
      outline-offset: var(--spacing-xxxxs);
      outline: var(--border-width-xs) var(--border-style-solid) var(--color-border-focused);
    }

    .container.sm {
      height: var(--sizing-height-4xl);
    }
    .container.md {
      height: var(--sizing-height-6xl);
    }
    .container.lg {
      font-size: var(--font-size-lg);
      height: var(--sizing-height-8xl);
      line-height: var(--font-line-height-lg);
    }

    .state-layer {
      --stic-ripple-focus-opacity: var(--state-layer-focused);
      --stic-ripple-hover-opacity: var(--state-layer-hovered);
      --stic-ripple-press-opacity: var(--state-layer-pressed);
      --stic-ripple-shape: var(--shape-sm);
      --stic-ripple-z-index: var(--z-index-xxs);
      height: 100%;
      position: absolute;
      width: 100%;
    }

    .content {
      align-items: center;
      display: flex;
      gap: var(--spacing-inline-sm);
      justify-content: center;
      position: relative;
    }

    .content.text {
      padding: var(--spacing-inset-squish-sm);
    }
    .container.md .content.text {
      padding: var(--spacing-inset-squish-md);
    }
    .container.lg .content.text {
      padding: var(--spacing-inset-squish-xl);
    }

    .label {
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      letter-spacing: inherit;
      line-height: inherit;
      text-decoration-color: inherit;
      text-decoration: underline;
      white-space: nowrap;
    }
  `;

  static cssTertiary: CSSResult = css`
    .container {
      color: var(--wc-vacunas-tertiary-button-color, var(--color-text-action-secondary-default));
      text-decoration: var(--font-text-decoration-underline);
      text-decoration-color: var(
        --wc-vacunas-tertiary-button-text-decoration-color,
        var(--color-text-action-secondary-default)
      );
    }

    .state-layer {
      --stic-ripple-color: var(
        --wc-vacunas-tertiary-button-ripple-color,
        var(--color-background-hierarchy-inverse)
      );
    }

    .content {
      color: var(--wc-vacunas-tertiary-button-color, var(--color-text-action-secondary-default));
      --stic-icon-fill-color: var(
        --wc-vacunas-tertiary-button-icon-fill-color,
        var(--color-fill-secondary-default)
      );
    }
  `;

  static VacunasAlergiaButtonTheme: CSSResultOrNative[] = [
    VacunasAlergiaButtonTheme.cssBase,
    VacunasAlergiaButtonTheme.cssTertiary,
  ];
}
