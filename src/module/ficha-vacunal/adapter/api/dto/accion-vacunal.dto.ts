import type { ReaccionAdversaDTO } from './reaccion-adversa.dto';

export type ProfesionalDTO = {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  codigoOperador: string;
  nif: string;
};

export type LocalizacionDTO = {
  codigo: string;
  denominacion: string;
  tipoLocalizacion: string;
  codigoPostalLocalizacion: string;
};

export type ProductoInmunizacionDTO = {
  codigoSnomedCT: string;
  alias: string;
};

export type DatosVacunacionDTO = {
  idAccionPrevia?: number;
  fechaVacunacion?: string;
  tipoVacunacion?: string;
  motivoVacunacion?: string;
  viaAdministracion?: string;
  dosificacion?: {
    cantidad?: number;
    unidad?: string;
  };
  codigoLote?: string;
  denominacionLote?: string;
  codigoAEMPSMarca?: string;
  denominacionMarca?: string;
  codigoNacionalFormato?: string;
  denominacionFormato?: string;
  codigoLaboratorio?: string;
  denominacionLaboratorio?: string;
  detalles?: string;
  reaccionesAdversasRegistradas?: boolean;
  reaccionesAdversas?: ReaccionAdversaDTO[];
  lugarVacunacion?: string;
};

export type DatosNoVacunacionDTO = {
  idAccionPrevia?: number;
  motivoNoVacunacion?: string;
  detalles?: string;
  contraindicacion?: {
    idContraindicacion?: number;
    detalleContraindicacion?: string;
  };
};

export type DatosProgramacionDTO = {
  fechaProgramacion?: string;
};

export type AccionVacunalDTO = {
  tipoAccionVacunal: 'VACUNACION' | 'NO_VACUNACION' | 'PROGRAMACION';

  profesional: ProfesionalDTO;
  localizacion: LocalizacionDTO;

  paciente: unknown;
  productoInmunizacion: ProductoInmunizacionDTO;

  fechaAccion: string;

  datosNoVacunacion?: DatosNoVacunacionDTO;
  datosProgramacion?: DatosProgramacionDTO;
  datosVacunacion?: DatosVacunacionDTO;

  calendario?: string;
  comentarios?: string;
  descripcion?: string;
  domainId: number;
};
