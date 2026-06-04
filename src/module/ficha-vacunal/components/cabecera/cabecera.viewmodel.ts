import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import {
  sexoToTexto,
  unidadEdadToTexto,
  type ResumenPaciente,
} from '../../model/ficha-vacunal.model';


export class FichaVacunalCabeceraViewModel extends LitElement {

  @property({ type: Object }) resumenPaciente: ResumenPaciente = {};

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

}
