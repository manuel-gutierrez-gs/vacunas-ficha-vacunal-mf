import { AccionVacunal } from '@module/ficha-vacunal/model/accion-vacunal.model';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class FichaVacunalSheetViewModel extends LitElement {
  @property({ attribute: false }) open = false;
  @property({ type: Object }) accion: any | null = null;
  @property({ type: String }) situacion = '';
  @property({ type: String }) calendarioNombre = '';
  @property({ type: String }) accionVacunalPreviaNombre = '';

  get itemsAccionVacunacion() {
    return this.mapInmunizacionToSheetModel().principal;
  }

  get itemsAccionVacunacionSegundo() {
    return this.mapInmunizacionToSheetModel().secundario;
  }

  get itemsReaccionAdversa() {
    return this.mapInmunizacionToSheetModel().reacciones;
  }

  private mapInmunizacionToSheetModel() {
    if (!this.accion) {
      return {
        principal: [],
        secundario: [],
        reacciones: [],
      };
    }

    return {
      principal: [
        {
          id: '1',
          data: {
            headline: 'Calendario',
            supportingText: this.accion.calendarioNombre ?? html`<stic-tag text="Aislada" color="green"></stic-tag>`,
          },
        },
        {
          id: '2',
          data: {
            headline: 'Acción',
            supportingText: this.capitalize(this.accion.tipoAccionVacunal) ?? 'Sin acción definida',
          },
        },
        {
          id: '3',
          data: {
            headline: 'Fecha Administración',
            supportingText: this.formatDate(this.accion.datosVacunacion.fechaVacunacion),
          },
        },
        {
          id: '4',
          data: {
            headline: 'Fecha registro',
            supportingText: this.formatDate(this.accion.fechaAccion),
          },
        },
        {
          id: '5',
          data: {
            headline: 'Profesional',
            supportingText: this.getNombreProfesional(this.accion.profesional) ?? 'Sin profesional asignado',
          },
        },
        {
          id: '6',
          data: {
            headline: 'Centro',
            supportingText: this.accion.localizacion?.denominacion ?? '',
          },
        },
      ],

      secundario: [
        {
          id: '1',
          data: {
            headline: 'Comentarios',
            supportingText: this.accion.comentarios ?? 'Sin especificar',
          },
        },
      ],

      reacciones: (this.accion.reaccionesAdversas ?? []).map(
        (item: any, index: number) => ({
          id: String(index + 1),
          data: {
            headline: item.nombre,
            trailingSupportingText: item.enlace
              ? `🔗 ${item.enlace}`
              : null,
          },
        })
      ),
    };
  }

  protected formatDate(date?: string): string {
    if (!date) return '';
    return date.split('-').reverse().join('/');
  }

  protected capitalize(word: string): string {
    if (!word) return '';
    word = word.toLocaleLowerCase()
    return String(word).charAt(0).toUpperCase() + String(word).slice(1)
  }

  protected getNombreProfesional(profesional: AccionVacunal["profesional"]): string {
    if (!profesional?.nombre || !profesional?.primerApellido || !profesional?.segundoApellido) return '';
    return `${this.capitalize(profesional.nombre)} ${this.capitalize(profesional.primerApellido)} ${this.capitalize(profesional.segundoApellido)}`
  }
}