import { expect } from '@open-wc/testing';
import { mapAccionVacunalResponse } from '@module/ficha-vacunal/adapter/mapper/accion-vacunal.mapper';
import type { AccionVacunalDTO } from '@module/ficha-vacunal/adapter/api/dto/accion-vacunal.dto';

describe('accion-vacunal.mapper', () => {
  it('should map VACUNACION type correctly', () => {
    const input: AccionVacunalDTO = {
      domainId: '123',
      fechaAccion: '2024-01-01',
      tipoAccionVacunal: 'VACUNACION',
      datosVacunacion: { fechaVacunacion: '2024-01-01' } as any,
    };
    const result = mapAccionVacunalResponse(input);
    expect(result.tipoAccionVacunal).to.equal('VACUNACION');
    expect(result.domainId).to.equal('123');
    expect((result as any).datosVacunacion).to.deep.equal({ fechaVacunacion: '2024-01-01' });
  });

  it('should map NO_VACUNACION type correctly', () => {
    const input: AccionVacunalDTO = {
      domainId: '456',
      tipoAccionVacunal: 'NO_VACUNACION',
      datosNoVacunacion: { motivo: 'Rechazo' } as any,
    };
    const result = mapAccionVacunalResponse(input);
    expect(result.tipoAccionVacunal).to.equal('NO_VACUNACION');
    expect((result as any).datosNoVacunacion).to.deep.equal({ motivo: 'Rechazo' });
  });

  it('should map PROGRAMACION type correctly', () => {
    const input: AccionVacunalDTO = {
      domainId: '789',
      tipoAccionVacunal: 'PROGRAMACION',
      datosProgramacion: { idCentro: '1' } as any,
    };
    const result = mapAccionVacunalResponse(input);
    expect(result.tipoAccionVacunal).to.equal('PROGRAMACION');
    expect((result as any).datosProgramacion).to.deep.equal({ idCentro: '1' });
  });

  it('should throw error for unknown type', () => {
    const input = {
      tipoAccionVacunal: 'UNKNOWN',
    } as any;
    expect(() => mapAccionVacunalResponse(input)).to.throw('Tipo desconocido: UNKNOWN');
  });
});
