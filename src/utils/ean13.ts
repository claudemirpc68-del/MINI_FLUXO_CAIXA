import { Product } from '../types';

/**
 * Calculates the EAN-13 Check Digit (13th digit) using GS1 Modulo 10 Algorithm.
 * 
 * Algorithm steps:
 * 1. Sum digits at ODD positions (1st, 3rd, 5th, 7th, 9th, 11th).
 * 2. Sum digits at EVEN positions (2nd, 4th, 6th, 8th, 10th, 12th) and multiply by 3.
 * 3. Add odd sum and even sum.
 * 4. Check digit = (10 - (totalSum % 10)) % 10.
 */
export function calculateEAN13CheckDigit(first12Digits: string): number {
  if (first12Digits.length < 12) {
    throw new Error('OS 12 primeiros dígitos são necessários para calcular o Dígito Verificador EAN-13.');
  }

  const digits = first12Digits.slice(0, 12).split('').map(Number);
  
  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) {
      // 0-indexed position 0, 2, 4... corresponds to 1st, 3rd, 5th (ODD GS1 positions)
      oddSum += digits[i];
    } else {
      // 0-indexed position 1, 3, 5... corresponds to 2nd, 4th, 6th (EVEN GS1 positions)
      evenSum += digits[i];
    }
  }

  const totalSum = oddSum + (evenSum * 3);
  const remainder = totalSum % 10;
  
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Generates a mathematically valid EAN-13 Barcode with correct GS1 Check Digit.
 * Default prefix for Brazil is '789'.
 */
export function generateValidEAN13(prefix: string = '789'): string {
  // Prefix length + random payload = 12 digits
  const randomPayloadLength = 12 - prefix.length;
  let randomPayload = '';

  for (let i = 0; i < randomPayloadLength; i++) {
    randomPayload += Math.floor(Math.random() * 10).toString();
  }

  const first12 = prefix + randomPayload;
  const checkDigit = calculateEAN13CheckDigit(first12);

  return `${first12}${checkDigit}`;
}

/**
 * Validates whether a 13-digit barcode is a valid EAN-13 with correct checksum.
 */
export function isValidEAN13(barcode: string): boolean {
  const cleanCode = barcode.trim();
  if (!/^\d{13}$/.test(cleanCode)) return false;

  const first12 = cleanCode.slice(0, 12);
  const expectedCheckDigit = calculateEAN13CheckDigit(first12);
  const actualCheckDigit = parseInt(cleanCode.slice(12), 10);

  return expectedCheckDigit === actualCheckDigit;
}

/**
 * Helper to create a new Product object conforming to model specifications
 */
export function createProductWithEAN(data: {
  description: string;
  category: string;
  unit: 'UN' | 'KG' | 'CX' | 'PCT' | 'LT';
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  ean?: string;
}): Product {
  const eanCode = data.ean && isValidEAN13(data.ean) ? data.ean : generateValidEAN13('789');

  return {
    id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    code: eanCode,
    description: data.description.toUpperCase(),
    category: data.category,
    unit: data.unit,
    costPrice: data.costPrice,
    salePrice: data.salePrice,
    stock: data.stock,
    minStock: data.minStock,
    updatedAt: new Date().toISOString()
  };
}
