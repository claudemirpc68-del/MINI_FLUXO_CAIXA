// pages/ProductManager.tsx
import { useState } from "react";
import EANImporter from "../components/EANImporter";
import { Product } from "../models/Product";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);

  const handleImport = (codes: string[]) => {
    const newProducts: Product[] = codes.map(code => ({
      id: crypto.randomUUID(),
      ean: code,
      description: "Novo Produto",
      category: "Geral",
      unit: "UN",
      costPrice: 0,
      salePrice: 0,
      stock: 0,
      minStock: 1,
    }));
    setProducts(prev => [...prev, ...newProducts]);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold text-emerald-400">Cadastro de Produtos</h1>
      <EANImporter onImport={handleImport} />

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="text-amber-400">
            <th>EAN</th><th>Descrição</th><th>Preço Venda</th><th>Estoque</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b border-slate-700">
              <td className="font-mono">{p.ean}</td>
              <td>{p.description}</td>
              <td>R$ {p.salePrice.toFixed(2)}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
