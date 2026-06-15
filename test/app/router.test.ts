import { expect } from '@open-wc/testing';
import { MF_TAG_NAME } from '@shared/contract/vacunas-ficha-vacunal.contract';
import '../../src/index';

describe('router layer', () => {
  it('registra el custom element del MF', () => {
    expect(customElements.get(MF_TAG_NAME)).to.exist;
  });

  it('instancia el router correctamente', () => {
    const el = document.createElement(MF_TAG_NAME);

    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal(MF_TAG_NAME);
  });
});
