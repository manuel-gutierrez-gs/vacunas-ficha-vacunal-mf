export interface CalendarioAsignado {
  domainId: string;
  nombre: string;
}

export interface ConfiguracionPacienteData {
  domainId: number;
  nuhsaPaciente: string;
  calendariosAsignados: CalendarioAsignado[];
}
