export function formatDate(date?: string): string {
  if (!date) return '';
  return date.split('-').reverse().join('/');
}
