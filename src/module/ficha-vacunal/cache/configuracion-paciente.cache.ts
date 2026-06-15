import type { ConfiguracionPacienteData } from '../model/configuracion-paciente.model';

class ConfiguracionPacienteCache {
  private cache = new Map<string, Promise<ConfiguracionPacienteData> | ConfiguracionPacienteData>();

  get(nuhsa: string): Promise<ConfiguracionPacienteData> | ConfiguracionPacienteData | undefined {
    return this.cache.get(nuhsa);
  }

  set(nuhsa: string, value: Promise<ConfiguracionPacienteData> | ConfiguracionPacienteData): void {
    this.cache.set(nuhsa, value);
  }

  has(nuhsa: string): boolean {
    return this.cache.has(nuhsa);
  }

  clear(nuhsa?: string): void {
    if (nuhsa) {
      this.cache.delete(nuhsa);
    } else {
      this.cache.clear();
    }
  }
}

export const configuracionPacienteCache = new ConfiguracionPacienteCache();
