import { expect } from '@open-wc/testing';
import {
  buildFilterSet,
  buildSeleccionInicial,
} from '@module/ficha-vacunal/service/filter-set.builder';

describe('filter-set.builder', () => {
  const calendarios = [
    { domainId: '101', nombre: 'Calendario infantil' },
    { domainId: '202', nombre: 'Calendario adulto' },
  ];

  it('construye set con filtro aislada y calendarios', () => {
    const filters = buildFilterSet(calendarios);
    expect(filters).to.have.length(3);
    expect(filters[0].value).to.equal('aislada');
    expect(filters[1].idFilter).to.equal('filter-calendario-v-101');
    expect(filters[2].label).to.equal('Calendario adulto');
  });

  it('construye selección inicial incluyendo aislada', () => {
    const seleccion = buildSeleccionInicial(calendarios);
    expect(seleccion).to.deep.equal(['aislada', '101', '202']);
  });
});
