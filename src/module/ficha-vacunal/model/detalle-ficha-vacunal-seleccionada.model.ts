import type { SituacionEnum } from './ficha-vacunal.model';

export interface DetalleFichaVacunalSeleccionada {
  administradaPorEntePrivado: boolean;
  documentada: boolean;
  negacionDePaciente: boolean;
  situacion: SituacionEnum;
}
