import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';

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
