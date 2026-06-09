import { expect, oneEvent } from '@open-wc/testing';
import { resetRuntimeConfigCache, RUNTIME_CONFIG_URL } from '@shared/config/runtime-config';
import { MF_EVENT_ERROR, MF_TAG_NAME } from '@shared/contract/vacunas-ficha-vacunal.contract';
import { VacunasFichaVacunalMfViewModel } from '../../src/app/vacunas-ficha-vacunal-mf.viewmodel';
import '../../src/app/vacunas-ficha-vacunal-mf.view';
import { createMockConfig } from '../helpers/mock-data';

describe('vacunas-ficha-vacunal-mf errors', () => {
  const originalFetch = globalThis.fetch;

  before(() => {
    // Component is already defined via import
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    resetRuntimeConfigCache();
    document.body.querySelectorAll(MF_TAG_NAME).forEach(el => el.remove());
  });

  it('asigna errorState con NUHSA_MISSING cuando falta atributo', async () => {
    globalThis.fetch = (async () => new Response('{}', { status: 200 })) as typeof fetch;

    const el = document.createElement(MF_TAG_NAME) as VacunasFichaVacunalMfViewModel;
    el.runtimeConfig = createMockConfig();
    document.body.appendChild(el);
    const event = (await oneEvent(el, MF_EVENT_ERROR)) as CustomEvent<{ code: string; message: string }>;

    expect(event.detail.code).to.equal('NUHSA_MISSING');
    expect(el.status).to.equal('error');
    expect(el.errorState?.code).to.equal('NUHSA_MISSING');
  });

  it('asigna errorState con CONFIG_MISSING cuando no hay runtime config cargado', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      if (String(input) === RUNTIME_CONFIG_URL) {
        return new Response('not found', { status: 404 });
      }
      return new Response('{}', { status: 200 });
    }) as typeof fetch;

    const el = document.createElement(MF_TAG_NAME) as VacunasFichaVacunalMfViewModel;
    el.nuhsa = 'NUHSA001';
    document.body.appendChild(el);
    const event = (await oneEvent(el, MF_EVENT_ERROR)) as CustomEvent<{ code: string; message: string }>;

    expect(event.detail.code).to.equal('CONFIG_MISSING');
    expect(el.status).to.equal('error');
    expect(el.errorState?.code).to.equal('CONFIG_MISSING');
  });
});
