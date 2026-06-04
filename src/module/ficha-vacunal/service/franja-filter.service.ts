import type { FranjaEdad } from '../model/ficha-vacunal.model';

export function filterFranjasBySeleccion(
  franjasEdad: FranjaEdad[],
  seleccion: string[]
): FranjaEdad[] {
  const seleccionSet = new Set(seleccion);

  return franjasEdad
    .map(franja => {
      const inmunizaciones = franja.inmunizaciones.filter(inmu => {
        const calendarioId = inmu.calendario ?? 'aislada';
        return seleccionSet.has(String(calendarioId));
      });
      return { ...franja, inmunizaciones };
    })
    .filter(franja => franja.inmunizaciones.length > 0);
}
