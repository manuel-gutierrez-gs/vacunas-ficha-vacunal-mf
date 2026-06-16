import {
  loadRuntimeConfig,
  type VacunasFichaVacunalRuntimeConfig,
} from '@shared/config/runtime-config';

export async function bootstrapVacunasFichaVacunalMf(): Promise<VacunasFichaVacunalRuntimeConfig> {
  return loadRuntimeConfig();
}
