import { VacunasFichaVacunalMfError } from '@shared/errors/mf-error';
import type { ConfiguracionPacienteData } from '../../model/configuracion-paciente.model';

export function mapConfiguracionPacienteResponse(data: unknown): ConfiguracionPacienteData {
  try {
    const raw = data as Record<string, unknown>;
    const calendarios = (raw.calendariosAsignados as unknown[]) ?? [];

    return {
      domainId: Number(raw.domainId ?? 0),
      nuhsaPaciente: String(raw.nuhsaPaciente ?? ''),
      calendariosAsignados: calendarios.map((item: unknown) => {
        const c = item as Record<string, unknown>;
        return {
          domainId: String(c.domainId ?? ''),
          nombre: String(c.nombre ?? ''),
        };
      }),
    };
  } catch (cause) {
    throw new VacunasFichaVacunalMfError(
      'MAPPING_ERROR',
      `Error al mapear configuración paciente: ${String(cause)}`
    );
  }
}
