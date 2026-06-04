export const MF_TAG_NAME = 'vacunas-ficha-vacunal-mf';

export const MF_EVENT_LOADED =
  'vacunas-ficha-vacunal-mf:loaded';

export const MF_EVENT_ERROR =
  'vacunas-ficha-vacunal-mf:error';

export const MF_EVENT_CARD_SELECTED =
  'vacunas-ficha-vacunal-mf:card-selected';

export type { VacunasFichaVacunalRuntimeConfig as RuntimeConfig } from '../config/runtime-config';

export type MfLoadedEventDetail = {
  nuhsa: string;
};

export type MfErrorEventDetail = {
  code: string;
  message: string;
};

export type MfCardSelectedEventDetail = {
  nuhsa: string;
  accionVacunalId?: string;
  productoInmunizacionAlias?: string;
  situacionEnum?: string;
};