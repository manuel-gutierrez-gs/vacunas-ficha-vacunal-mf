import { VacunasFichaVacunalMfError } from '@shared/errors/mf-error';

export async function httpGetJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });
  } catch (cause) {
    throw new VacunasFichaVacunalMfError('NETWORK_ERROR', `Error de red al consultar ${url}: ${String(cause)}`);
  }

  if (!response.ok) {
    throw new VacunasFichaVacunalMfError(
      'NETWORK_ERROR',
      `HTTP ${response.status} al consultar ${url}`
    );
  }

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new VacunasFichaVacunalMfError('MAPPING_ERROR', `Respuesta JSON inválida: ${String(cause)}`);
  }
}
