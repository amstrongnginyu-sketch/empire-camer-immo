export function numberOnly(value: string | number | null | undefined): number {
  return Number(String(value || "").replace(/\D/g, "")) || 0;
}

export function formatFCFA(value: string | number | null | undefined): string {
  const number = String(value || "").replace(/\D/g, "");

  if (!number) return "0 FCFA";

  return Number(number).toLocaleString("fr-FR") + " FCFA";
}