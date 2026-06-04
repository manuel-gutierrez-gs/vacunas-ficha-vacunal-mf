import { expect } from '@open-wc/testing';
import { loadFichaVacunalAggregate } from '@module/ficha-vacunal/service/ficha-vacunal.service';
import type { VacunasFichaVacunalRuntimeConfig } from '@shared/config/runtime-config';
import { createMockConfig } from '../../../helpers/mock-data';

describe('ficha-vacunal.service', () => {
  const originalFetch = globalThis.fetch;
  const nuhsa = 'NUHSA-TEST-01';
  const config: VacunasFichaVacunalRuntimeConfig = createMockConfig();

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('loadFichaVacunalAggregate combina configuración + ficha en un agregado', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/configuracion-pacientes')) {
        return new Response(
          JSON.stringify({
            domainId: 2,
            nuhsaPaciente: nuhsa,
            calendariosAsignados: [{ domainId: 101, nombre: 'Calendario infantil' }],
          }),
          { status: 200 }
        );
      }
      return new Response(
        JSON.stringify({
          domainId: '77',
          resumenPaciente: { nombre: 'ANA', apellidos: 'PEREZ', nuhsa, sexo: '1' },
          franjasEdad: [{ edad: { numero: 2, unidad: 'ANOS' }, inmunizaciones: [] }],
        }),
        { status: 200 }
      );
    }) as typeof fetch;

    const aggregate = await loadFichaVacunalAggregate(nuhsa, config);

    expect(aggregate.resumenPaciente.nuhsa).to.equal(nuhsa);
    expect(aggregate.calendariosAsignados).to.deep.equal([
      { domainId: '101', nombre: 'Calendario infantil' },
    ]);
    expect(aggregate.filterSet[0].value).to.equal('aislada');
    expect(aggregate.seleccionInicial).to.deep.equal(['aislada', '101']);
  });

  it('propaga error de red sin llamadas reales', async () => {
    globalThis.fetch = (async () => {
      throw new Error('offline');
    }) as typeof fetch;

    try {
      await loadFichaVacunalAggregate(nuhsa, config);
      expect.fail('Se esperaba error de red');
    } catch (error) {
      expect(error).to.have.property('code', 'NETWORK_ERROR');
    }
  });
});
