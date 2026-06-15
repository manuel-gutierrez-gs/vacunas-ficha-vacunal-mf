import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';
import { mapAccionVacunalResponse } from '../mapper/accion-vacunal.mapper';
import type { AccionVacunal } from '../../model/accion-vacunal.model';
import { accionVacunalCache } from '../../cache/accion-vacunal.cache';

export async function fetchAccionVacunalById(
  id: number,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<AccionVacunal> {
  const url = `${config.urlApiConfigAccionVacunal}/acciones/${id}`;

  const raw = await httpGetJson<unknown>(url);

  return mapAccionVacunalResponse(raw);
}

export async function fetchAccionVacunalCached(
  id: number,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<AccionVacunal> {
  const cacheId = String(id);
  if (accionVacunalCache.has(cacheId)) {
    return accionVacunalCache.get(cacheId)!;
  }

  const promise = fetchAccionVacunalById(id, config).catch(err => {
    accionVacunalCache.clear(cacheId);
    throw err;
  });

  accionVacunalCache.set(cacheId, promise);
  return promise;
}
