/** Heutiges Referenzdatum der App (fix, damit die Demo-Fälligkeiten stabil bleiben). */
export const HEUTE = new Date('2026-06-23T00:00:00');

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatEuroMio(value: number): string {
  const mio = value / 1_000_000;
  return `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(mio)} Mio €`;
}

export function formatProzent(value: number | null): string {
  if (value === null) return '–';
  return `${new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} %`;
}

export function formatDatum(iso: string | null): string {
  if (!iso) return '–';
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/** Differenz in vollen Tagen: deadline - heute. Negativ = überfällig. */
export function tageBis(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  const ms = d.getTime() - HEUTE.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function langDatum(d: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
