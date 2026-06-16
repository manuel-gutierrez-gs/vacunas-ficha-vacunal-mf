import type { VacunasFichaVacunalRuntimeConfig } from '../config/runtime-config';

export interface PacienteContext {
  nuhsa: string;
  runtimeConfig?: VacunasFichaVacunalRuntimeConfig;
}

export type PacienteContextCallback = (context: PacienteContext) => void;

export const MF_EVENT_PACIENTE_CONTEXT_REQUEST = 'vacunas-ficha-vacunal:paciente-context-request';

export class PacienteContextRequestEvent extends Event {
  public readonly callback: PacienteContextCallback;
  public readonly subscribe: boolean;
  public unsubscribe?: () => void;

  constructor(callback: PacienteContextCallback, subscribe: boolean = false) {
    super(MF_EVENT_PACIENTE_CONTEXT_REQUEST, { bubbles: true, composed: true });
    this.callback = callback;
    this.subscribe = subscribe;
  }
}
