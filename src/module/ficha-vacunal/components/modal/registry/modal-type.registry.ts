import { VacunasModalType } from '../model/modal.model';

export const VACUNAS_MODAL_TYPE_REGISTRY: Record<string, { type: VacunasModalType }> = {
  'alergias-contraindicaciones': { type: 'passive' },
  'incidencias': { type: 'warning' },
  'confirmacion-eliminar': { type: 'confirmation' },
};
