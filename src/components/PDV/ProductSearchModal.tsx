import React, { useState } from 'react';
import { Search, X, Package, Check } from 'lucide-react';
import { Product } from '../../types';

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductSearchModal: React.FC<ProductSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter(
    (p) =>
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Consulta Rápida de Produtos (F1)</h2>
              <p className="text-xs text-slate-400">Pesquise por código de barras, descrição ou categoria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do produto ou código de barras..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-100 text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-base font-semibold">Nenhum produto encontrado</p>
              <p className="text-xs mt-1">Tente pesquisar com outros termos</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase font-semibold text-slate-400 pb-2">
                  <th className="py-2 px-3">Cód.</th>
                  <th className="py-2 px-3">Descrição</th>
                  <th className="py-2 px-3">Categoria</th>
                  <th className="py-2 px-3 text-right">Estoque</th>
                  <th className="py-2 px-3 text-right">Preço Unit.</th>
                  <th className="py-2 px-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="hover:bg-blue-950/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-blue-400">{product.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{product.description}</td>
                    <td className="py-3 px-3 text-xs text-slate-400">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      <span className={product.stock <= product.minStock ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {product.stock.toLocaleString('pt-BR')} {product.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      R$ {product.salePrice.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="bg-blue-600 group-hover:bg-blue-500 text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 mx-auto font-medium transition-colors">
                        <Check className="w-3.5 h-3.5" />
                        <span>Inserir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Total de itens encontrados: {filteredProducts.length}</span>
          <span className="font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">Pressione ESC para fechar</span>
        </div>
      </div>
    </div>
  );
};
