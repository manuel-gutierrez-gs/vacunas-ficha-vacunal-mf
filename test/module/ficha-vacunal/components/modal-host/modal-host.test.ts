import { expect, fixture, html } from '@open-wc/testing';
import { VacunasModalOpenEvent } from '@module/ficha-vacunal/components/alergia-button/event/alergia-button-modal-open.event';
import { VacunasModalCloseEvent } from '@module/ficha-vacunal/components/modal/event/modal-close.event';
import { PacienteContextRequestEvent } from '@shared/context/paciente-context';
import '@module/ficha-vacunal/components/modal-host/modal-host.view';
import { VacunasModalHostView } from '@module/ficha-vacunal/components/modal-host/modal-host.view';
import { VacunasModalHostViewModel } from '@module/ficha-vacunal/components/modal-host/modal-host.viewmodel';

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
    (el as any).isResetting = true;
    const ev = new VacunasModalOpenEvent({ id: '1', title: 'T', size: 'md', slotKey: 'ficha', props: {} });
    document.dispatchEvent(ev);
    expect((el as any).modal).to.be.null;
  });

  it('handleOpenEvent ignores if missing slotKey', () => {
    const ev = new VacunasModalOpenEvent({ id: '1', title: 'T', size: 'md', props: {} } as any);
    document.dispatchEvent(ev);
    expect((el as any).modal).to.be.null;
  });

  it('handleOpenEvent assigns modal', () => {
    const ev = new VacunasModalOpenEvent({ id: '1', title: 'T', size: 'md', slotKey: 'ficha', props: {} });
    document.dispatchEvent(ev);
    expect((el as any).modal.id).to.equal('1');
  });

  it('handleCloseEvent ignores if isResetting', () => {
    (el as any).modal = { id: '1' };
    (el as any).isResetting = true;
    document.dispatchEvent(new VacunasModalCloseEvent({ id: '1' }));
    expect((el as any).modal).to.not.be.null;
  });

  it('handleCloseEvent ignores if modal is null or id mismatch', () => {
    (el as any).modal = { id: '2' };
    document.dispatchEvent(new VacunasModalCloseEvent({ id: '1' }));
    expect((el as any).modal.id).to.equal('2');
  });

  it('handleCloseEvent closes if id matches', () => {
    (el as any).modal = { id: '1' };
    document.dispatchEvent(new VacunasModalCloseEvent({ id: '1' }));
    expect((el as any).modal).to.be.null;
  });

  it('handleContextChange ignores if nuhsa is same', () => {
    (el as any)._nuhsa = '123';
    (el as any).handleContextChange({ nuhsa: '123' });
    // Nothing happens, safeClose is not called
  });

  it('handleContextChange closes and resets if nuhsa is different', async () => {
    (el as any)._nuhsa = '123';
    (el as any).modal = { id: '1' };
    (el as any).handleContextChange({ nuhsa: '456' });
    expect((el as any)._nuhsa).to.equal('456');
    expect((el as any).modal).to.be.null;
    expect((el as any).isResetting).to.be.true;

    // wait for requestAnimationFrame
    await new Promise(r => requestAnimationFrame(r));
    expect((el as any).isResetting).to.be.false;
  });

  it('safeCloseModalOnContextChange ignores if already resetting or no modal', () => {
    (el as any).isResetting = false;
    (el as any).modal = null;
    (el as any).safeCloseModalOnContextChange();
    expect((el as any).isResetting).to.be.false;
  });
});
