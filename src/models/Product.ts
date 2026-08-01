// models/Product.ts
export interface Product {
  id: string;              // UUID interno
  ean: string;             // Código EAN-13
  description: string;
  category: string;
  unit: "UN" | "KG" | "CX" | "PCT" | "LT";
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
}
