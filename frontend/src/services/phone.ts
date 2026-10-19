// Mirrors the backend contract in services/phone.py: spaces are stripped,
// a national "8" prefix followed by ten digits becomes "+7", and what is
// left has to be an international number. Normalising here as well means
// separators the user types (dashes, brackets) never reach the backend,
// which only strips spaces on its side.
const NATIONAL_PREFIX_PATTERN = /^8(\d{10})$/;
const INTERNATIONAL_PATTERN = /^\+[1-9]\d{6,14}$/;

export function normalizePhone(phone: string): string {
  const compact = phone.replace(/[\s()./-]/g, '');

  return compact.replace(
    NATIONAL_PREFIX_PATTERN,
    '+7$1',
  );
}

export function isValidPhone(phone: string): boolean {
  return INTERNATIONAL_PATTERN.test(
    normalizePhone(phone),
  );
}
