import { html } from 'lit';
import type { AccionVacunalUI } from '../../model/accion-vacunal-ui.model';
import { formatDate } from '../../utils/date.utils';
import { getNombreProfesional, capitalize } from '../../utils/string.utils';
import type { ReaccionAdversaDTO } from '../api/dto/reaccion-adversa.dto';

type SheetModeInput = AccionVacunalUI['detalleFichaVacunalSeleccionada'];

export interface SheetItem {
  id: string;
  data: {
    headline: string;
    supportingText?: unknown;
    trailingSupportingText?: string | null;
  };
}

export interface SheetModel {
  datosSuperiores: SheetItem[];
  reacciones: SheetItem[];
}

type SheetMode =
  | 'ADMINISTRADA'
  | 'ADMINISTRADA_DOCUMENTADA'
  | 'ADMINISTRADA_DOCUMENTADA_PRIVADA'
  | 'ADMINISTRADA_PRIVADA'
  | 'EXCLUIDA'
  | 'NEGACION';

export function mapAccionVacunalToSheetModel(accion: AccionVacunalUI | null): SheetModel {
  if (!accion) {
    return { datosSuperiores: [], reacciones: [] };
  }

  const d = accion.detalleAccionVacunal;

  const mode = resolveMode(accion.detalleFichaVacunalSeleccionada);

  const datosSuperiores: SheetItem[] = [];

  datosSuperiores.push({
    id: 'calendario',
    data: {
      headline: 'Calendario',
      supportingText:
        accion.calendarioNombre || html`<stic-tag text="Aislada" color="grey"></stic-tag>`,
    },
  });

  datosSuperiores.push({
    id: 'accion',
    data: {
      headline: 'Acción',
      supportingText: capitalize(d.tipoAccionVacunal) ?? 'Sin especificar',
    },
  });

  datosSuperiores.push({
    id: 'profesional',
    data: {
      headline: 'Profesional',
      supportingText: getNombreProfesional(d.profesional) || 'Sin profesional asignado',
    },
  });

  datosSuperiores.push({
    id: 'centro',
    data: {
      headline: 'Centro',
      supportingText: d.localizacion?.denominacion ?? 'Sin especificar',
    },
  });

  datosSuperiores.push({
    id: 'fecha_registro',
    data: {
      headline: 'Fecha registro',
      supportingText: formatDate(d.fechaAccion) ?? 'Sin especificar',
    },
  });

  datosSuperiores.push({
    id: 'comentarios',
    data: {
      headline: 'Comentarios',
      supportingText: d.comentarios ?? 'Sin especificar',
    },
  });

  switch (mode) {
    case 'ADMINISTRADA':
      datosSuperiores.push({
        id: 'fecha_admin',
        data: {
          headline: 'Fecha de administración',
          supportingText: formatDate(d.datosVacunacion?.fechaVacunacion),
        },
      });

      datosSuperiores.push({
        id: 'lote',
        data: {
          headline: 'Lote',
          supportingText: d.datosVacunacion?.denominacionLote ?? 'Sin especificar',
        },
      });

      break;

    case 'ADMINISTRADA_DOCUMENTADA':
    case 'ADMINISTRADA_PRIVADA':
    case 'ADMINISTRADA_DOCUMENTADA_PRIVADA':
      datosSuperiores.push({
        id: 'lote',
        data: {
          headline: 'Lote',
          supportingText: d.datosVacunacion?.denominacionLote ?? 'Sin especificar',
        },
      });

      datosSuperiores.push({
        id: 'lugar',
        data: {
          headline: 'Lugar de vacunación',
          supportingText: d.localizacion?.denominacion ?? 'Sin especificar',
        },
      });

      datosSuperiores.push({
        id: 'descripcion',
        data: {
          headline: 'Descripción',
          supportingText: d.descripcion ?? 'Sin especificar',
        },
      });

      break;

    case 'EXCLUIDA':
      //TODO: Esta fecha no viene en los datos de vacunacion
      datosSuperiores.push({
        id: 'fecha_exclusion',
        data: {
          headline: 'Fecha de la exclusión',
          supportingText: formatDate(d.fechaAccion) ?? 'Sin especificar',
        },
      });

      datosSuperiores.push({
        id: 'contraindicacion',
        data: {
          headline: 'Contraindicación',
          supportingText:
            d.datosNoVacunacion?.contraindicacion?.detalleContraindicacion ?? 'Sin especificar',
        },
      });

      datosSuperiores.push({
        id: 'accion_previa',
        data: {
          headline: 'Acción Previa',
          supportingText: accion.accionPreviaNombre ?? 'Sin especificar',
        },
      });

      break;

    case 'NEGACION':
      //TODO: Esta fecha no viene en los datos de vacunacion
      datosSuperiores.push({
        id: 'fecha_negacion',
        data: {
          headline: 'Fecha de la negación',
          supportingText: formatDate(d.fechaAccion) ?? 'Sin especificar',
        },
      });

      datosSuperiores.push({
        id: 'accion_previa',
        data: {
          headline: 'Acción Previa',
          supportingText: accion.accionPreviaNombre ?? 'Sin especificar',
        },
      });

      break;
  }

  return {
    datosSuperiores,
    reacciones:
      d.datosVacunacion?.reaccionesAdversas?.map((item: ReaccionAdversaDTO, index: number) => ({
        id: String(index + 1),
        data: {
          headline: item.nombre,
          trailingSupportingText: item.enlace ? `${item.enlace}` : null,
        },
      })) ?? [],
  };
}

function resolveMode(d: SheetModeInput): SheetMode {
  if (d.negacionDePaciente) return 'NEGACION';

  if (d.situacion === 'EXCLUIDA') return 'EXCLUIDA';

  if (d.administradaPorEntePrivado && d.documentada) {
    return 'ADMINISTRADA_DOCUMENTADA_PRIVADA';
  }

  if (d.administradaPorEntePrivado) {
    return 'ADMINISTRADA_PRIVADA';
  }

  if (d.documentada) {
    return 'ADMINISTRADA_DOCUMENTADA';
  }

  return 'ADMINISTRADA';
}
