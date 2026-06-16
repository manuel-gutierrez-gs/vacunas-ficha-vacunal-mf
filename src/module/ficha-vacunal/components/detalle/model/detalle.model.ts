export const crumbs = [
  { url: '', text: 'Búsqueda de paciente', disabled: false },
  { url: '', text: 'Ficha vacunal', disabled: false },
  { url: '', text: 'prueba', disabled: true },
];

export const itemsLotesSSPA = [
  { displayName: 'Lote SSPA 1', value: 's1' },
  { displayName: 'Lote SSPA 2', value: 's2' },
  { displayName: 'Lote SSPA 3', value: 's3' },
];
export const itemsLotesUsuario = [
  { displayName: 'Lote usuario 1', value: 'u1' },
  { displayName: 'Lote usuario 2', value: 'u2' },
  { displayName: 'Lote usuario 3', value: 'u3' },
];
export const itemsLotesDocumentadosRegistrados = [
  { displayName: 'Lote documentado 1', value: 'ler1' },
  { displayName: 'Lote documentado 2', value: 'ler2' },
  { displayName: 'Lote documentado 3', value: 'ler3' },
];
export const itemsViasAdministracion = [
  { displayName: 'Vía administración 1', value: 'va1' },
  { displayName: 'Vía administración 2', value: 'va2' },
  { displayName: 'Vía administración 3', value: 'va3' },
];
export const itemsDosificaciones = [
  { displayName: 'Dosificación 1', value: 'd1' },
  { displayName: 'Dosificación 2', value: 'd2' },
  { displayName: 'Dosificación 3', value: 'd3' },
];
export const itemsMotivosVacunacion = [
  { displayName: 'Motivo de vacunación 1', value: 'm1' },
  { displayName: 'Motivo de vacunación 2', value: 'm2' },
  { displayName: 'Motivo de vacunación 3', value: 'm3' },
];
export const itemsContraindicaciones = [
  { displayName: 'Contraindicación 1', value: 'c1' },
  { displayName: 'Contraindicación 2', value: 'c2' },
  { displayName: 'Contraindicación 3', value: 'c3' },
];

export type TipoAccion = 'vacunar' | 'documentada' | 'excluir' | 'negacion';

export type LugarVacunacion = 'andalucia' | 'otraCCAA' | 'fueraEspanna';

export type LoteConocido = 'si' | 'no';

export type TipoLoteDocumentado = 'registrado' | 'nuevo';

export type LoteAdquiridoPor = 'sspa' | 'usuario';

export const accionesVacunales = [
  {
    label: 'Vacuna administrada',
    value: 'vacunar',
  },
  {
    label: 'Vacuna documentada',
    value: 'documentada',
  },
  {
    label: 'Excluir',
    value: 'excluir',
  },
  {
    label: 'Negación de usuario',
    value: 'negacion',
  },
];

export const DEFAULT_TIPO_ACCION: TipoAccion = 'vacunar';

export const DEFAULT_LOTE_ADQUIRIDO_POR: LoteAdquiridoPor = 'sspa';

export const DEFAULT_LUGAR_VACUNACION: LugarVacunacion = 'andalucia';

export const DEFAULT_LOTE_CONOCIDO: LoteConocido = 'si';

export const DEFAULT_TIPO_LOTE_DOCUMENTADO: TipoLoteDocumentado = 'registrado';

export interface RouterLocation {
  params?: {
    id?: string;
    situacion?: string;
  };
}

export interface RadioItem {
  checked: boolean;
  value: TipoAccion;
  disabled: boolean;
  label: string;
}

export interface RadioGroupChangeDetail {
  radioItems: RadioItem[];
  group: string;
  valid: boolean;
}
