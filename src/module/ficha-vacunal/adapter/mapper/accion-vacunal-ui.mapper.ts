import { AccionVacunal } from '@module/ficha-vacunal/model/accion-vacunal.model';
import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { fetchCalendarioById } from '../api/calendario.api';
import type { AccionVacunalDetalleUI } from '../../model/accion-vacunal-ui.model';

export async function mapAccionVacunalToUI(
  detalle: AccionVacunal,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<AccionVacunalDetalleUI> {
  let calendarioNombre = '';

  if (detalle.calendario) {
    try {
      const calendario = await fetchCalendarioById(Number(detalle.calendario), config);

      calendarioNombre = calendario.nombre ?? '';
    } catch {
      calendarioNombre = '';
    }
  }

  return {
    ...detalle,
    calendarioNombre,
  };
}
