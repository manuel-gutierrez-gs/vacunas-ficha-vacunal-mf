import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';
import { mapConfiguracionPacienteResponse } from '../mapper/configuracion-paciente.mapper';
import type { ConfiguracionPacienteData } from '../../model/configuracion-paciente.model';
import { configuracionPacienteCache } from '../../cache/configuracion-paciente.cache';

export async function fetchConfiguracionPacienteByNuhsa(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<ConfiguracionPacienteData> {
  const url = `${config.urlApiConfigPacientes}/configuracion-pacientes?nuhsa=${encodeURIComponent(nuhsa)}`;
  const raw = await httpGetJson<unknown>(url);
  return mapConfiguracionPacienteResponse(raw);
}

export function fetchConfiguracionPacienteCached(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<ConfiguracionPacienteData> {
  if (configuracionPacienteCache.has(nuhsa)) {
    console.log('[CONFIG PACIENTE CACHE HIT]', nuhsa);
    return Promise.resolve(configuracionPacienteCache.get(nuhsa)!);
  }

  console.log('[CONFIG PACIENTE FETCH]', nuhsa);
  const promise = fetchConfiguracionPacienteByNuhsa(nuhsa, config).catch((error) => {
    configuracionPacienteCache.clear(nuhsa);
    throw error;
  });

  configuracionPacienteCache.set(nuhsa, promise);
  return promise;
}
