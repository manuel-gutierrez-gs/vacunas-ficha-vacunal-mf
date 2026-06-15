export interface AlergiasContraindicacionesResponse {
  alergias: Alergia[];
  listaContraindic: Contraindicacion[];
  errorConsultaHis: boolean;
}

export interface AlergiaContraindicacionBase {
  identifUnico: string;
  descripcion: string;
  codigo?: string;
  fechaDeteccion: string;
  estado: EstadoAlergiaContraindicacion;
  tipo?: TipoAlergiaContraindicacion;
  infoPropuesta?: InfoAlergiaContraindicacion;
}

export interface Alergia extends AlergiaContraindicacionBase {}

export interface Contraindicacion extends AlergiaContraindicacionBase {
  total: boolean;
}

export interface InfoAlergiaContraindicacion {
  fecha?: string;
  apellido1Oper?: string;
  apellido2Oper?: string;
  nombreOperador?: string;
  codigoOperador?: string;
  codigoCentro?: string;
  motivo?: string;
}

export enum TipoAlergiaContraindicacion {
  PRINCIPIO_ACTIVO = 'PRINCIPIO_ACTIVO',
  MEDICAMENTO = 'MEDICAMENTO',
}

export enum EstadoAlergiaContraindicacion {
  PROPUESTA = 'PROPUESTA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
}
