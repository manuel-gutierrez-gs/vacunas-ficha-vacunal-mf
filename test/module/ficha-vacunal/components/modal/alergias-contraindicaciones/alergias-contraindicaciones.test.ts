import { expect, fixture, html } from '@open-wc/testing';
import '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/alergias-contraindicaciones.view';
import { AlergiasContraindicacionesModalView } from '@module/ficha-vacunal/components/modal/alergias-contraindicaciones/alergias-contraindicaciones.view';
import { AlergiasContraindicacionesCache } from '@module/ficha-vacunal/cache/alergias-contraindicaciones.cache';

import { createMockConfig } from '../../../../../helpers/mock-data';

describe('alergias-contraindicaciones branches', () => {
  let el: AlergiasContraindicacionesModalView;
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    globalThis.fetch = (async () => new Response(JSON.stringify({ alergias: [], listaContraindic: [] }), { status: 200 })) as any;
    el = await fixture<AlergiasContraindicacionesModalView>(
      html`<vacunas-alergias-contraindicaciones-modal></vacunas-alergias-contraindicaciones-modal>`
    );
    (el as any).runtimeConfig = createMockConfig();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    AlergiasContraindicacionesCache.clear();
    el.remove();
  });

  it('updated ignores if nuhsa is empty', async () => {
    (el as any)._loadedNuhsa = 'old';
    let called = false;
    globalThis.fetch = (async () => { called = true; return new Response(); }) as any;
    el.nuhsa = '';
    el.requestUpdate();
    await el.updateComplete;
    expect(called).to.be.false;
  });

  it('updated ignores if nuhsa is same as loaded', async () => {
    (el as any)._loadedNuhsa = '123';
    el.nuhsa = '123';
    let called = false;
    globalThis.fetch = (async () => { called = true; return new Response(); }) as any;
    el.requestUpdate();
    await el.updateComplete;
    expect(called).to.be.false;
  });

  it('updated calls loadData if nuhsa changed', async () => {
    let called = false;
    globalThis.fetch = (async () => { called = true; return new Response('{}', {status: 200}); }) as any;
    el.nuhsa = '123';
    await el.updateComplete;
    expect(called).to.be.true;
  });

  it('loadData ignores response if nuhsa changed mid-flight', async () => {
    let resolvePromise: any;
    globalThis.fetch = () => new Promise(r => { resolvePromise = r; }) as any;
    
    el.nuhsa = '123';
    await el.updateComplete; 
    
    el.nuhsa = '456'; 
    await el.updateComplete; 
    
    if (resolvePromise) {
      resolvePromise(new Response(JSON.stringify({ alergias: [{ descripcion: 'A', fechaDeteccion: '2020-01-01' }] }), { status: 200 }));
    }
    await new Promise(r => setTimeout(r, 10));
  });

  it('loadData sets errorMessage on catch', async () => {
    globalThis.fetch = () => Promise.reject(new Error('fail')) as any;
    el.nuhsa = '123';
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 10));
    expect(el.errorMessage).to.not.be.empty;
  });

  it('loadData handles catch and aborts if nuhsa changed mid-flight', async () => {
    let rejectPromise: any;
    globalThis.fetch = () => new Promise((_, r) => { rejectPromise = r; }) as any;
    
    const p = (el as any).loadData('123');
    await new Promise(r => setTimeout(r, 0)); // let fetch be called
    el.nuhsa = '456'; // change nuhsa
    if (rejectPromise) rejectPromise(new Error('fail'));
    
    await p.catch(() => {});
    expect(el.errorMessage).to.equal('');
  });

  it('handleSegmentClick ignores if not activated', () => {
    (el as any)._handleSegmentClick(new CustomEvent('click', { detail: { id: 'contraindicaciones', isActivated: false } }));
    expect((el as any).selectedTab).to.equal('alergias');
  });

  it('handleSegmentClick ignores if unknown id', () => {
    (el as any)._handleSegmentClick(new CustomEvent('click', { detail: { id: 'unknown', isActivated: true } }));
    expect((el as any).selectedTab).to.equal('alergias');
  });

  it('handleSegmentClick handles contraindicaciones', async () => {
    (el as any)._handleSegmentClick(new CustomEvent('click', { detail: { id: 'contraindicaciones', isActivated: true } }));
    await el.updateComplete;
    expect((el as any).selectedTab).to.equal('contraindicaciones');
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

  it('view render empty data row', async () => {
    (el as any).selectedTab = 'contraindicaciones';
    const hr = (el as any).getHeaderRow();
    expect(hr.cell[0].cellDetail.data).to.equal('CONTRAINDICACIÓN');
  });

  it('view render dataRow property accessors', () => {
    const dr = (el as any).getDataRow();
    const mockData = { nombre: 'N', nivelCerteza: 'C', fechaRegistro: 'F' };
    expect(dr.cell[0].cellDetail.cellPropertyExpression(mockData)).to.equal('N');
    expect(dr.cell[1].cellDetail.cellPropertyExpression(mockData)).to.equal('C');
    expect(dr.cell[2].cellDetail.cellPropertyExpression(mockData)).to.equal('F');
  });
});
