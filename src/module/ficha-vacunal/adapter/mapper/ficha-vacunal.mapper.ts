import { VacunasFichaVacunalMfError } from '@shared/errors/mf-error';
import type {
  Edad,
  FichaVacunalData,
  Inmunizacion,
  SituacionEnum,
} from '../../model/ficha-vacunal.model';

export function mapFichaVacunalResponse(data: unknown): FichaVacunalData {
  try {
    const raw = data as Record<string, unknown>;
    const resumen = raw.resumenPaciente as Record<string, unknown>;
    const franjas = raw.franjasEdad as unknown[];

    if (!resumen || !Array.isArray(franjas)) {
      throw new Error('invalid shape');
    }

    return {
      domainId: String(raw.domainId ?? ''),
      resumenPaciente: {
        apellidos: resumen.apellidos as string | undefined,
        nombre: resumen.nombre as string | undefined,
        sexo: resumen.sexo as string | undefined,
        nuhsa: resumen.nuhsa as string | undefined,
        fechaNacimiento: resumen.fechaNacimiento as string | undefined,
        edad: resumen.edad as FichaVacunalData['resumenPaciente']['edad'],
      },
      franjasEdad: franjas.map((franja: unknown) => {
        const f = franja as Record<string, unknown>;
        const edad = f.edad as Record<string, unknown>;
        const inmunizaciones = (f.inmunizaciones as unknown[]) ?? [];
        return {
          edad: {
            numero: Number(edad?.numero ?? 0),
            unidad: (edad?.unidad ?? 'ANOS') as Edad['unidad'],
          },
          inmunizaciones: inmunizaciones.map((inmu: unknown) => mapInmunizacion(inmu)),
        };
      }),
    };
  } catch (cause) {
    throw new VacunasFichaVacunalMfError(
      'MAPPING_ERROR',
      `Error al mapear ficha vacunal: ${String(cause)}`
    );
  }
}

function mapInmunizacion(data: unknown): Inmunizacion {
  const inmu = data as Record<string, unknown>;
  const loc = inmu.localizacion as Record<string, string> | undefined;
  const producto = inmu.productoInmunizacion as Record<string, string>;

  return {
    administradaPorEntePrivado: Boolean(inmu.administradaPorEntePrivado),
    calendario: inmu.calendario != null ? String(inmu.calendario) : undefined,
    comentarios: inmu.comentarios as string | undefined,
    documentada: Boolean(inmu.documentada),
    efectosAdversosRegistrados: Boolean(inmu.efectosAdversosRegistrados),
    fecha: String(inmu.fecha ?? ''),
    localizacion: loc ? { codigo: loc.codigo, denominacion: loc.denominacion } : undefined,
    negacionDePaciente: Boolean(inmu.negacionDePaciente),
    productoInmunizacion: {
      alias: producto?.alias ?? '',
      codigoSnomedCT: producto?.codigoSnomedCT,
    },
    situacion: inmu.situacion as SituacionEnum,
    accionVacunalId: inmu.accionVacunalId != null ? String(inmu.accionVacunalId) : undefined,
    detalleSituacion: inmu.detalleSituacion as string | undefined,
  };
}
