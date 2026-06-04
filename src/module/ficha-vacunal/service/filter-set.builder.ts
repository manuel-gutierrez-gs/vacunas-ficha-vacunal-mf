import type { CalendarioAsignado } from '../model/configuracion-paciente.model';
import type { FilterChipDefinition } from '../model/ficha-vacunal-aggregate.model';

const AISLADA_FILTER: FilterChipDefinition = {
  idFilter: 'filter-aislada',
  filterChipType: 'filter-chip-select',
  label: 'Vacunaciones aisladas',
  value: 'aislada',
  dataSource: [{ value: 'aislada', displayName: 'Vacunaciones aisladas' }],
  visible: true,
};

export function buildFilterSet(calendarios: CalendarioAsignado[]): FilterChipDefinition[] {
  const calendarioFilters = calendarios.map(calendario => ({
    idFilter: `filter-calendario-v-${calendario.domainId}`,
    filterChipType: 'filter-chip-select',
    label: calendario.nombre,
    value: String(calendario.domainId),
    dataSource: [
      {
        value: String(calendario.domainId),
        displayName: calendario.nombre,
      },
    ],
    visible: true,
  }));

  return [AISLADA_FILTER, ...calendarioFilters];
}

export function buildSeleccionInicial(calendarios: CalendarioAsignado[]): string[] {
  return ['aislada', ...calendarios.map(c => String(c.domainId))];
}
