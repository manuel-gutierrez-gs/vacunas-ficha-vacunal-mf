import type { AccionVacunal } from '../model/accion-vacunal.model';

export function getNombreProfesional(profesional: AccionVacunal['profesional']): string {
  if (!profesional?.nombre || !profesional?.primerApellido || !profesional?.segundoApellido) {
    return '';
  }

  return [profesional.nombre, profesional.primerApellido, profesional.segundoApellido]
    .map(capitalize)
    .join(' ');
}

export function capitalize(text: string): string {
  if (!text) return '';

  return text
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
