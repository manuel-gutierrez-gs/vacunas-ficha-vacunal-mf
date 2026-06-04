import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';
import { mapFichaVacunalResponse } from '../mapper/ficha-vacunal.mapper';
import type { FichaVacunalData } from '../../model/ficha-vacunal.model';

export async function fetchFichaVacunalByNuhsa(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<FichaVacunalData> {
  const url = `${config.urlApiFichaVacunal}/ficha-vacunal/${encodeURIComponent(nuhsa)}`;
  const raw = await httpGetJson<unknown>(url);
  return mapFichaVacunalResponse(raw);
}
