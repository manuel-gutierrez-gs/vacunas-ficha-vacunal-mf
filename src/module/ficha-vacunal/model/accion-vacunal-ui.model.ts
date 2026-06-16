import type { AccionVacunal } from './accion-vacunal.model';
import type { DetalleFichaVacunalSeleccionada } from './detalle-ficha-vacunal-seleccionada.model';

export interface AccionVacunalUI {
  detalleAccionVacunal: AccionVacunal;
  detalleFichaVacunalSeleccionada: DetalleFichaVacunalSeleccionada;

  calendarioNombre?: string;

  accionPreviaNombre?: string;
}
