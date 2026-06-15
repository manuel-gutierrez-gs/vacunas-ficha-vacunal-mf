import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';
import { mapFichaVacunalResponse } from '../mapper/ficha-vacunal.mapper';
import type { FichaVacunalData } from '../../model/ficha-vacunal.model';
import { fichaVacunalCache } from '../../cache/ficha-vacunal.cache';

export async function fetchFichaVacunalByNuhsa(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<FichaVacunalData> {
  const url = `${config.urlApiFichaVacunal}/ficha-vacunal/${encodeURIComponent(nuhsa)}`;
  const raw = await httpGetJson<unknown>(url);
  return mapFichaVacunalResponse(raw);
}

export async function fetchFichaVacunalCached(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<FichaVacunalData> {
  if (fichaVacunalCache.has(nuhsa)) {
    console.log('[FICHA CACHE HIT]', nuhsa);
    return fichaVacunalCache.get(nuhsa)!;
  }

  console.log('[FICHA FETCH]', nuhsa);
  const promise = fetchFichaVacunalByNuhsa(nuhsa, config)
    .then((data) => {
      fichaVacunalCache.set(nuhsa, data);
      return data;
    })
    .catch((error) => {
      fichaVacunalCache.clear(nuhsa);
      throw error;
    });

  fichaVacunalCache.set(nuhsa, promise);
  return promise;
}
