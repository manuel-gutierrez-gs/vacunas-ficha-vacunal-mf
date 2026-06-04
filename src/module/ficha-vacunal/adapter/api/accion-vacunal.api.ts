import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';
import { mapAccionVacunalResponse } from '../mapper/accion-vacunal.mapper';
import type { AccionVacunal } from '../../model/accion-vacunal.model';

export async function fetchAccionVacunalById(
  id: number,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<AccionVacunal> {

  const url =
    `${config.urlApiConfigAccionVacunal}/acciones/${id}`;

  const raw =
    await httpGetJson<unknown>(url);

  return mapAccionVacunalResponse(raw);
}