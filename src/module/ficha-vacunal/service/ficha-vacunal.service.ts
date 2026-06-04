import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { fetchConfiguracionPacienteByNuhsa } from '../adapter/api/configuracion-paciente.api';
import { fetchFichaVacunalByNuhsa } from '../adapter/api/ficha-vacunal.api';
import type { FichaVacunalAggregate } from '../model/ficha-vacunal-aggregate.model';
import { buildFilterSet, buildSeleccionInicial } from './filter-set.builder';

export async function loadFichaVacunalAggregate(
  nuhsa: string,
  config: VacunasFichaVacunalRuntimeConfig
): Promise<FichaVacunalAggregate> {
  const [configuracion, ficha] = await Promise.all([
    fetchConfiguracionPacienteByNuhsa(nuhsa, config),
    fetchFichaVacunalByNuhsa(nuhsa, config),
  ]);

  const calendarios = configuracion.calendariosAsignados;

  return {
    resumenPaciente: ficha.resumenPaciente,
    franjasEdad: ficha.franjasEdad,
    calendariosAsignados: calendarios,
    filterSet: buildFilterSet(calendarios),
    seleccionInicial: buildSeleccionInicial(calendarios),
  };
}
