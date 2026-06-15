import { CSSResultGroup, CSSResultOrNative, html, nothing, TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@sas/wc-stic-icon';
import '@sas/wc-stic-ripple';
import '@sas/wc-stic-tooltip';
import { VacunasAlergiaButtonTheme } from './css/alergia-button-theme.css';
import { VacunasAlergiaButtonViewModel } from './alergia-button.viewmodel';

export class VacunasAlergiaButtonView extends VacunasAlergiaButtonViewModel {
  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...VacunasAlergiaButtonTheme.VacunasAlergiaButtonTheme,
  ];

  render() {
    const { icon, filled, color, tooltip } = this.getVariantConfig() ?? {};
    return html`
      <div class="wrapper">
        <button
          aria-label=${this.label}
          class="container ${classMap(this.getContainerClasses())}"
          title=${ifDefined(this.title)}
          @click=${this.clickHandler}
        >
          ${this.renderContent()}
        </button>
        ${this.getVariantConfig()
          ? this.renderIconBadge(icon!, filled!, color!, tooltip!)
          : nothing}
      </div>
    `;
  }

  protected renderContent(): TemplateResult {
    return html`
      ${this.renderStateLayer()}
      <div class="content ${classMap(this.getContentLayerClasses())}">
        ${this.renderIcon()} ${this.renderLabel()}
      </div>
    `;
  }

  protected renderStateLayer(): TemplateResult {
    return html` <div class="state-layer">${this.renderRipple()}</div> `;
  }

  protected renderRipple(): TemplateResult {
    return html`<stic-ripple class="ripple" ?primary="${false}"></stic-ripple>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="label">${this.label}</span>`;
  }

  protected renderIcon(): TemplateResult | typeof nothing {
    if (!this.hasIcon()) return nothing;
    return html`
      <stic-icon
        .icon=${this.icon}
        ?filled=${this.iconFilled}
        .fontType=${this.iconFontType}
      ></stic-icon>
    `;
  }

  protected renderIconBadge(
    icon: string,
    filled: boolean,
    color: string,
    tooltip: string
  ): TemplateResult {
    return html`
      <div class="badge-anchor">
        <stic-tooltip content=${tooltip} position="below">
          <div class="icon-badge">
            <stic-icon
              .icon=${icon}
              ?filled=${filled}
              style="--stic-icon-fill-color: ${color};"
            ></stic-icon>
          </div>
        </stic-tooltip>
      </div>
    `;
  }
}

window.customElements.define('vacunas-alergia-button', VacunasAlergiaButtonView);

declare global {
  interface HTMLElementTagNameMap {
    'vacunas-alergia-button': VacunasAlergiaButtonView;
  }
}
