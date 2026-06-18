import { expect, fixture, html } from '@open-wc/testing';
import '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/alergias-contraindicaciones.view';
import type { AlergiasContraindicacionesModalView } from '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/alergias-contraindicaciones.view';
import { AlergiasContraindicacionesCache } from '@module/ficha-vacunal/cache/alergias-contraindicaciones.cache';
import { createMockConfig } from '../../../../../helpers/mock-data';
import type { GenericDataRowImpl, HeaderRowImpl } from '@sas/wc-stic-table';
import type { RegistroAlergiaContraindicacion } from '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/model/mode-alergias-contraindicaciones.model';
import type { PacienteContext } from '@shared/context/paciente-context';

type TestAPI = Omit<AlergiasContraindicacionesModalView, never> & {
  errorMessage: string;
  isLoading: boolean;
  listadoAlergiasInicial: unknown[];
  selectedTab: string;

  _contextNuhsa: string;

  runtimeConfig: ReturnType<typeof createMockConfig>;

  _handleSegmentClick: (ev: CustomEvent) => void;
  getHeaderRow: () => HeaderRowImpl;
  getDataRow: () => GenericDataRowImpl<RegistroAlergiaContraindicacion>;
  loadData: (nuhsa: string) => Promise<void>;
  handleContextChange: (context: PacienteContext) => void;
};

const asApi = (el: AlergiasContraindicacionesModalView) => el as unknown as TestAPI;

describe('alergias-contraindicaciones branches', () => {
  let el: AlergiasContraindicacionesModalView;
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ alergias: [], listaContraindic: [] }), {
        status: 200,
      })) as unknown as typeof fetch;

    el = await fixture<AlergiasContraindicacionesModalView>(
      html`<vacunas-alergias-contraindicaciones-modal></vacunas-alergias-contraindicaciones-modal>`
    );

    const api = asApi(el);
    api.runtimeConfig = createMockConfig();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    AlergiasContraindicacionesCache.clear();
    el.remove();
  });

  it('ignores if nuhsa from context is empty', async () => {
    const api = asApi(el);

    api._contextNuhsa = 'old';

    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response();
    }) as unknown as typeof fetch;

    api.handleContextChange({ nuhsa: '', runtimeConfig: api.runtimeConfig });
    await el.updateComplete;

    expect(called).to.be.false;
  });

  it('ignores if nuhsa from context is same as loaded', async () => {
    const api = asApi(el);

    api._contextNuhsa = '123';

    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response();
    }) as unknown as typeof fetch;

    api.handleContextChange({ nuhsa: '123', runtimeConfig: api.runtimeConfig });
    await el.updateComplete;

    expect(called).to.be.false;
  });

  it('calls loadData if nuhsa from context changed', async () => {
    const api = asApi(el);

    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response('{}', { status: 200 });
    }) as unknown as typeof fetch;

    api.handleContextChange({ nuhsa: '123', runtimeConfig: api.runtimeConfig });
    await el.updateComplete;

    expect(called).to.be.true;
  });

  it('loadData ignores response if nuhsa changed mid-flight', async () => {
    const api = asApi(el);

    let resolve1: (v: Response) => void;
    let callCount = 0;

    globalThis.fetch = () => {
      callCount++;
      return new Promise<Response>(r => {
        if (callCount === 1) resolve1 = r;
      });
    };

    api.handleContextChange({ nuhsa: '123', runtimeConfig: api.runtimeConfig });
    await el.updateComplete;

    api.handleContextChange({ nuhsa: '456', runtimeConfig: api.runtimeConfig });
    await el.updateComplete;

    resolve1!(
      new Response(
        JSON.stringify({
          alergias: [{ descripcion: 'A', fechaDeteccion: '2020-01-01' }],
        }),
        { status: 200 }
      )
    );

    await new Promise(r => setTimeout(r, 10));
  });

  it('loadData sets errorMessage on catch', async () => {
    const api = asApi(el);

    globalThis.fetch = (async () => {
      throw new Error('fail');
    }) as unknown as typeof fetch;

    api.handleContextChange({ nuhsa: '123', runtimeConfig: api.runtimeConfig });
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 10));

    expect(api.errorMessage).to.not.be.empty;
  });

  it('loadData aborts if nuhsa changed mid-flight', async () => {
    const api = asApi(el);

    let reject1: (e: Error) => void;
    let callCount = 0;

    globalThis.fetch = () => {
      callCount++;
      return new Promise((_, r) => {
        if (callCount === 1) reject1 = r;
      });
    };

    const p = api.loadData('123');

    await new Promise(r => setTimeout(r, 0));

    api.handleContextChange({ nuhsa: '456', runtimeConfig: api.runtimeConfig });

    reject1!(new Error('fail'));

    await p.catch(() => {});

    expect(api.errorMessage).to.equal('');
  });

  it('handleSegmentClick ignores if not activated', () => {
    const api = asApi(el);

    api._handleSegmentClick(
      new CustomEvent('click', {
        detail: { id: 'contraindicaciones', isActivated: false },
      })
    );

    expect(api.selectedTab).to.equal('alergias');
  });

  it('handleSegmentClick ignores if unknown id', () => {
    const api = asApi(el);

    api._handleSegmentClick(
      new CustomEvent('click', {
        detail: { id: 'unknown', isActivated: true },
      })
    );

    expect(api.selectedTab).to.equal('alergias');
  });

  it('handleSegmentClick handles contraindicaciones', async () => {
    const api = asApi(el);

    api._handleSegmentClick(
      new CustomEvent('click', {
        detail: { id: 'contraindicaciones', isActivated: true },
      })
    );

    await el.updateComplete;

    expect(api.selectedTab).to.equal('contraindicaciones');
    expect(el.shadowRoot?.innerHTML).to.include('contraindicaciones encontradas');
  });

  it('view render loading state', async () => {
    el.isLoading = true;
    el.listadoAlergiasInicial = [];

    await el.updateComplete;

    expect(el.shadowRoot?.innerHTML).to.include('Cargando informaci');
  });

  it('view render error state', async () => {
    el.errorMessage = 'error';

    await el.updateComplete;

    expect(el.shadowRoot?.innerHTML).to.include('error');
  });

  it('view render empty data row', () => {
    const api = asApi(el);

    api.selectedTab = 'contraindicaciones';

    const hr = api.getHeaderRow();

    expect(hr.cell[0].cellDetail.data).to.equal('CONTRAINDICACIÓN');
  });

  it('view render dataRow property accessors', () => {
    const api = asApi(el);

    const dr = api.getDataRow();

    const mockData = {
      nombre: 'N',
      nivelCerteza: 'C',
      fechaRegistro: 'F',
    };

    expect(dr.cell[0].cellDetail.cellPropertyExpression(mockData)).to.equal('N');
    expect(dr.cell[1].cellDetail.cellPropertyExpression(mockData)).to.equal('C');
    expect(dr.cell[2].cellDetail.cellPropertyExpression(mockData)).to.equal('F');
  });
});
