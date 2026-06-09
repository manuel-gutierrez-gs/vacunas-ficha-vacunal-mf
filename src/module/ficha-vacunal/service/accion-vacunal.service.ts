import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';

import { fetchAccionVacunalById } from '../adapter/api/accion-vacunal.api';

import { fetchCalendarioById } from '../adapter/api/calendario.api';

export async function loadAccionVacunal(
  accionVacunalId: number,
  config: VacunasFichaVacunalRuntimeConfig
) {
  const accion = await fetchAccionVacunalById(accionVacunalId, config);

  let calendarioNombre = '';

  if (accion.calendario) {
    const calendario = await fetchCalendarioById(Number(accion.calendario), config);

    calendarioNombre = calendario.nombre;
  }

  return {
    accion,
    calendarioNombre,
  };
}
