import type { CalendarioResponse } from '../adapter/api/calendario.api';

class CalendarioCache {
  private cache = new Map<string, Promise<CalendarioResponse> | CalendarioResponse>();

  get(id: string): Promise<CalendarioResponse> | CalendarioResponse | undefined {
    return this.cache.get(id);
  }

  set(id: string, value: Promise<CalendarioResponse> | CalendarioResponse): void {
    this.cache.set(id, value);
  }

  has(id: string): boolean {
    return this.cache.has(id);
  }

  clear(id: string): void {
    this.cache.delete(id);
  }
}

export const calendarioCache = new CalendarioCache();
