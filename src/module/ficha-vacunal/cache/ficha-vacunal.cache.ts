import type { FichaVacunalData } from '@module/ficha-vacunal/model/ficha-vacunal.model';

class FichaVacunalCache {
  private cache = new Map<string, Promise<FichaVacunalData> | FichaVacunalData>();

  get(nuhsa: string): Promise<FichaVacunalData> | FichaVacunalData | undefined {
    return this.cache.get(nuhsa);
  }

  set(nuhsa: string, value: Promise<FichaVacunalData> | FichaVacunalData): void {
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

export const fichaVacunalCache = new FichaVacunalCache();
