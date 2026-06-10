import { html, CSSResultGroup, CSSResultOrNative } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FichaVacunalDetalleViewModel } from './detalle.viewmodel';
import { FichaVacunalDetalleTheme } from './css/detalle.css';
import {
  crumbs,
  itemsLotesExternosRegistrados,
  itemsViasAdministracion,
  itemsDosificaciones,
  itemsMotivosVacunacion,
  itemsContraindicaciones,
} from './model/detalle.model';

import '@sas/wc-stic-breadcrumbs';
import '@sas/wc-stic-button';
import '@sas/wc-stic-divider';
import '@sas/wc-stic-input-v2';
import '@sas/wc-stic-notification-v2';
import '@sas/wc-stic-tag';
import '@sas/wc-stic-text';

@customElement('ficha-vacunal-detalle')
export class FichaVacunalDetalleView extends FichaVacunalDetalleViewModel {
  static finalizeStyles = (styles?: CSSResultGroup): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    FichaVacunalDetalleTheme.base,
  ];

  render() {
    return html`
      <nav aria-label="breadcrumb">
        <stic-breadcrumbs .data=${crumbs}></stic-breadcrumbs>
      </nav>
      <div class="container">
        <div class="page-header">
          <stic-icon-button icon="arrow_back" @click=${this.navigateBack}></stic-icon-button>

          <h1>${this.aliasProductoInmunizacion || 'Vacuna'}</h1>

          <stic-tag
            text=${this.situacion || 'Sin estado'}
            color=${this.situacion === 'Pendiente en plazo' ? 'orange' : 'red'}
          ></stic-tag>
        </div>

        <form class="form">
          ${this.situacion === 'No Administrada'
            ? html`
                <stic-notification-v2-banner
                  isAccent
                  ?showNotification=${true}
                  isCloseable
                  title="Vacunación fuera de plazo"
                  description="Descripción de ejemplo"
                  semantic="warning"
                ></stic-notification-v2-banner>
              `
            : null}

          <stic-input-v2-date
            class="field-date"
            labelText="Fecha de vacunación"
            .value=${Date.now()}
          ></stic-input-v2-date>

          <div class="field-vaccine">
            Vacuna
            <stic-text text="${this.aliasProductoInmunizacion}"></stic-text>
          </div>

          <div class="field-action">
            <h3 class="title">Acción</h3>
            <stic-radio-group
              .items=${[
                { label: 'Vacuna administrada', value: 'vacunar' },
                { label: 'Vacuna documentada', value: 'documentar' },
                { label: 'Excluir', value: 'excluir' },
                { label: 'Negación de usuario', value: 'negacion' },
              ]}
              .value=""
              @radiogroup:changed=${() => {}}
            ></stic-radio-group>
          </div>

          <stic-divider></stic-divider>

          <!-- Información del lote (vacunación externa) -->
          ${this.tipoAccion === 'documentada'
            ? html`
                <section class="section">
                  <h3 class="section-title">Información del lote</h3>

                  <span class="muted block">Lugar donde se realizó la vacunación</span>

                  <stic-input-v2-radio
                    name="lugarVacunacion"
                    value="andalucia"
                    labelText="Andalucía"
                    ?checked=${this.lugarVacunacion === 'andalucia'}
                    @radio:changed=${() => {}}
                  ></stic-input-v2-radio>

                  <stic-input-v2-radio
                    name="lugarVacunacion"
                    value="otraCCAA"
                    labelText="Otra comunidad autónoma"
                    ?checked=${this.lugarVacunacion === 'otraCCAA'}
                    @radio:changed=${() => {}}
                  ></stic-input-v2-radio>

                  <stic-input-v2-radio
                    name="lugarVacunacion"
                    value="fueraEspanna"
                    labelText="Fuera de España"
                    ?checked=${this.lugarVacunacion === 'fueraEspanna'}
                    @radio:changed=${() => {}}
                  ></stic-input-v2-radio>

                  ${this.lugarVacunacion !== 'fueraEspanna'
                    ? html`
                        <span class="muted block">Lote conocido</span>

                        <stic-input-v2-radio
                          name="loteConocido"
                          value="si"
                          labelText="Sí"
                          ?checked=${this.loteConocido === 'si'}
                          @radio:changed=${() => {}}
                        ></stic-input-v2-radio>

                        <stic-input-v2-radio
                          name="loteConocido"
                          value="no"
                          labelText="No"
                          ?checked=${this.loteConocido === 'no'}
                          @radio:changed=${() => {}}
                        ></stic-input-v2-radio>

                        ${this.loteConocido === 'si'
                          ? html`
                              <span class="muted block">Lotes</span>

                              <stic-input-v2-radio
                                name="tipoLoteExterno"
                                value="registrado"
                                labelText="Lote registrado"
                                ?checked=${this.tipoLoteDocumentado === 'registrado'}
                                @radio:changed=${() => {}}
                              ></stic-input-v2-radio>

                              <stic-input-v2-radio
                                name="tipoLoteExterno"
                                value="nuevo"
                                labelText="Nuevo lote"
                                ?checked=${this.tipoLoteDocumentado === 'nuevo'}
                                @radio:changed=${() => {}}
                              ></stic-input-v2-radio>
                              ${this.tipoLoteDocumentado === 'registrado'
                                ? html`
                                    <stic-select-v2
                                      .dataSource=${itemsLotesExternosRegistrados}
                                      anchor="select"
                                      label="Lote"
                                    ></stic-select-v2>

                                    <div class="lote-row">
                                      <stic-select-v2
                                        .dataSource=${itemsViasAdministracion}
                                        anchor="select"
                                        label="Vía de administración"
                                      ></stic-select-v2>
                                      <stic-select-v2
                                        .dataSource=${itemsDosificaciones}
                                        anchor="select"
                                        label="Dosificación"
                                      ></stic-select-v2>
                                    </div>
                                  `
                                : null}
                            `
                          : null}
                      `
                    : null}
                </section>
              `
            : null}

          <stic-divider></stic-divider>

          <section class="section">
            <h3 class="section-title">Detalle de la vacunación</h3>

            ${this.tipoAccion === 'vacunar'
              ? html`
                  <stic-select-v2
                    .dataSource=${itemsMotivosVacunacion}
                    anchor="select"
                    label="Motivo de Vacunación"
                  ></stic-select-v2>
                `
              : null}
            ${this.tipoAccion === 'documentada'
              ? html`
                  <div class="comentarios">
                    <stic-input-v2-textarea
                      labelText="Descripción vacunación externa"
                    ></stic-input-v2-textarea>
                  </div>
                `
              : null}
            ${this.tipoAccion === 'excluir'
              ? html`
                  <stic-select-v2
                    .dataSource=${itemsContraindicaciones}
                    anchor="select"
                    label="Contraindicación"
                  ></stic-select-v2>
                `
              : null}
            ${this.tipoAccion === 'negacion'
              ? html`
                  <div class="comentarios">
                    <stic-input-v2-textarea
                      labelText="Motivos negación de usuario"
                    ></stic-input-v2-textarea>
                  </div>
                `
              : null}

            <div class="comentarios">
              <stic-input-v2-textarea labelText="Comentarios (Opcional)"> </stic-input-v2-textarea>
            </div>
          </section>
        </form>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ficha-vacunal-detalle': FichaVacunalDetalleView;
  }
}
