export interface AccionVacunal {
  domainId?: string;

  tipoAccionVacunal:
    | 'VACUNACION'
    | 'NO_VACUNACION'
    | 'PROGRAMACION';

  calendario?: string;

  fechaAccion?: string;

  comentarios?: string;

  descripcion?: string;

  localizacion?: {
    codigo?: string;
    denominacion?: string;
  };

  profesional?: {
    nombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
  };

  productoInmunizacion?: {
    alias?: string;
  };

  datosVacunacion?: any;
  datosNoVacunacion?: any;
  datosProgramacion?: any;
}