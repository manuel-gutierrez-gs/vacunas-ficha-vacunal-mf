import { isNotStringEmpty, isStringEmpty } from '@sas/lib-stic-kernel';
import type { FontType } from '@sas/wc-stic-icon';
import type { SticRippleView } from '@sas/wc-stic-ripple';
import {
  SticMWCRippleAddEventListener,
  SticMWCRippleHandler,
  SticMWCRippleRemoveEventListener,
} from '@sas/wc-stic-ripple';
import { html, LitElement } from 'lit';
import { property, queryAsync } from 'lit/decorators.js';
import type { ClassInfo } from 'lit/directives/class-map.js';
import type { AlergiasContraindicacionesSlotProps, ButtonSize } from './model/alergia-button.model';
import type {
  VacunasAlergiaButtonVariant,
  VacunasAlergiaButtonVariantConfig,
} from './model/alergia-button-variant';
import { VARIANT_CONFIG } from './model/alergia-button-variant';
import { VacunasModalHostViewModel } from '../modal-host/modal-host.viewmodel';
import type { VacunasModalOpenEventData } from './event/alergia-button-modal-open.event';
import { VacunasModalOpenEvent } from './event/alergia-button-modal-open.event';
import '../modal/alergias-contraindicaciones/alergias-contraindicaciones.view';

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

    const modalHost = VacunasModalHostViewModel.instance;

    modalHost?.registerSlot(
      'alergias-contraindicaciones',
      (_props?: AlergiasContraindicacionesSlotProps) => html`
        <vacunas-alergias-contraindicaciones-modal></vacunas-alergias-contraindicaciones-modal>
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
    const payload: VacunasModalOpenEventData<AlergiasContraindicacionesSlotProps> = {
      id: 'alergias-modal',
      slotKey: 'alergias-contraindicaciones',
      title: 'Alergias y contraindicaciones',
      description: '',
      size: 'md',
      props: {},
    };
    this.dispatchEvent(new VacunasModalOpenEvent(payload));
  }
}
