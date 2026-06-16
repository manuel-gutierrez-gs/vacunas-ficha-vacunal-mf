import type { CSSResultGroup, CSSResultOrNative } from 'lit';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FichaVacunalDetalleViewModel } from './detalle.viewmodel';
import { FichaVacunalDetalleTheme } from './css/detalle.css';
import {
  accionesVacunales,
  itemsLotesDocumentadosRegistrados,
  itemsViasAdministracion,
  itemsDosificaciones,
  itemsMotivosVacunacion,
  itemsContraindicaciones,
  itemsLotesSSPA,
  itemsLotesUsuario,
} from './model/detalle.model';

import '@sas/wc-stic-breadcrumbs';
import '@sas/wc-stic-button';
import '@sas/wc-stic-divider';
import '@sas/wc-stic-input-v2';
import '@sas/wc-stic-notification-v2';
import '@sas/wc-stic-radio-group';
import '@sas/wc-stic-tag';
import '@sas/wc-stic-text';
import { capitalize } from '@module/ficha-vacunal/utils/string.utils';

@customElement('ficha-vacunal-detalle')
export class FichaVacunalDetalleView extends FichaVacunalDetalleViewModel {
  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    FichaVacunalDetalleTheme.base,
  ];

  render() {
    return html`
      <nav aria-label="breadcrumb" class="detalle-ficha-vacunal__breadcrumb">
        <stic-breadcrumbs .data=${this.getCrumbs()}></stic-breadcrumbs>
      </nav>

      <div class="detalle-ficha-vacunal__container">
        <div class="detalle-ficha-vacunal__header">
          <stic-icon-button icon="arrow_back" @click=${this.navigateBack}></stic-icon-button>

          <h1 class="detalle-ficha-vacunal__title">
            ${this.aliasProductoInmunizacion || 'Vacuna'}
          </h1>

          <stic-tag
            class="detalle-ficha-vacunal__status"
            text=${capitalize(this.situacion!) || 'Sin estado'}
            color=${this.situacion === 'Pendiente en plazo' ? 'orange' : 'red'}
          ></stic-tag>
        </div>

        <form class="detalle-ficha-vacunal__form">
          ${this.situacion === 'NO_ADMINISTRADA' || this.situacion === 'FUERA_PLAZO'
            ? html`
                <stic-notification-v2-banner
                  isAccent
                  ?showNotification=${true}
                  isCloseable
                  title="Vacunación ${capitalize(this.situacion!)}"
                  semantic="warning"
                ></stic-notification-v2-banner>
              `
            : null}

          <stic-input-v2-date
            class="field-date"
            labelText="Fecha de vacunación"
            .value=${Date.now()}
          ></stic-input-v2-date>

          <div class="detalle-ficha-vacunal__section">
            <h3 class="detalle-ficha-vacunal__section-title">Vacuna</h3>

            <stic-text text="${this.aliasProductoInmunizacion}"></stic-text>
          </div>

          <div class="detalle-ficha-vacunal__section">
            <h3 class="detalle-ficha-vacunal__section-title">Acción</h3>

            <stic-radio-group
              .items=${accionesVacunales}
              .value=${this.tipoAccion}
              @radiogroup:changed=${this.onAccionChanged}
            ></stic-radio-group>
          </div>

          ${this.tipoAccion === 'vacunar'
            ? html`
                <stic-divider></stic-divider>

                <section class="detalle-ficha-vacunal__section">
                  <h3 class="detalle-ficha-vacunal__section-title">Información del lote</h3>

                  <span class="detalle-ficha-vacunal__muted"> Procedencia del lote </span>

                  <stic-input-v2-radio
                    name="loteAdquiridoPor"
                    value="sspa"
                    labelText="Adquirido por el SSPA"
                    ?checked=${this.loteAdquiridoPor === 'sspa'}
                    @radio:changed=${(e: CustomEvent) => {
                      if (e.detail.checked) {
                        this.setLoteAdquiridoPor(e.detail.value);
                      }
                    }}
                  ></stic-input-v2-radio>

                  ${this.loteAdquiridoPor === 'sspa'
                    ? html`
                        <stic-select-v2
                          .dataSource=${itemsLotesSSPA}
                          label="Lotes"
                        ></stic-select-v2>
                      `
                    : null}

                  <stic-input-v2-radio
                    name="loteAdquiridoPor"
                    value="usuario"
                    labelText="Adquirido por el usuario"
                    ?checked=${this.loteAdquiridoPor === 'usuario'}
                    @radio:changed=${(e: CustomEvent) => {
                      if (e.detail.checked) {
                        this.setLoteAdquiridoPor(e.detail.value);
                      }
                    }}
                  ></stic-input-v2-radio>

                  ${this.loteAdquiridoPor === 'usuario'
                    ? html`
                        <stic-select-v2
                          .dataSource=${itemsLotesUsuario}
                          label="Lotes"
                        ></stic-select-v2>
                      `
                    : null}
                </section>
              `
            : null}
          ${this.tipoAccion === 'documentada'
            ? html`
                <stic-divider></stic-divider>

                <section class="detalle-ficha-vacunal__section">
                  <h3 class="detalle-ficha-vacunal__section-title">Información del lote</h3>

                  <span class="detalle-ficha-vacunal__muted">
                    Lugar donde se realizó la vacunación
                  </span>

                  <stic-input-v2-radio
                    name="lugarVacunacion"
                    value="andalucia"
                    labelText="Andalucía"
                    ?checked=${this.lugarVacunacion === 'andalucia'}
                    @radio:changed=${(e: CustomEvent) => {
                      if (e.detail.checked) {
                        this.setLugarVacunacion(e.detail.value);
                      }
                    }}
                  ></stic-input-v2-radio>

                  <stic-input-v2-radio
                    name="lugarVacunacion"
                    value="otraCCAA"
                    labelText="Otra comunidad autónoma"
                    ?checked=${this.lugarVacunacion === 'otraCCAA'}
                    @radio:changed=${(e: CustomEvent) => {
                      if (e.detail.checked) {
                        this.setLugarVacunacion(e.detail.value);
                      }
                    }}
                  ></stic-input-v2-radio>

                  <stic-input-v2-radio
                    name="lugarVacunacion"
                    value="fueraEspanna"
                    labelText="Fuera de España"
                    ?checked=${this.lugarVacunacion === 'fueraEspanna'}
                    @radio:changed=${(e: CustomEvent) => {
                      if (e.detail.checked) {
                        this.setLugarVacunacion(e.detail.value);
                      }
                    }}
                  ></stic-input-v2-radio>

                  ${this.lugarVacunacion !== 'fueraEspanna'
                    ? html`
                        <span class="detalle-ficha-vacunal__muted"> Lote conocido </span>

                        <stic-input-v2-radio
                          name="loteConocido"
                          value="si"
                          labelText="Sí"
                          ?checked=${this.loteConocido === 'si'}
                          @radio:changed=${(e: CustomEvent) => {
                            if (e.detail.checked) {
                              this.setLoteConocido(e.detail.value);
                            }
                          }}
                        ></stic-input-v2-radio>

                        <stic-input-v2-radio
                          name="loteConocido"
                          value="no"
                          labelText="No"
                          ?checked=${this.loteConocido === 'no'}
                          @radio:changed=${(e: CustomEvent) => {
                            if (e.detail.checked) {
                              this.setLoteConocido(e.detail.value);
                            }
                          }}
                        ></stic-input-v2-radio>

                        ${this.loteConocido === 'si'
                          ? html`
                              <span class="detalle-ficha-vacunal__muted"> Lotes </span>

                              <div class="detalle-ficha-vacunal__lote-row">
                                <stic-select-v2
                                  .dataSource=${itemsLotesDocumentadosRegistrados}
                                  label="Lote"
                                ></stic-select-v2>

                                <stic-select-v2
                                  .dataSource=${itemsViasAdministracion}
                                  label="Vía de administración"
                                ></stic-select-v2>

                                <stic-select-v2
                                  .dataSource=${itemsDosificaciones}
                                  label="Dosificación"
                                ></stic-select-v2>
                              </div>
                            `
                          : null}
                      `
                    : null}
                </section>
              `
            : null}

          <stic-divider></stic-divider>

          <section class="detalle-ficha-vacunal__section">
            <h3 class="detalle-ficha-vacunal__section-title">Detalle de la vacunación</h3>

            ${this.tipoAccion === 'vacunar'
              ? html`
                  <stic-select-v2
                    .dataSource=${itemsMotivosVacunacion}
                    label="Motivo de Vacunación"
                  ></stic-select-v2>
                `
              : null}
            ${this.tipoAccion === 'documentada'
              ? html`
                  <div class="detalle-ficha-vacunal__textarea">
                    <stic-input-v2-textarea
                      labelText="Descripción vacunación documentada"
                    ></stic-input-v2-textarea>
                  </div>
                `
              : null}
            ${this.tipoAccion === 'excluir'
              ? html`
                  <stic-select-v2
                    .dataSource=${itemsContraindicaciones}
                    label="Contraindicación"
                  ></stic-select-v2>
                `
              : null}
            ${this.tipoAccion === 'negacion'
              ? html`
                  <div class="detalle-ficha-vacunal__textarea">
                    <stic-input-v2-textarea
                      labelText="Motivos negación de usuario"
                    ></stic-input-v2-textarea>
                  </div>
                `
              : null}

            <div class="detalle-ficha-vacunal__textarea">
              <stic-input-v2-textarea labelText="Comentarios (Opcional)"></stic-input-v2-textarea>
            </div>
          </section>
        </form>

        <div class="button-group">
          <stic-button variant="primary" size="md" label="Aceptar" disabled></stic-button>
          <stic-button
            variant="secondary"
            size="md"
            label="Cancelar"
            @click=${this.navigateBack}
          ></stic-button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ficha-vacunal-detalle': FichaVacunalDetalleView;
  }
}
