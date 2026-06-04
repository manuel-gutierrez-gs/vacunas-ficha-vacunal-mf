export interface Edad {
  numero: number;
  unidad: 'ANOS' | 'MESES' | 'SEMANAS' | 'DIAS';
}

export interface Localizacion {
  codigo: string;
  denominacion: string;
}

export interface ProductoInmunizacion {
  alias: string;
  codigoSnomedCT?: string;
}

export enum SituacionEnum {
  ADMINISTRADA = 'ADMINISTRADA',
  ATRASADA = 'ATRASADA',
  FUERA_PLAZO = 'FUERA_PLAZO',
  EXCLUIDA = 'EXCLUIDA',
  NO_ADMINISTRADA = 'NO_ADMINISTRADA',
  PENDIENTE_EN_PLAZO = 'PENDIENTE_EN_PLAZO',
  PENDIENTE_AUN_NO_EN_PLAZO = 'PENDIENTE_AUN_NO_EN_PLAZO',
  PENDIENTE_PRIMERA_DOSIS = 'PENDIENTE_PRIMERA_DOSIS',
  PROGRAMADA = 'PROGRAMADA',
}

export enum SexoEnum {
  Hombre = '0',
  Mujer = '1',
  Indeterminado = '2',
}

export interface Inmunizacion {
  administradaPorEntePrivado: boolean;
  calendario?: string;
  comentarios?: string;
  documentada: boolean;
  efectosAdversosRegistrados: boolean;
  fecha: string;
  localizacion?: Localizacion;
  negacionDePaciente: boolean;
  productoInmunizacion: ProductoInmunizacion;
  situacion: SituacionEnum;
  detalleSituacion?: string;
  accionVacunalId?: string;
}

export interface FranjaEdad {
  edad: Edad;
  inmunizaciones: Inmunizacion[];
}

export interface ResumenPaciente {
  apellidos?: string;
  nombre?: string;
  sexo?: string;
  nuhsa?: string;
  fechaNacimiento?: string;
  edad?: Edad;
}

export interface FichaVacunalData {
  domainId: string;
  franjasEdad: FranjaEdad[];
  resumenPaciente: ResumenPaciente;
}

export function sexoToTexto(sexo: string | undefined): string {
  switch (sexo) {
    case SexoEnum.Hombre:
      return 'Hombre';
    case SexoEnum.Mujer:
      return 'Mujer';
    case SexoEnum.Indeterminado:
      return 'Indeterminado';
    default:
      return 'Desconocido';
  }
}

export function unidadEdadToTexto(unidad: Edad['unidad'] | undefined): string {
  switch (unidad) {
    case 'ANOS':
      return 'años';
    case 'MESES':
      return 'meses';
    case 'SEMANAS':
      return 'semanas';
    case 'DIAS':
      return 'días';
    default:
      return '';
  }
}

export function situacionToTexto(situacion: string | undefined): string {
  switch (situacion) {
    case SituacionEnum.ADMINISTRADA:
      return 'Administrada';
    case SituacionEnum.ATRASADA:
      return 'Atrasada';
    case SituacionEnum.EXCLUIDA:
      return 'Excluida';
    case SituacionEnum.FUERA_PLAZO:
      return 'Fuera de plazo';
    case SituacionEnum.NO_ADMINISTRADA:
      return 'No Administrada';
    case SituacionEnum.PENDIENTE_EN_PLAZO:
      return 'Pendiente en plazo';
    case SituacionEnum.PENDIENTE_AUN_NO_EN_PLAZO:
      return 'Pendiente aun no en plazo';
    case SituacionEnum.PENDIENTE_PRIMERA_DOSIS:
      return 'Pendiente primera dosis';
    case SituacionEnum.PROGRAMADA:
      return 'Programada';
    default:
      return 'Desconocido';
  }
}
