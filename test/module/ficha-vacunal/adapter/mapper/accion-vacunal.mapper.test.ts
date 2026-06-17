import { expect } from '@open-wc/testing';
import { mapAccionVacunalResponse } from '@module/ficha-vacunal/adapter/mapper/accion-vacunal.mapper';
import type {
  AccionVacunalDTO,
  DatosNoVacunacionDTO,
  DatosProgramacionDTO,
  LocalizacionDTO,
  ProductoInmunizacionDTO,
  ProfesionalDTO,
} from '@module/ficha-vacunal/adapter/api/dto/accion-vacunal.dto';
import type { AccionVacunal } from '@module/ficha-vacunal/model/accion-vacunal.model';

describe('accion-vacunal.mapper', () => {
  it('should map VACUNACION type correctly', () => {
    const input: AccionVacunalDTO = {
      domainId: 123,
      fechaAccion: '2024-01-01',
      tipoAccionVacunal: 'VACUNACION',
      profesional: {} as ProfesionalDTO,
      localizacion: {} as LocalizacionDTO,
      paciente: {},
      productoInmunizacion: {} as ProductoInmunizacionDTO,
      datosVacunacion: { fechaVacunacion: '2024-01-01' },
    };

    const result = mapAccionVacunalResponse(input);
    expect(result.tipoAccionVacunal).to.equal('VACUNACION');
    expect(result.domainId).to.equal(123);
    expect((result as AccionVacunal).datosVacunacion).to.deep.equal({
      fechaVacunacion: '2024-01-01',
    });
  });

  it('should map NO_VACUNACION type correctly', () => {
    const input: AccionVacunalDTO = {
      domainId: 456,
      fechaAccion: '2024-01-01',
      tipoAccionVacunal: 'NO_VACUNACION',
      profesional: {} as ProfesionalDTO,
      localizacion: {} as LocalizacionDTO,
      paciente: {},
      productoInmunizacion: {} as ProductoInmunizacionDTO,
      datosNoVacunacion: { motivo: 'Rechazo' } as DatosNoVacunacionDTO,
    };
    const result = mapAccionVacunalResponse(input);
    expect(result.tipoAccionVacunal).to.equal('NO_VACUNACION');
    expect((result as AccionVacunal).datosNoVacunacion).to.deep.equal({ motivo: 'Rechazo' });
  });

  it('should map PROGRAMACION type correctly', () => {
    const input: AccionVacunalDTO = {
      domainId: 789,
      fechaAccion: '2024-01-01',
      tipoAccionVacunal: 'PROGRAMACION',
      profesional: {} as ProfesionalDTO,
      localizacion: {} as LocalizacionDTO,
      paciente: {},
      productoInmunizacion: {} as ProductoInmunizacionDTO,
      datosProgramacion: { idCentro: '1' } as DatosProgramacionDTO,
    };
    const result = mapAccionVacunalResponse(input);
    expect(result.tipoAccionVacunal).to.equal('PROGRAMACION');
    expect((result as AccionVacunal).datosProgramacion).to.deep.equal({ idCentro: '1' });
  });
});
