import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';

import { httpGetJson } from '../http/http-client';

import type { AlergiasContraindicacionesResponse } from '../../model/alergias-y-contraindicaciones.model';
import { AlergiasContraindicacionesCache } from '../../cache/alergias-contraindicaciones.cache';

export async function fetchAlergiasContraindicaciones(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<AlergiasContraindicacionesResponse> {
  const url = `${config.urlApiAlergiasYContraindicacionesS039}/s039?nuhsa=${nuhsa}`;

  const raw = await httpGetJson<AlergiasContraindicacionesResponse>(url);

  return raw;
}

export function fetchAlergiasContraindicacionesCached(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<AlergiasContraindicacionesResponse> {
  if (AlergiasContraindicacionesCache.has(nuhsa)) {
    return Promise.resolve(AlergiasContraindicacionesCache.get(nuhsa)!);
  }

  const promise = fetchAlergiasContraindicaciones(nuhsa, config).catch(error => {
    AlergiasContraindicacionesCache.clear(nuhsa);
    throw error;
  });

  AlergiasContraindicacionesCache.set(nuhsa, promise);
  return promise;
}
