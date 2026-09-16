/**
 * Prefijos validos de telefonia movil venezolana (Digitel, Movistar, Movilnet).
 */
export const VENEZUELAN_PHONE_PREFIXES = [
  "0412",
  "0414",
  "0424",
  "0416",
  "0426",
  "0422",
] as const;

/**
 * Limpia y normaliza un numero telefonico venezolano al formato canonico de 11 digitos (04XXXXXXXXX).
 */
export function normalizeVenezuelanPhone(phone: string): string {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("58") && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.length === 10 && !digits.startsWith("0")) {
    digits = `0${digits}`;
  }
  return digits;
}

/**
 * Valida si un numero telefonico cumple con los estandares venezolanos (11 digitos con prefijo 0412/0414/0424/0416/0426/0422).
 */
export function isValidVenezuelanPhone(phone: string): boolean {
  const normalized = normalizeVenezuelanPhone(phone);
  if (normalized.length !== 11) return false;
  return VENEZUELAN_PHONE_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix),
  );
}
