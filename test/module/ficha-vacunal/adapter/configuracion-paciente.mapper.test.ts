import { expect } from '@open-wc/testing';
import { mapConfiguracionPacienteResponse } from '@module/ficha-vacunal/adapter/mapper/configuracion-paciente.mapper';

describe('configuracion-paciente.mapper', () => {
  it('mapea calendarios asignados y normaliza valores', () => {
    const mapped = mapConfiguracionPacienteResponse({
      domainId: '2',
      nuhsaPaciente: 445566,
      calendariosAsignados: [{ domainId: 101, nombre: 'Calendario infantil' }],
    });

    expect(mapped.domainId).to.equal(2);
    expect(mapped.nuhsaPaciente).to.equal('445566');
    expect(mapped.calendariosAsignados).to.deep.equal([
      { domainId: '101', nombre: 'Calendario infantil' },
    ]);
  });

  it('devuelve calendarios vacíos si no vienen en la respuesta', () => {
    const mapped = mapConfiguracionPacienteResponse({
      domainId: 1,
      nuhsaPaciente: 'AABB',
    });

    expect(mapped.calendariosAsignados).to.deep.equal([]);
  });
});
