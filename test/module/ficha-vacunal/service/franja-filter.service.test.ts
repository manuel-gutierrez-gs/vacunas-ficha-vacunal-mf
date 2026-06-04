import { expect } from '@open-wc/testing';
import { SituacionEnum, type FranjaEdad } from '@module/ficha-vacunal/model/ficha-vacunal.model';
import { filterFranjasBySeleccion } from '@module/ficha-vacunal/service/franja-filter.service';

describe('franja-filter.service', () => {
  const franjasEdad: FranjaEdad[] = [
    {
      edad: { numero: 2, unidad: 'ANOS' },
      inmunizaciones: [
        {
          administradaPorEntePrivado: false,
          calendario: '101',
          documentada: true,
          efectosAdversosRegistrados: false,
          fecha: '2025-01-10',
          negacionDePaciente: false,
          productoInmunizacion: { alias: 'Vacuna A' },
          situacion: SituacionEnum.ADMINISTRADA,
        },
        {
          administradaPorEntePrivado: false,
          documentada: false,
          efectosAdversosRegistrados: false,
          fecha: '',
          negacionDePaciente: false,
          productoInmunizacion: { alias: 'Vacuna aislada' },
          situacion: SituacionEnum.PENDIENTE_EN_PLAZO,
        },
      ],
    },
  ];

  it('filtra por calendario seleccionado y mantiene aisladas', () => {
    const filtered = filterFranjasBySeleccion(franjasEdad, ['101', 'aislada']);
    expect(filtered).to.have.length(1);
    expect(filtered[0].inmunizaciones).to.have.length(2);
  });

  it('elimina franjas sin inmunizaciones tras filtrar', () => {
    const filtered = filterFranjasBySeleccion(franjasEdad, ['999']);
    expect(filtered).to.deep.equal([]);
  });
});
