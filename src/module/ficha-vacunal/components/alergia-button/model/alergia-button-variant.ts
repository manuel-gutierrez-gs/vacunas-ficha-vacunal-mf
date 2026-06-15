export type VacunasAlergiaButtonVariant =
  | 'loading'
  | 'no-allergies'
  | 'verify'
  | 'has-allergies'
  | 'technical-error';

export interface VacunasAlergiaButtonVariantConfig {
  icon: string;
  filled: boolean;
  color: string;
  tooltip: string;
}

export const VARIANT_CONFIG: Record<
  VacunasAlergiaButtonVariant,
  VacunasAlergiaButtonVariantConfig
> = {
  'no-allergies': {
    icon: 'check_circle',
    filled: true,
    color: '#018465',
    tooltip: 'Sin alergias ni contraindicaciones conocidas',
  },
  verify: {
    icon: 'error',
    filled: true,
    color: '#D06400',
    tooltip: 'No hay alergias y/o contraindicaciones registradas. Verifique con el paciente.',
  },
  'has-allergies': {
    icon: 'do_not_disturb_on',
    filled: true,
    color: '#B71C1C',
    tooltip: 'Presenta alergias y/o contraindicaciones',
  },
  'technical-error': {
    icon: 'cancel',
    filled: true,
    color: '#828282',
    tooltip: 'Ha habido un error en la carga de datos',
  },
  loading: {
    icon: 'sync',
    filled: true,
    color: '',
    tooltip: '',
  },
};
