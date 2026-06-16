import type { VacunasFichaVacunalRuntimeConfig } from '../../src/shared/config/runtime-config';
import type { FichaVacunalAggregate } from '../../src/module/ficha-vacunal/model/ficha-vacunal-aggregate.model';
import { SituacionEnum } from '../../src/module/ficha-vacunal/model/ficha-vacunal.model';

export function createMockConfig(
  overrides: Partial<VacunasFichaVacunalRuntimeConfig> = {}
): VacunasFichaVacunalRuntimeConfig {
  return {
    urlApiFichaVacunal: 'https://mock.local/ficha',
    urlApiConfigPacientes: 'https://mock.local/config',
    urlApiConfigAccionVacunal: 'https://mock.local/acciones',
    urlApiConfigCalendarios: 'https://mock.local/calendarios',
    urlApiAlergiasYContraindicacionesS039: 'http://mock-url',
    ...overrides,
  };
}

export function createMockAggregate(
  overrides: Partial<FichaVacunalAggregate> = {}
): FichaVacunalAggregate {
  return {
    resumenPaciente: {
      apellidos: 'PEREZ',
      nombre: 'ANA',
      sexo: '1',
      nuhsa: 'ANATEST',
      fechaNacimiento: '2000-01-01',
      edad: { numero: 25, unidad: 'ANOS' },
    },
    franjasEdad: [
      {
        edad: { numero: 12, unidad: 'MESES' },
        inmunizaciones: [
          {
            administradaPorEntePrivado: false,
            calendario: '101',
            comentarios: 'sin incidencias',
            documentada: true,
            efectosAdversosRegistrados: false,
            fecha: '2024-01-10',
            localizacion: { codigo: '11001', denominacion: 'Sevilla' },
            negacionDePaciente: false,
            productoInmunizacion: { alias: 'Triple Vírica', codigoSnomedCT: '12345' },
            situacion: SituacionEnum.ADMINISTRADA,
            accionVacunalId: 'acc-1',
          },
          {
            administradaPorEntePrivado: false,
            documentada: false,
            efectosAdversosRegistrados: false,
            fecha: '',
            negacionDePaciente: false,
            productoInmunizacion: { alias: 'Vacuna aislada' },
            situacion: SituacionEnum.PENDIENTE_EN_PLAZO,
          },
        ],
      },
    ],
    calendariosAsignados: [
      { domainId: '101', nombre: 'Calendario infantil' },
      { domainId: '202', nombre: 'Calendario adulto' },
    ],
    filterSet: [
      {
        idFilter: 'filter-aislada',
        filterChipType: 'filter-chip-select',
        label: 'Vacunaciones aisladas',
        value: 'aislada',
        dataSource: [{ value: 'aislada', displayName: 'Vacunaciones aisladas' }],
        visible: true,
      },
      {
        idFilter: 'filter-calendario-v-101',
        filterChipType: 'filter-chip-select',
        label: 'Calendario infantil',
        value: '101',
        dataSource: [{ value: '101', displayName: 'Calendario infantil' }],
        visible: true,
      },
    ],
    seleccionInicial: ['aislada', '101', '202'],
    ...overrides,
  };
}
