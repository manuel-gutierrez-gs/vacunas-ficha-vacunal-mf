import type { CalendarioAsignado } from './configuracion-paciente.model';
import type { FranjaEdad, ResumenPaciente } from './ficha-vacunal.model';

export interface FilterChipDefinition {
  idFilter: string;
  filterChipType: string;
  label: string;
  value: string;
  dataSource: Array<{ value: string; displayName: string }>;
  visible: boolean;
}

export interface FichaVacunalAggregate {
  resumenPaciente: ResumenPaciente;
  franjasEdad: FranjaEdad[];
  calendariosAsignados: CalendarioAsignado[];
  filterSet: FilterChipDefinition[];
  seleccionInicial: string[];
}
