import { isNotStringEmpty, isStringEmpty } from '@sas/lib-stic-kernel';
import { FontType } from '@sas/wc-stic-icon';
import {
  SticMWCRippleAddEventListener,
  SticMWCRippleHandler,
  SticMWCRippleRemoveEventListener,
  SticRippleView,
} from '@sas/wc-stic-ripple';
import { html, LitElement } from 'lit';
import { property, queryAsync } from 'lit/decorators.js';
import { ClassInfo } from 'lit/directives/class-map.js';
import type { ButtonSize } from './model/alergia-button.model';
import {
  VARIANT_CONFIG,
  VacunasAlergiaButtonVariant,
  VacunasAlergiaButtonVariantConfig,
} from './model/alergia-button-variant';
import { VacunasModalHostViewModel } from '../modal-host/modal-host.viewmodel';
import {
  VacunasModalOpenEvent,
  VacunasModalOpenEventData,
} from './event/alergia-button-modal-open.event';
import '../modal/alergias-contraindicaciones/alergias-contraindicaciones.view';

export class VacunasAlergiaButtonViewModel extends LitElement {
  @property({ type: String }) public label: string = '';
  @property({ type: String }) public size: ButtonSize = 'sm';
  @property({ type: String }) public title: string = '';
  @property({ type: String }) public icon: string = '';
  @property({ type: String }) public iconFontType!: FontType;
  @property({ type: Boolean, reflect: true }) public iconFilled: boolean = false;
  @property({ type: String, reflect: true }) public variant?: VacunasAlergiaButtonVariant;
  @property({ type: String }) public nuhsa: string = '';

  @queryAsync('stic-ripple')
  protected sticRipple!: Promise<SticRippleView | null>;

  protected rippleHandlers = new SticMWCRippleHandler(
    () => this.sticRipple ?? Promise.resolve(null)
  );

  connectedCallback(): void {
    super.connectedCallback();
    SticMWCRippleAddEventListener(this, this.rippleHandlers);

    const host = VacunasModalHostViewModel.instance;

    host?.registerSlot(
      'alergias-contraindicaciones',
      (props?: Record<string, any>) => html`
        <vacunas-alergias-contraindicaciones-modal
          .nuhsa=${props?.nuhsa ?? ''}
        ></vacunas-alergias-contraindicaciones-modal>
      `
    );
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
    const payload: VacunasModalOpenEventData = {
      id: 'alergias-modal',
      slotKey: 'alergias-contraindicaciones',
      title: 'Alergias y contraindicaciones',
      description: '',
      size: 'md',
      props: { nuhsa: this.nuhsa },
    };
    this.dispatchEvent(new VacunasModalOpenEvent(payload));
  }
}
