import { expect } from '@open-wc/testing';
import { loadFichaVacunalAggregate } from '@module/ficha-vacunal/service/ficha-vacunal.service';
import { createMockConfig } from '../../../helpers/mock-data';
import { fichaVacunalCache } from '@module/ficha-vacunal/cache/ficha-vacunal.cache';
import { configuracionPacienteCache } from '@module/ficha-vacunal/cache/configuracion-paciente.cache';

describe('service layer', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    fichaVacunalCache.clear();
    configuracionPacienteCache.clear();
  });

  it('combina configuración + ficha vacunal', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('configuracion')) {
        return new Response(
          JSON.stringify({
            domainId: 1,
            nuhsaPaciente: 'NUHSA001',
            calendariosAsignados: [],
          }),
          { status: 200 }
        );
      }

      if (url.includes('ficha-vacunal')) {
        return new Response(
          JSON.stringify({
            domainId: '11',
            resumenPaciente: {
              nombre: 'ANA',
              apellidos: 'PEREZ',
              nuhsa: 'NUHSA001',
            },
            franjasEdad: [],
          }),
          { status: 200 }
        );
      }

      throw new Error('Unexpected fetch');
    }) as typeof fetch;

    const result = await loadFichaVacunalAggregate('NUHSA001', createMockConfig());

    expect(result).to.exist;
    expect(result.resumenPaciente.nuhsa).to.equal('NUHSA001');
  });

  it('propaga error de red', async () => {
    globalThis.fetch = (async () => {
      throw new Error('network');
    }) as typeof fetch;

    let error: unknown = null;

    try {
      await loadFichaVacunalAggregate('NUHSA001', createMockConfig());
    } catch (e) {
      error = e;
    }

    expect(error).to.exist;
    expect(String((error as Error).message)).to.contain('network');
  });
});
