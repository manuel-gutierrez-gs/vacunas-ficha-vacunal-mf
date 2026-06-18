import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import {
  sexoToTexto,
  unidadEdadToTexto,
  type ResumenPaciente,
} from '../../model/ficha-vacunal.model';

import { resolveRuntimeConfig } from '@shared/config/runtime-config';
import { fetchAlergiasContraindicacionesCached } from '../../adapter/api/alergias-contraindicaciones.api';
import type { VacunasAlergiaButtonVariant } from '../alergia-button/model/alergia-button-variant';
import type { AlergiasContraindicacionesResponse } from '@module/ficha-vacunal/model/alergias-y-contraindicaciones.model';
import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { PacienteContextRequestEvent } from '@shared/context/paciente-context';
import type { PacienteContext } from '@shared/context/paciente-context';

export class FichaVacunalCabeceraViewModel extends LitElement {
  @property({ type: Object }) resumenPaciente: ResumenPaciente = {};

  @property({ type: String }) alergiasVariant: VacunasAlergiaButtonVariant = 'loading';

  private _contextNuhsa = '';
  private runtimeConfig?: VacunasFichaVacunalRuntimeConfig;

  get nombreCompleto(): string {
    const { nombre = '', apellidos = '' } = this.resumenPaciente;
    return `${nombre} ${apellidos}`.trim();
  }

  get sexoYEdad(): string {
    const sexo = sexoToTexto(this.resumenPaciente.sexo);
    const edad = this.resumenPaciente.edad;
    if (!edad) {
      return sexo;
    }
    return `${sexo}, ${edad.numero} ${unidadEdadToTexto(edad.unidad)}`;
  }

  get nuhsaDisplay(): string {
    return this.resumenPaciente.nuhsa ?? '';
  }

  private _unsubscribeContext?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    const event = new PacienteContextRequestEvent(this.handleContextChange, true);
    this.dispatchEvent(event);
    this._unsubscribeContext = event.unsubscribe;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubscribeContext) {
      this._unsubscribeContext();
      this._unsubscribeContext = undefined;
    }
  }

  private handleContextChange = (context: PacienteContext): void => {
    this.runtimeConfig = context.runtimeConfig;
    if (this._contextNuhsa !== context.nuhsa) {
      this._contextNuhsa = context.nuhsa;
      if (this._contextNuhsa) {
        void this.loadAlergiasVariant(this._contextNuhsa);
      }
    }
  };

  private async loadAlergiasVariant(nuhsa: string) {
    try {
      const config = resolveRuntimeConfig(this.runtimeConfig);
      const response = await fetchAlergiasContraindicacionesCached(nuhsa, config);
      if (this._contextNuhsa !== nuhsa) return;
      this.alergiasVariant = this.calcularEstadoAlergias(response);
    } catch (error) {
      console.error('Error al obtener alergias o contraindicaciones: ', error);
      if (this._contextNuhsa !== nuhsa) return;
      this.alergiasVariant = 'technical-error';
    }
  }

  private calcularEstadoAlergias(
    response: AlergiasContraindicacionesResponse
  ): VacunasAlergiaButtonVariant {
    if (response.errorConsultaHis) {
      return 'technical-error';
    }
    const hasData = response.alergias.length > 0 || response.listaContraindic.length > 0;
    if (hasData) {
      return 'has-allergies';
    }

    // TODO: 'verify' queda reservado para futuras reglas de negocio cuando exista un criterio
    // explícito para diferenciar:
    // * sin alergias conocidas
    // * sin información registrada
    return 'no-allergies';
  }
}
