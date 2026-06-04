import { expect, oneEvent } from '@open-wc/testing';
import { resetRuntimeConfigCache } from '@shared/config/runtime-config';
import { MF_EVENT_LOADED, MF_TAG_NAME } from '@shared/contract/vacunas-ficha-vacunal.contract';
import {
  defineVacunasFichaVacunalMfElement,
  VacunasFichaVacunalMfViewModel,
} from '../../src/app/vacunas-ficha-vacunal-mf.viewmodel';
import { createMockConfig } from '../helpers/mock-data';

describe('vacunas-ficha-vacunal-mf mvp flow', () => {
  const originalFetch = globalThis.fetch;

  before(() => {
    defineVacunasFichaVacunalMfElement();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    resetRuntimeConfigCache();
    document.body.querySelectorAll(MF_TAG_NAME).forEach(el => el.remove());
  });

  it('renderiza en DOM y pasa a estado ready', async () => {
    const config = createMockConfig();
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/configuracion-pacientes')) {
        return new Response(
          JSON.stringify({
            domainId: 1,
            nuhsaPaciente: 'NUHSA001',
            calendariosAsignados: [{ domainId: 101, nombre: 'Calendario infantil' }],
          }),
          { status: 200 }
        );
      }
      if (url.includes('/ficha-vacunal/')) {
        return new Response(
          JSON.stringify({
            domainId: '11',
            resumenPaciente: { nombre: 'ANA', apellidos: 'PEREZ', nuhsa: 'NUHSA001' },
            franjasEdad: [{ edad: { numero: 2, unidad: 'ANOS' }, inmunizaciones: [] }],
          }),
          { status: 200 }
        );
      }
      throw new Error(`Unexpected fetch: ${url}`);
    }) as typeof fetch;

    const el = document.createElement(MF_TAG_NAME) as VacunasFichaVacunalMfViewModel;
    el.nuhsa = 'NUHSA001';
    el.runtimeConfig = config;
    document.body.appendChild(el);
    await oneEvent(el, MF_EVENT_LOADED);

    expect(el.status).to.equal('ready');
    expect(el.readyState).to.exist;
  });

});
