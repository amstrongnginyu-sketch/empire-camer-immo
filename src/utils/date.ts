export function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString();
}

export function isFutureDate(value?: string | null): boolean {
  if (!value) return false;

  return new Date(value).getTime() > Date.now();
}