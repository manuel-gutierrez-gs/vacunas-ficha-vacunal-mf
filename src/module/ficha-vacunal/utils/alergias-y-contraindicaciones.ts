import {
  EstadoAlergiaContraindicacion,
  TipoAlergiaContraindicacion,
} from '../model/alergias-y-contraindicaciones.model';

export function estadoAlergiaContraindicacionToTexto(
  estado: EstadoAlergiaContraindicacion | string | undefined
): string {
  switch (estado) {
    case EstadoAlergiaContraindicacion.PROPUESTA:
      return 'Sospecha';

    case EstadoAlergiaContraindicacion.ACEPTADA:
      return 'Confirmada';

    case EstadoAlergiaContraindicacion.RECHAZADA:
      return 'Rechazada';

    default:
      return 'Desconocido';
  }
}

export function tipoAlergiaContraindicacionToTexto(
  tipo: TipoAlergiaContraindicacion | string | undefined
): string {
  switch (tipo) {
    case TipoAlergiaContraindicacion.PRINCIPIO_ACTIVO:
      return 'Principio activo';

    case TipoAlergiaContraindicacion.MEDICAMENTO:
      return 'Medicamento';

    default:
      return '';
  }
}

export function formatearFechaAlergiasYContraindicaciones(fecha: string): string {
  const fechaLimpia = fecha.replace('[UTC]', '');

  const date = new Date(fechaLimpia);

  const dia = String(date.getUTCDate()).padStart(2, '0');

  const mes = String(date.getUTCMonth() + 1).padStart(2, '0');

  const anio = date.getUTCFullYear();

  return `${dia}/${mes}/${anio}`;
}
