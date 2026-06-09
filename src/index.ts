import './routing/vacunas-ficha-vacunal-router.view';
import {
  MF_EVENT_CARD_SELECTED,
  MF_EVENT_ERROR,
  MF_EVENT_LOADED,
  MF_TAG_NAME,
  type MfCardSelectedEventDetail,
  type MfErrorEventDetail,
  type MfLoadedEventDetail,
  type RuntimeConfig,
} from '@shared/contract/vacunas-ficha-vacunal.contract';

export { MF_TAG_NAME, MF_EVENT_LOADED, MF_EVENT_ERROR, MF_EVENT_CARD_SELECTED };
export type { RuntimeConfig, MfLoadedEventDetail, MfErrorEventDetail, MfCardSelectedEventDetail };
