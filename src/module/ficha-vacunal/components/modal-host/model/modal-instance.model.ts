export interface VacunasModalInstance {
  id: string;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  slotKey: string;
  props?: Record<string, any>;
}
