import { expect } from '@open-wc/testing';
import { MF_TAG_NAME } from '@shared/contract/vacunas-ficha-vacunal.contract';
import { VacunasFichaVacunalHomeViewModel } from '../../src/app/vacunas-ficha-vacunal-home.viewmodel';
import '../../src/app/vacunas-ficha-vacunal-mf.view';

describe('vacunas-ficha-vacunal-mf register', () => {
  it('registra el custom element una sola vez', () => {
    const ctor = customElements.get(MF_TAG_NAME);
    expect(ctor).to.equal(VacunasFichaVacunalHomeViewModel);
  });
});
