import {
  SticMWCRippleAddEventListener,
  SticMWCRippleHandler,
  SticMWCRippleRemoveEventListener,
  SticRippleView,
} from '@sas/wc-stic-ripple';
import { LitElement, html } from 'lit';
import { property, queryAsync } from 'lit/decorators.js';

import {
  SituacionEnum,
  situacionToTexto,
  type Inmunizacion,
} from '../../model/ficha-vacunal.model';

import {
  SITUACION_TAG_MAP,
  type TarjetaIcon,
} from './model/tarjeta.model';

export class TarjetaViewModel extends LitElement {

  @property({ attribute: false }) data!: Inmunizacion;

  @queryAsync('stic-ripple')
  public ripple!: Promise<SticRippleView | null>;
  protected rippleHandlers: SticMWCRippleHandler = new SticMWCRippleHandler(() => this.ripple);

  connectedCallback(): void {
    super.connectedCallback();
    SticMWCRippleAddEventListener(this, this.rippleHandlers);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    SticMWCRippleRemoveEventListener(this, this.rippleHandlers);
  }

  protected onSelect = (): void => {
    this.dispatchEvent(
      new CustomEvent('card-select', {
        detail: this.data,
        bubbles: true,
        composed: true,
      })
    );
  };

  protected getNombreVacuna(): string {
    return this.data?.productoInmunizacion?.alias ?? '';
  }

  protected getDetalleSituacion(): string {
    return this.data?.detalleSituacion ?? '';
  }

  protected esPendientePrimeraDosis(): boolean {
    return this.data?.situacion === SituacionEnum.PENDIENTE_PRIMERA_DOSIS;
  }

  protected esAislada(): boolean {
    return !this.data?.calendario;
  }

  protected getCardClassNames(): Record<string, boolean> {
    const situacion = this.data?.situacion;
    const aislada = this.esAislada();

    return {
      'ficha-vacunal-card': true,
      'ficha-vacunal-card--administrada':
        situacion === SituacionEnum.ADMINISTRADA && !aislada,
      'ficha-vacunal-card--administrada-aislada':
        situacion === SituacionEnum.ADMINISTRADA && aislada,
      'ficha-vacunal-card--no-administrada':
        situacion === SituacionEnum.NO_ADMINISTRADA && !aislada,
      'ficha-vacunal-card--no-administrada-aislada':
        situacion === SituacionEnum.NO_ADMINISTRADA && aislada,
      'ficha-vacunal-card--pendiente':
        (
          situacion === SituacionEnum.FUERA_PLAZO ||
          situacion === SituacionEnum.PENDIENTE_EN_PLAZO ||
          situacion === SituacionEnum.PENDIENTE_AUN_NO_EN_PLAZO ||
          situacion === SituacionEnum.PENDIENTE_PRIMERA_DOSIS
        ) && !aislada,
      'ficha-vacunal-card--excluida':
        situacion === SituacionEnum.EXCLUIDA && !aislada,
      'ficha-vacunal-card--excluida-aislada':
        situacion === SituacionEnum.EXCLUIDA && aislada,
      'ficha-vacunal-card--programada':
        situacion === SituacionEnum.PROGRAMADA && aislada,
    };
  }

  protected getIcons(): TarjetaIcon[] {
    const d = this.data;

    const configs = [
      { condition: !!d.comentarios, value: 'Comentarios', icon: 'forum' },
      { condition: !!d.efectosAdversosRegistrados, value: 'Reacciones', icon: 'flash_on' },
      {
        condition: !!d.administradaPorEntePrivado,
        value: 'Privado',
        icon: {
          name: 'Privado',
          path: 'M5.75575 17.0898C5.54358 17.0898 5.36458 17.018 5.21875 16.8742C5.07292 16.7305 5 16.5523 5 16.3398V3.83984C5 3.62734 5.07183 3.44922 5.2155 3.30547C5.35915 3.16172 5.53717 3.08984 5.74954 3.08984H14.7439C14.9563 3.08984 15.1354 3.16172 15.2812 3.30547C15.4271 3.44922 15.5 3.62734 15.5 3.83984V16.3398C15.5 16.5523 15.4281 16.7305 15.2844 16.8742C15.1406 17.018 14.9625 17.0898 14.75 17.0898H11V13.5898H9.5V17.0898H5.75575ZM6.5 15.5898H8V12.0898H12.5V15.5898H14V4.58984H6.5V15.5898ZM8 10.5898H9.5V9.08984H8V10.5898ZM8 7.58984H9.5V6.08984H8V7.58984ZM11 10.5898H12.5V9.08984H11V10.5898ZM11 7.58984H12.5V6.08984H11V7.58984Z',
          viewbox: '0 0 20 20',
        },
      },
      { condition: !!d.documentada, value: 'Documentada', icon: 'export_notes' },
      { condition: !!d.negacionDePaciente, value: 'Negación', icon: 'person_cancel' },
    ];

    return configs
      .filter(c => c.condition)
      .map(({ value, icon }) => ({ value, icon }));
  }

  protected getTagSetDataSource() {
    const tags: any[] = [];
    const situacion = this.data?.situacion;

    if (
      situacion &&
      situacion !== SituacionEnum.PENDIENTE_PRIMERA_DOSIS
    ) {
      const cfg = SITUACION_TAG_MAP[situacion];
      if (cfg) {
        tags.push({
          value: situacion,
          text: situacionToTexto(situacion),
          icon: cfg.icon,
          color: cfg.color,
        });
      }
    }

    if (!this.data?.calendario) {
      tags.push({
        value: 'aislada',
        text: 'Aislada',
        icon: '',
        color: 'blueLight',
      });
    }

    return tags;
  }

  protected renderIcon(cardIcon: TarjetaIcon) {
    if (typeof cardIcon.icon === 'string') {
      return html`<stic-icon icon=${cardIcon.icon} size="xs"></stic-icon>`;
    }

    return html`
      <svg
        viewBox=${cardIcon.icon.viewbox}
        width="20"
        height="20"
        fill="currentColor"
      >
        <path d=${cardIcon.icon.path}></path>
      </svg>
    `;
  }
}