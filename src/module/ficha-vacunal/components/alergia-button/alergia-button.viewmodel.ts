import { isNotStringEmpty, isStringEmpty } from '@sas/lib-stic-kernel';
import { FontType } from '@sas/wc-stic-icon';
import {
  SticMWCRippleAddEventListener,
  SticMWCRippleHandler,
  SticMWCRippleRemoveEventListener,
  SticRippleView,
} from '@sas/wc-stic-ripple';
import { LitElement } from 'lit';
import { property, queryAsync } from 'lit/decorators.js';
import { ClassInfo } from 'lit/directives/class-map.js';
import {
  VacunasAlergiaButtonClickEvent,
  VacunasAlergiaButtonClickEventData,
} from './event/alergia-button-click.event';
import type { ButtonSize } from './model/alergia-button.model';
import {
  VARIANT_CONFIG,
  VacunasAlergiaButtonVariant,
  VacunasAlergiaButtonVariantConfig,
} from './model/alergia-button-variant';

export class VacunasAlergiaButtonViewModel extends LitElement {
  @property({ type: String }) public label: string = '';
  @property({ type: String }) public size: ButtonSize = 'sm';
  @property({ type: String }) public title: string = '';
  @property({ type: String }) public icon: string = '';
  @property({ type: String }) public iconFontType!: FontType;
  @property({ type: Boolean, reflect: true }) public iconFilled: boolean = false;
  @property({ type: String, reflect: true }) public variant?: VacunasAlergiaButtonVariant;

  @queryAsync('stic-ripple')
  protected sticRipple!: Promise<SticRippleView | null>;

  protected rippleHandlers = new SticMWCRippleHandler(
    () => this.sticRipple ?? Promise.resolve(null)
  );

  connectedCallback(): void {
    super.connectedCallback();
    SticMWCRippleAddEventListener(this, this.rippleHandlers);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    SticMWCRippleRemoveEventListener(this, this.rippleHandlers);
  }

  protected getVariantConfig(): VacunasAlergiaButtonVariantConfig | undefined {
    if (!this.variant) return undefined;
    return VARIANT_CONFIG[this.variant];
  }

  protected getContainerClasses(): ClassInfo {
    return {
      text: isNotStringEmpty(this.label),
      icon: this.hasIcon(),
      sm: isStringEmpty(this.size) || this.size === 'sm',
      md: this.size === 'md',
      lg: this.size === 'lg',
    };
  }

  protected getContentLayerClasses(): ClassInfo {
    return {
      text: isNotStringEmpty(this.label),
      icon: this.hasIcon(),
    };
  }

  protected hasIcon(): boolean {
    return isNotStringEmpty(this.icon);
  }

  protected clickHandler(_e: Event) {
    this.dispatchEvent(
      new VacunasAlergiaButtonClickEvent(new VacunasAlergiaButtonClickEventData(this.label ?? ''))
    );
  }
}
