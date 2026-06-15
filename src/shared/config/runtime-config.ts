import { VacunasFichaVacunalMfError } from '../errors/mf-error';

export interface VacunasFichaVacunalRuntimeConfig {
  urlApiFichaVacunal: string;
  urlApiConfigPacientes: string;
  urlApiConfigAccionVacunal: string;
  urlApiConfigCalendarios: string;
  urlApiAlergiasYContraindicacionesS039: string;
}

export const RUNTIME_CONFIG_URL = '/config/config-maps.json';

let cachedConfig: VacunasFichaVacunalRuntimeConfig | null = null;
let loadPromise: Promise<VacunasFichaVacunalRuntimeConfig> | null = null;

export function validateRuntimeConfig(config: unknown): VacunasFichaVacunalRuntimeConfig {
  if (!config || typeof config !== 'object') {
    throw new VacunasFichaVacunalMfError('CONFIG_INVALID', 'Configuración runtime inválida');
  }
  const c = config as Record<string, unknown>;
  const urlApiFichaVacunal = c.urlApiFichaVacunal;
  const urlApiConfigPacientes = c.urlApiConfigPacientes;
  const urlApiConfigAccionVacunal = c.urlApiConfigAccionVacunal;
  const urlApiConfigCalendarios = c.urlApiConfigCalendarios;
  const urlApiAlergiasYContraindicacionesS039 = c.urlApiAlergiasYContraindicacionesS039;

  if (typeof urlApiFichaVacunal !== 'string' || !urlApiFichaVacunal.trim()) {
    throw new VacunasFichaVacunalMfError('CONFIG_INVALID', 'urlApiFichaVacunal es obligatorio');
  }

  if (typeof urlApiConfigPacientes !== 'string' || !urlApiConfigPacientes.trim()) {
    throw new VacunasFichaVacunalMfError('CONFIG_INVALID', 'urlApiConfigPacientes es obligatorio');
  }

  if (typeof urlApiConfigAccionVacunal !== 'string' || !urlApiConfigAccionVacunal.trim()) {
    throw new VacunasFichaVacunalMfError(
      'CONFIG_INVALID',
      'urlApiConfigAccionVacunal es obligatorio'
    );
  }

  if (typeof urlApiConfigCalendarios !== 'string' || !urlApiConfigCalendarios.trim()) {
    throw new VacunasFichaVacunalMfError(
      'CONFIG_INVALID',
      'urlApiConfigCalendarios es obligatorio'
    );
  }

  if (
    typeof urlApiAlergiasYContraindicacionesS039 !== 'string' ||
    !urlApiAlergiasYContraindicacionesS039.trim()
  ) {
    throw new VacunasFichaVacunalMfError(
      'CONFIG_INVALID',
      'urlApiAlergiasYContraindicacionesS039 es obligatorio'
    );
  }

  return {
    urlApiFichaVacunal: urlApiFichaVacunal.trim(),
    urlApiConfigPacientes: urlApiConfigPacientes.trim(),
    urlApiConfigAccionVacunal: urlApiConfigAccionVacunal.trim(),
    urlApiConfigCalendarios: urlApiConfigCalendarios.trim(),
    urlApiAlergiasYContraindicacionesS039: urlApiAlergiasYContraindicacionesS039.trim(),
  };
}

export async function loadRuntimeConfig(): Promise<VacunasFichaVacunalRuntimeConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  if (!loadPromise) {
    loadPromise = fetchRuntimeConfig();
  }

  return loadPromise;
}

async function fetchRuntimeConfig(): Promise<VacunasFichaVacunalRuntimeConfig> {
  try {
    const response = await fetch(RUNTIME_CONFIG_URL, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new VacunasFichaVacunalMfError(
        'CONFIG_MISSING',
        `No se pudo cargar la configuración runtime (${response.status})`
      );
    }

    const raw = await response.json();
    cachedConfig = validateRuntimeConfig(raw);
    return cachedConfig;
  } catch (error) {
    if (error instanceof VacunasFichaVacunalMfError) {
      throw error;
    }
    throw new VacunasFichaVacunalMfError(
      'CONFIG_MISSING',
      `No se pudo cargar la configuración runtime desde ${RUNTIME_CONFIG_URL}`
    );
  }
}

export function resolveRuntimeConfig(
  override?: VacunasFichaVacunalRuntimeConfig
): VacunasFichaVacunalRuntimeConfig {
  if (override) {
    return validateRuntimeConfig(override);
  }

  if (!cachedConfig) {
    throw new VacunasFichaVacunalMfError(
      'CONFIG_MISSING',
      'Configuración runtime no disponible. Ejecute loadRuntimeConfig() antes de inicializar el microfrontend.'
    );
  }

  return cachedConfig;
}

export function resetRuntimeConfigCache(): void {
  cachedConfig = null;
  loadPromise = null;
}
