export function cleanPhone(value: string | number | null | undefined): string {
  return String(value || "").replace(/[^0-9]/g, "");
}

export function isValidCameroonPhone(value: string): boolean {
  const phone = cleanPhone(value);

  return phone.length >= 9 && phone.length <= 12;
}