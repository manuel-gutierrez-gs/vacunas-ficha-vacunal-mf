import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import {
  sexoToTexto,
  unidadEdadToTexto,
  type ResumenPaciente,
} from '../../model/ficha-vacunal.model';

import { resolveRuntimeConfig } from '@shared/config/runtime-config';
import { fetchAlergiasContraindicaciones } from '../../adapter/api/alergias-contraindicaciones.api';
import type { VacunasAlergiaButtonVariant } from '../alergia-button/model/alergia-button-variant';
import { AlergiasContraindicacionesResponse } from '@module/ficha-vacunal/model/alergias-y-contraindicaciones.model';

export class FichaVacunalCabeceraViewModel extends LitElement {
  @property({ type: Object }) resumenPaciente: ResumenPaciente = {};

  @property({ type: String }) alergiasVariant: VacunasAlergiaButtonVariant = 'loading';

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

  private _loadedNuhsa?: string;

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('resumenPaciente') && this.nuhsaDisplay) {
      if (this.nuhsaDisplay !== this._loadedNuhsa) {
        this._loadedNuhsa = this.nuhsaDisplay;
        await this.loadAlergiasVariant(this.nuhsaDisplay);
      }
    }
  }

  private async loadAlergiasVariant(nuhsa: string) {
    try {
      const config = resolveRuntimeConfig((this as any).runtimeConfig);
      const response = await fetchAlergiasContraindicaciones(nuhsa, config);
      if (this.nuhsaDisplay !== nuhsa) return;
      this.alergiasVariant = this.calcularEstadoAlergias(response);
    } catch (error) {
      if (this.nuhsaDisplay !== nuhsa) return;
      this.alergiasVariant = 'technical-error';
    }
  }

  private calcularEstadoAlergias(
    response: AlergiasContraindicacionesResponse
  ): VacunasAlergiaButtonVariant {
    if (response.errorConsultaHis) {
      return 'technical-error';
    }
    const tieneDatos = response.alergias.length > 0 || response.contraindicaciones.length > 0;
    if (tieneDatos) {
      return 'has-allergies';
    }

    // TODO: 'verify' queda reservado para futuras reglas de negocio cuando exista un criterio
    // explícito para diferenciar:
    // * sin alergias conocidas
    // * sin información registrada
    return 'no-allergies';
  }
}
