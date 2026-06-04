import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { httpGetJson } from '../http/http-client';
import { mapConfiguracionPacienteResponse } from '../mapper/configuracion-paciente.mapper';
import type { ConfiguracionPacienteData } from '../../model/configuracion-paciente.model';

export async function fetchConfiguracionPacienteByNuhsa(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<ConfiguracionPacienteData> {
  const url = `${config.urlApiConfigPacientes}/configuracion-pacientes?nuhsa=${encodeURIComponent(nuhsa)}`;
  const raw = await httpGetJson<unknown>(url);
  return mapConfiguracionPacienteResponse(raw);
}
