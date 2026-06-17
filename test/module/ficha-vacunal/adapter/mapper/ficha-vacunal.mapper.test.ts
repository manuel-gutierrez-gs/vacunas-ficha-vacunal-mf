import { expect } from '@open-wc/testing';
import { mapFichaVacunalResponse } from '@module/ficha-vacunal/adapter/mapper/ficha-vacunal.mapper';

describe('ficha-vacunal.mapper', () => {
  it('mapea una respuesta válida a dominio', () => {
    const mapped = mapFichaVacunalResponse({
      domainId: 77,
      resumenPaciente: {
        apellidos: 'PEREZ',
        nombre: 'LUIS',
        sexo: '0',
        nuhsa: 'NUHSA001',
        fechaNacimiento: '2019-12-01',
        edad: { numero: 6, unidad: 'ANOS' },
      },
      franjasEdad: [
        {
          edad: { numero: '6', unidad: 'ANOS' },
          inmunizaciones: [
            {
              calendario: 12,
              fecha: '2024-02-20',
              documentada: true,
              administradaPorEntePrivado: false,
              efectosAdversosRegistrados: false,
              negacionDePaciente: false,
              productoInmunizacion: { alias: 'Hexavalente', codigoSnomedCT: '666' },
              localizacion: { codigo: '41001', denominacion: 'Sevilla' },
              situacion: 'ADMINISTRADA',
            },
          ],
        },
      ],
    });

    expect(mapped.domainId).to.equal('77');
    expect(mapped.franjasEdad).to.have.length(1);
    expect(mapped.franjasEdad[0].edad.numero).to.equal(6);
    expect(mapped.franjasEdad[0].inmunizaciones[0].calendario).to.equal('12');
    expect(mapped.franjasEdad[0].inmunizaciones[0].productoInmunizacion.alias).to.equal(
      'Hexavalente'
    );
  });

  it('lanza MAPPING_ERROR cuando la forma es inválida', () => {
    try {
      mapFichaVacunalResponse({ resumenPaciente: null, franjasEdad: null });
      expect.fail('Se esperaba error de mapeo');
    } catch (error) {
      expect(error).to.have.property('code', 'MAPPING_ERROR');
    }
  });
});
