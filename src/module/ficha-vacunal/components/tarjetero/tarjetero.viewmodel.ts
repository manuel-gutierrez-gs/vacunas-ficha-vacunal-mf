import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import type { FranjaEdad, Inmunizacion } from '../../model/ficha-vacunal.model';
import { filterFranjasBySeleccion } from '../../service/franja-filter.service';
import { unidadEdadToTexto } from '../../model/ficha-vacunal.model';

export class TarjeteroViewModel extends LitElement {
  @property({ attribute: false })
  franjasEdad: FranjaEdad[] = [];

  @property({ attribute: false })
  seleccion: string[] = [];

  get franjasFiltradas(): FranjaEdad[] {
    return filterFranjasBySeleccion(this.franjasEdad, this.seleccion);
  }

  formatFranjaLabel(franja: FranjaEdad): string {
    return `${franja.edad.numero} ${unidadEdadToTexto(franja.edad.unidad)}`;
  }
}
