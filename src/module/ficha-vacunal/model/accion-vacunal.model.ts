import type {
  DatosNoVacunacionDTO,
  DatosProgramacionDTO,
  DatosVacunacionDTO,
} from '../adapter/api/dto/accion-vacunal.dto';

export interface AccionVacunal {
  domainId?: number;

  tipoAccionVacunal: 'VACUNACION' | 'NO_VACUNACION' | 'PROGRAMACION';

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

  datosVacunacion?: DatosVacunacionDTO;
  datosNoVacunacion?: DatosNoVacunacionDTO;
  datosProgramacion?: DatosProgramacionDTO;
}
