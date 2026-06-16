import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';

export type VacunasFichaVacunalHost = HTMLElement & {
  nuhsa?: string;
  runtimeConfig?: VacunasFichaVacunalRuntimeConfig;
  getAttribute(name: string): string | null;
};
