import { expect, fixture, html } from '@open-wc/testing';
import '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/alergias-contraindicaciones.view';
import type { AlergiasContraindicacionesModalView } from '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/alergias-contraindicaciones.view';
import { AlergiasContraindicacionesCache } from '@module/ficha-vacunal/cache/alergias-contraindicaciones.cache';
import { createMockConfig } from '../../../../../helpers/mock-data';
import type { GenericDataRowImpl, HeaderRowImpl } from '@sas/wc-stic-table';
import type { RegistroAlergiaContraindicacion } from '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/model/mode-alergias-contraindicaciones.model';

type TestAPI = Omit<AlergiasContraindicacionesModalView, never> & {
  nuhsa: string;
  errorMessage: string;
  isLoading: boolean;
  listadoAlergiasInicial: unknown[];
  selectedTab: string;

  _loadedNuhsa: string;

  runtimeConfig: ReturnType<typeof createMockConfig>;

  _handleSegmentClick: (ev: CustomEvent) => void;
  getHeaderRow: () => HeaderRowImpl;
  getDataRow: () => GenericDataRowImpl<RegistroAlergiaContraindicacion>;
  loadData: (nuhsa: string) => Promise<void>;
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

  it('updated ignores if nuhsa is empty', async () => {
    const api = asApi(el);

    api._loadedNuhsa = 'old';

    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response();
    }) as unknown as typeof fetch;

    api.nuhsa = '';
    el.requestUpdate();
    await el.updateComplete;

    expect(called).to.be.false;
  });

  it('updated ignores if nuhsa is same as loaded', async () => {
    const api = asApi(el);

    api._loadedNuhsa = '123';
    api.nuhsa = '123';

    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response();
    }) as unknown as typeof fetch;

    el.requestUpdate();
    await el.updateComplete;

    expect(called).to.be.false;
  });

  it('updated calls loadData if nuhsa changed', async () => {
    const api = asApi(el);

    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response('{}', { status: 200 });
    }) as unknown as typeof fetch;

    api.nuhsa = '123';
    await el.updateComplete;

    expect(called).to.be.true;
  });

  it('loadData ignores response if nuhsa changed mid-flight', async () => {
    const api = asApi(el);

    let resolve: (v: Response) => void;

    globalThis.fetch = () =>
      new Promise<Response>(r => {
        resolve = r;
      });

    api.nuhsa = '123';
    await el.updateComplete;

    api.nuhsa = '456';
    await el.updateComplete;

    resolve!(
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

    api.nuhsa = '123';
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 10));

    expect(api.errorMessage).to.not.be.empty;
  });

  it('loadData aborts if nuhsa changed mid-flight', async () => {
    const api = asApi(el);

    let reject: (e: Error) => void;

    globalThis.fetch = () =>
      new Promise((_, r) => {
        reject = r;
      });

    const p = api.loadData('123');

    await new Promise(r => setTimeout(r, 0));

    api.nuhsa = '456';

    reject!(new Error('fail'));

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
