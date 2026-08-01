// utils/eanValidator.ts
export function isValidEAN13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;

  const digits = code.split("").map(Number);
  const checkDigit = digits.pop()!;
  const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
  const calculated = (10 - (sum % 10)) % 10;

  return checkDigit === calculated;
}
