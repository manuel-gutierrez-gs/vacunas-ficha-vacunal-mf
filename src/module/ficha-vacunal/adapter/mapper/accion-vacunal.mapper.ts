import type { AccionVacunal } from '../../model/accion-vacunal.model';

export function mapAccionVacunalResponse(data: any): AccionVacunal {

  const base = {
    domainId: data.domainId,
    fechaAccion: data.fechaAccion,
    localizacion: data.localizacion,
    profesional: data.profesional,
    productoInmunizacion: data.productoInmunizacion,
    comentarios: data.comentarios,
    descripcion: data.descripcion,
  };

  switch (data.tipoAccionVacunal) {

    case 'VACUNACION':
      return {
        ...base,
        tipoAccionVacunal: 'VACUNACION',
        calendario: data.calendario,
        datosVacunacion: data.datosVacunacion,
      };

    case 'NO_VACUNACION':
      return {
        ...base,
        tipoAccionVacunal: 'NO_VACUNACION',
        calendario: data.calendario,
        datosNoVacunacion: data.datosNoVacunacion,
      };

    case 'PROGRAMACION':
      return {
        ...base,
        tipoAccionVacunal: 'PROGRAMACION',
        calendario: data.calendario,
        datosProgramacion: data.datosProgramacion,
      };

    default:
      throw new Error(
        `Tipo desconocido: ${data.tipoAccionVacunal}`
      );
  }
}