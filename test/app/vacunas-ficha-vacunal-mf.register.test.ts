import { expect } from '@open-wc/testing';
import { MF_TAG_NAME } from '@shared/contract/vacunas-ficha-vacunal.contract';
import {
  defineVacunasFichaVacunalMfElement,
  VacunasFichaVacunalMfViewModel,
} from '../../src/app/vacunas-ficha-vacunal-mf.viewmodel';

describe('vacunas-ficha-vacunal-mf register', () => {
  it('registra el custom element una sola vez', () => {
    defineVacunasFichaVacunalMfElement();
    defineVacunasFichaVacunalMfElement();

    const ctor = customElements.get(MF_TAG_NAME);
    expect(ctor).to.equal(VacunasFichaVacunalMfViewModel);
  });
});
