import { expect, fixture, html } from '@open-wc/testing';
import type { VacunasModalOpenEventData } from '@module/ficha-vacunal/components/alergia-button/event/alergia-button-modal-open.event';
import { VacunasModalOpenEvent } from '@module/ficha-vacunal/components/alergia-button/event/alergia-button-modal-open.event';
import { VacunasModalCloseEvent } from '@module/ficha-vacunal/components/modal/event/modal-close.event';
import '@module/ficha-vacunal/components/modal-host/modal-host.view';
import type { VacunasModalHostView } from '@module/ficha-vacunal/components/modal-host/modal-host.view';
import { VacunasModalHostViewModel } from '@module/ficha-vacunal/components/modal-host/modal-host.viewmodel';
import type { VacunasModalInstance } from '@module/ficha-vacunal/components/modal-host/model/modal-instance.model';

type ModalHostTestAPI = {
  modal: VacunasModalInstance | null;
  isResetting: boolean;
  _nuhsa: string;
  handleContextChange: (ctx: { nuhsa: string }) => void;
  safeCloseModalOnContextChange: () => void;
};

const getApi = (el: VacunasModalHostView) => el as unknown as ModalHostTestAPI;

describe('modal-host branches', () => {
  let el: VacunasModalHostView;

  beforeEach(async () => {
    el = await fixture<VacunasModalHostView>(html`<vacunas-modal-host></vacunas-modal-host>`);
  });

  afterEach(() => {
    el.remove();
  });

  it('connectedCallback assigns instance', () => {
    expect(VacunasModalHostViewModel.instance).to.equal(el);
  });

  it('disconnectedCallback removes instance', () => {
    el.disconnectedCallback();
    expect(VacunasModalHostViewModel.instance).to.be.null;
  });

  it('handleOpenEvent ignores if isResetting', () => {
    const api = getApi(el);

    api.isResetting = true;

    const ev = new VacunasModalOpenEvent({
      id: '1',
      title: 'T',
      size: 'md',
      slotKey: 'ficha',
      props: {},
    });

    document.dispatchEvent(ev);

    expect(api.modal).to.be.null;
  });

  it('handleOpenEvent ignores if missing slotKey', () => {
    const ev = new VacunasModalOpenEvent({
      id: '1',
      title: 'T',
      size: 'md',
      props: {},
    } as VacunasModalOpenEventData);

    document.dispatchEvent(ev);

    const api = getApi(el);
    expect(api.modal).to.be.null;
  });

  it('handleOpenEvent assigns modal', () => {
    const ev = new VacunasModalOpenEvent({
      id: '1',
      title: 'T',
      size: 'md',
      slotKey: 'ficha',
      props: {},
    });

    document.dispatchEvent(ev);

    const api = getApi(el);
    expect(api.modal?.id).to.equal('1');
  });

  it('handleCloseEvent ignores if isResetting', () => {
    const api = getApi(el);

    api.modal = { id: '1', slotKey: 'test' };

    api.isResetting = true;

    document.dispatchEvent(new VacunasModalCloseEvent({ id: '1' }));

    expect(api.modal).to.not.be.null;
  });

  it('handleCloseEvent ignores if modal is null or id mismatch', () => {
    const api = getApi(el);

    api.modal = { id: '2', slotKey: 'test' };

    document.dispatchEvent(new VacunasModalCloseEvent({ id: '1' }));

    expect(api.modal.id).to.equal('2');
  });

  it('handleCloseEvent closes if id matches', () => {
    const api = getApi(el);

    api.modal = { id: '1', slotKey: 'test' };

    document.dispatchEvent(new VacunasModalCloseEvent({ id: '1' }));

    expect(api.modal).to.be.null;
  });

  it('handleContextChange ignores if nuhsa is same', () => {
    const api = getApi(el);

    api._nuhsa = '123';

    api.handleContextChange({ nuhsa: '123' });

    expect(api._nuhsa).to.equal('123');
  });

  it('handleContextChange closes and resets if nuhsa is different', async () => {
    const api = getApi(el);

    api._nuhsa = '123';
    api.modal = { id: '1', slotKey: 'test' };

    api.handleContextChange({ nuhsa: '456' });

    expect(api._nuhsa).to.equal('456');
    expect(api.modal).to.be.null;
    expect(api.isResetting).to.be.true;

    await new Promise(r => requestAnimationFrame(r));

    expect(api.isResetting).to.be.false;
  });

  it('safeCloseModalOnContextChange ignores if already resetting or no modal', () => {
    const api = getApi(el);

    api.isResetting = false;
    api.modal = null;

    api.safeCloseModalOnContextChange();

    expect(api.isResetting).to.be.false;
  });
});
