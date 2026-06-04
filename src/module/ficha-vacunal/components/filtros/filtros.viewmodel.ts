import {
  CSSResultGroup,
  CSSResultOrNative,
  LitElement,
} from 'lit';
import { property } from 'lit/decorators.js';

import { FiltrosThemeCss } from './css/filtros.css';

import type {
  FilterChipDefinition,
} from '../../model/ficha-vacunal-aggregate.model';

export class FiltrosViewModel extends LitElement {
  static finalizeStyles = (
    styles?: CSSResultGroup
  ): CSSResultOrNative[] => [
    ...super.finalizeStyles(styles),
    ...FiltrosThemeCss.filtrosThemeCss,
  ];

  @property({ attribute: false }) filterSet: FilterChipDefinition[] = [];

  protected onValuesChanged(e: CustomEvent): void {
    const selectedValues = this.parseSelectedValuesFromFiltersArea(
      e.detail
    );

    this.dispatchEvent(
      new CustomEvent('filtros-actualizados', {
        detail: selectedValues,
        bubbles: true,
        composed: true,
      })
    );
  }

  protected onSetDefault(e: CustomEvent): void {
    const defaultValues = this.parseSelectedValuesFromFiltersArea(
      e.detail
    );

    this.dispatchEvent(
      new CustomEvent('filtros-eliminados', {
        detail: defaultValues,
        bubbles: true,
        composed: true,
      })
    );
  }

  protected parseSelectedValuesFromFiltersArea(
    detail: unknown[]
  ): string[] {
    return detail
      .map((filtro: unknown) => {
        const f = filtro as {
          _value?: unknown;
          idFilter?: string;
        };

        const valor = f._value;

        if (Array.isArray(valor)) {
          return valor.map((item: unknown) =>
            this.getDomainIdFromFiltro(
              (item as { idFilter: string }).idFilter
            )
          );
        }

        return this.getDomainIdFromFiltro(f.idFilter ?? '');
      })
      .flat();
  }

  private getDomainIdFromFiltro(input: string): string {
    const parts = input.split('-');
    return parts[parts.length - 1];
  }
}