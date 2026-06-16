import type { AlergiasContraindicacionesSlotProps } from '../../alergia-button/model/alergia-button.model';

export interface VacunasModalInstance {
  id: string;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  slotKey: string;
  props?: ModalSlotProps;
}

export type ModalSlotProps = Record<string, unknown>;

export type SlotMap = {
  'alergias-contraindicaciones': AlergiasContraindicacionesSlotProps;
};
