import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';
import { calendarioCache } from '../../cache/calendario.cache';

export interface CalendarioResponse {
  domainId: number;
  nombre: string;
}

export async function fetchCalendarioById(
  id: number,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<CalendarioResponse> {
  const url = `${config.urlApiConfigCalendarios}/calendarios/${id}`;
  return httpGetJson<CalendarioResponse>(url);
}

export async function fetchCalendarioCached(
  id: number,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<CalendarioResponse> {
  const cacheId = String(id);
  if (calendarioCache.has(cacheId)) {
    return calendarioCache.get(cacheId)!;
  }

  const promise = fetchCalendarioById(id, config).catch(err => {
    calendarioCache.clear(cacheId);
    throw err;
  });

  calendarioCache.set(cacheId, promise);
  return promise;
}
