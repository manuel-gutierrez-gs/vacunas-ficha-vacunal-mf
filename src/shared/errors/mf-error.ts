export type VacunasFichaVacunalMfErrorCode =
  | 'NUHSA_MISSING'
  | 'CONFIG_MISSING'
  | 'CONFIG_INVALID'
  | 'NETWORK_ERROR'
  | 'MAPPING_ERROR';

export class VacunasFichaVacunalMfError extends Error {
  readonly code: VacunasFichaVacunalMfErrorCode;

  constructor(code: VacunasFichaVacunalMfErrorCode, message: string) {
    super(message);
    this.name = 'VacunasFichaVacunalMfError';
    this.code = code;
  }
}

export function toMfErrorCode(error: unknown): VacunasFichaVacunalMfErrorCode {
  if (error instanceof VacunasFichaVacunalMfError) {
    return error.code;
  }
  if (error instanceof Error) {
    if (error.message === 'CONFIG_MISSING') return 'CONFIG_MISSING';
    if (error.message === 'CONFIG_INVALID') return 'CONFIG_INVALID';
    if (error.message === 'MAPPING_ERROR') return 'MAPPING_ERROR';
  }
  return 'NETWORK_ERROR';
}

export function toMfErrorMessage(error: unknown): string {
  if (error instanceof VacunasFichaVacunalMfError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
}
