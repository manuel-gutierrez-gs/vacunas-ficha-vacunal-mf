import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';

import { httpGetJson } from '../http/http-client';

import type { AlergiasContraindicacionesResponse } from '../../model/alergias-y-contraindicaciones.model';

export async function fetchAlergiasContraindicaciones(
  nuhsa: string,

  config: VacunasFichaVacunalRuntimeConfig
): Promise<AlergiasContraindicacionesResponse> {
  const url = `${config.urlApiAlergiasYContraindicacionesS039}/s039?nuhsa=${nuhsa}`;

  const raw = await httpGetJson<AlergiasContraindicacionesResponse>(url);

  return raw;
}
