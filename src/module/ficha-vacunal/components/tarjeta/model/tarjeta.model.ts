import { SituacionEnum } from '../../../model/ficha-vacunal.model';

export interface TarjetaIcon {
  value: string;
  icon: string | { name: string; path: string; viewbox: string };
}

export const SITUACION_TAG_MAP: Partial<Record<SituacionEnum, { color: string; icon: string }>> = {
  [SituacionEnum.ADMINISTRADA]: { color: 'green', icon: 'check_circle' },
  [SituacionEnum.ATRASADA]: { color: 'orange', icon: 'warning' },
  [SituacionEnum.EXCLUIDA]: { color: 'red', icon: 'error' },
  [SituacionEnum.FUERA_PLAZO]: { color: 'red', icon: 'error' },
  [SituacionEnum.NO_ADMINISTRADA]: { color: 'red', icon: 'error' },
  [SituacionEnum.PENDIENTE_EN_PLAZO]: { color: 'orange', icon: 'warning' },
  [SituacionEnum.PENDIENTE_AUN_NO_EN_PLAZO]: { color: 'orange', icon: 'warning' },
  [SituacionEnum.PROGRAMADA]: { color: 'orange', icon: 'schedule' },
};

export interface TagItem {
  value: string;
  text: string;
  icon: string;
  color: string;
}
