import type { FichaVacunalAggregate } from '@module/ficha-vacunal/model/ficha-vacunal-aggregate.model';
import type { VacunasFichaVacunalMfErrorCode } from '@shared/errors/mf-error';

export type PublicElementStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PublicElementErrorState {
  code: VacunasFichaVacunalMfErrorCode;
  message: string;
}

export interface PublicElementReadyState {
  aggregate: FichaVacunalAggregate;
  seleccion: string[];
}
