import type { AccionVacunal } from '../model/accion-vacunal.model';

class AccionVacunalCache {
  private cache = new Map<string, Promise<AccionVacunal> | AccionVacunal>();

  get(id: string): Promise<AccionVacunal> | AccionVacunal | undefined {
    return this.cache.get(id);
  }

  set(id: string, value: Promise<AccionVacunal> | AccionVacunal): void {
    this.cache.set(id, value);
  }

  has(id: string): boolean {
    return this.cache.has(id);
  }

  clear(id: string): void {
    this.cache.delete(id);
  }
}

export const accionVacunalCache = new AccionVacunalCache();
