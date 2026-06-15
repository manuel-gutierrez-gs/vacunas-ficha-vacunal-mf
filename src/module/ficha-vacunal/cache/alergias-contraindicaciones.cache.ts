import type { AlergiasContraindicacionesResponse } from '@module/ficha-vacunal/model/alergias-y-contraindicaciones.model';

type CacheValue = Promise<AlergiasContraindicacionesResponse> | AlergiasContraindicacionesResponse;

const cache = new Map<string, CacheValue>();

export const AlergiasContraindicacionesCache = {
  get(nuhsa: string): CacheValue | undefined {
    return cache.get(nuhsa);
  },
  set(nuhsa: string, value: CacheValue): void {
    cache.set(nuhsa, value);
  },
  has(nuhsa: string): boolean {
    return cache.has(nuhsa);
  },
  clear(nuhsa?: string): void {
    if (nuhsa) {
      cache.delete(nuhsa);
    } else {
      cache.clear();
    }
  },
};
