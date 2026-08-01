// utils/eanGenerator.ts
import { isValidEAN13 } from './eanValidator';

/**
 * Generates a valid 13-digit EAN-13 barcode starting with prefix (default: 789 for Brazil).
 */
export function generateEAN13(prefix = "789"): string {
  let first12 = prefix;
  while (first12.length < 12) {
    first12 += Math.floor(Math.random() * 10).toString();
  }

  const digits = first12.split("").map(Number);
  const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
  const checkDigit = (10 - (sum % 10)) % 10;

  const fullCode = first12 + checkDigit.toString();

  if (!isValidEAN13(fullCode)) {
    return generateEAN13(prefix);
  }

  return fullCode;
}
