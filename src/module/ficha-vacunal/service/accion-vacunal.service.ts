import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';

import { fetchAccionVacunalCached } from '../adapter/api/accion-vacunal.api';

import { fetchCalendarioCached } from '../adapter/api/calendario.api';

export async function loadAccionVacunal(
  accionVacunalId: number,
  config: VacunasFichaVacunalRuntimeConfig
) {
  const accion = await fetchAccionVacunalCached(accionVacunalId, config);

  let calendarioNombre = '';

  if (accion.calendario) {
    const calendario = await fetchCalendarioCached(Number(accion.calendario), config);

    calendarioNombre = calendario.nombre;
  }

  return {
    accion,
    calendarioNombre,
  };
}
