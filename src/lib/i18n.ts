/**
 * Helper per i campi bilingui dei dati (`string` oppure `{ it, en }`).
 * Sostituisce i ternari ripetuti `typeof x !== 'string' ? ... : x` e i cast
 * `as any` sparsi negli overlay.
 */
export type Localized = string | { it: string; en: string };

export function loc(value: Localized, isEn: boolean): string {
  return typeof value === 'string' ? value : isEn ? value.en : value.it;
}
