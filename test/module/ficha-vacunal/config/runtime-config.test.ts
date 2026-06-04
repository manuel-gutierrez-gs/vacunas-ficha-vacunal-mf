import { expect } from '@open-wc/testing';
import {
  loadRuntimeConfig,
  resetRuntimeConfigCache,
  resolveRuntimeConfig,
  RUNTIME_CONFIG_URL,
  validateRuntimeConfig,
} from '@shared/config/runtime-config';
import { VacunasFichaVacunalMfError } from '@shared/errors/mf-error';
import { createMockConfig } from '../../../helpers/mock-data';

describe('vacunas-ficha-vacunal-mf config', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    resetRuntimeConfigCache();
  });

  it('carga runtime config desde JSON externo', async () => {
    const expected = createMockConfig();
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      if (String(input) === RUNTIME_CONFIG_URL) {
        return new Response(JSON.stringify(expected), { status: 200 });
      }
      throw new Error(`Unexpected fetch: ${String(input)}`);
    }) as typeof fetch;

    const result = await loadRuntimeConfig();

    expect(result).to.deep.equal(expected);
    expect(resolveRuntimeConfig()).to.deep.equal(expected);
  });

  it('lanza CONFIG_MISSING si el fetch falla', async () => {
    globalThis.fetch = (async () => {
      throw new Error('network');
    }) as typeof fetch;

    try {
      await loadRuntimeConfig();
      expect.fail('Se esperaba CONFIG_MISSING');
    } catch (error) {
      expect(error).to.have.property('code', 'CONFIG_MISSING');
    }
  });

  it('lanza CONFIG_INVALID si faltan URLs obligatorias', () => {
    try {
      validateRuntimeConfig({ urlApiFichaVacunal: '' });
      expect.fail('Se esperaba CONFIG_INVALID');
    } catch (error) {
      expect(error).to.be.instanceOf(VacunasFichaVacunalMfError);
      expect((error as VacunasFichaVacunalMfError).code).to.equal('CONFIG_INVALID');
    }
  });
});
