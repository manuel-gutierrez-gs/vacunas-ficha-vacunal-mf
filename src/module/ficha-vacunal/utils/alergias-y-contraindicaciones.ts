import { html } from 'lit';

export function formatearFechaAlergiasYContraindicaciones(fecha: string): string {
  const fechaLimpia = fecha.replace('[UTC]', '');

  const date = new Date(fechaLimpia);

  const dia = String(date.getUTCDate()).padStart(2, '0');

  const mes = String(date.getUTCMonth() + 1).padStart(2, '0');

  const anio = date.getUTCFullYear();

  return `${dia}/${mes}/${anio}`;
}

export function renderNivelCertezaTag(nivel: string) {
  switch (nivel) {
    case 'ACEPTADA':
      return html`<stic-tag text="Confirmada" color="green" hideIcon></stic-tag>`;

    case 'RECHAZADA':
      return html`<stic-tag text="Rechazada" color="red" hideIcon></stic-tag>`;

    case 'PROPUESTA':
      return html`<stic-tag text="Sospecha" color="yellow" hideIcon></stic-tag>`;

    default:
      return '';
  }
}
