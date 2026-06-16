import { expect, oneEvent } from '@open-wc/testing';
import { resetRuntimeConfigCache } from '@shared/config/runtime-config';
import { MF_EVENT_LOADED, MF_EVENT_ERROR } from '@shared/contract/vacunas-ficha-vacunal.contract';

import { createMockConfig } from '../../../helpers/mock-data';
import '../../../../src/app/vacunas-ficha-vacunal-home.view';

const flush = async () => {
  await Promise.resolve();
  await new Promise(requestAnimationFrame);
};

describe('home layer', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    resetRuntimeConfigCache();
    document.body.innerHTML = '';
  });

  it('carga correctamente y emite ready', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/configuracion-pacientes')) {
        return new Response(
          JSON.stringify({
            domainId: 1,
            nuhsaPaciente: 'NUHSA001',
            calendariosAsignados: [],
          }),
          { status: 200 }
        );
      }

      if (url.includes('/ficha-vacunal/')) {
        return new Response(
          JSON.stringify({
            domainId: '11',
            resumenPaciente: { nuhsa: 'NUHSA001' },
            franjasEdad: [],
          }),
          { status: 200 }
        );
      }

      return new Response('{}', { status: 200 });
    }) as typeof fetch;

    const el = document.createElement('vacunas-ficha-vacunal-home');

    el.nuhsa = 'NUHSA001';
    el.runtimeConfig = createMockConfig();

    document.body.appendChild(el);

    await oneEvent(el, MF_EVENT_LOADED);
    await flush();

    expect(el.status).to.equal('ready');
    expect(el.readyState).to.exist;
  });

  it('error NUHSA_MISSING', async () => {
    const el = document.createElement('vacunas-ficha-vacunal-home');

    el.runtimeConfig = createMockConfig();

    document.body.appendChild(el);

    const event = await oneEvent(el, MF_EVENT_ERROR);

    expect(event.detail.code).to.equal('NUHSA_MISSING');
    expect(el.status).to.equal('error');
  });

  it('error CONFIG_MISSING', async () => {
    globalThis.fetch = (async () => {
      return new Response('not found', { status: 404 });
    }) as typeof fetch;

    const el = document.createElement('vacunas-ficha-vacunal-home');

    el.nuhsa = 'NUHSA001';

    document.body.appendChild(el);

    const event = await oneEvent(el, MF_EVENT_ERROR);

    expect(event.detail.code).to.equal('CONFIG_MISSING');
    expect(el.status).to.equal('error');
  });
});
