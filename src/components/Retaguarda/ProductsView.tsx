import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Barcode, 
  Check, 
  X, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Product } from '../../types';

interface ProductsViewProps {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Categories list
  const categories = ['TODAS', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.includes(searchTerm);
    const matchesCat = selectedCategory === 'TODAS' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    // Auto generate realistic EAN-13 barcode
    const randomEan = '789' + Math.floor(100000000 + Math.random() * 900000000).toString();
    setEditingProduct({
      id: 'prod-' + Date.now(),
      code: randomEan,
      description: '',
      category: 'Mercearia',
      costPrice: 0,
      salePrice: 0,
      stock: 10,
      minStock: 5,
      unit: 'UN',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.description || !editingProduct?.code) return;

    onSaveProduct(editingProduct as Product);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Cadastro & Gestão de Produtos</h2>
          <p className="text-xs text-slate-400">Controle de estoque, preços de custo/venda e gerador de códigos de barra</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>NOVO PRODUTO</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descrição ou código de barras..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-bold uppercase">Categoria:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-3 px-4">Cód. Barras</th>
                <th className="py-3 px-4">Descrição do Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4 text-right">Preço Custo</th>
                <th className="py-3 px-4 text-right">Preço Venda</th>
                <th className="py-3 px-4 text-right text-amber-300">Média ClickSuper</th>
                <th className="py-3 px-4 text-right">Margem %</th>
                <th className="py-3 px-4 text-right">Estoque</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredProducts.map((p) => {
                const margin = p.costPrice > 0 ? ((p.salePrice - p.costPrice) / p.costPrice) * 100 : 0;
                const isLowStock = p.stock <= p.minStock;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-400 flex items-center gap-1.5">
                      <Barcode className="w-4 h-4 text-slate-500" />
                      <span>{p.code}</span>
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">{p.description}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 text-[10px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">R$ {p.costPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">R$ {p.salePrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400">
                      {p.marketPrice ? `R$ ${p.marketPrice.toFixed(2)}` : 'R$ ' + (p.salePrice * 1.12).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-300">+{margin.toFixed(0)}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold px-2 py-0.5 rounded ${isLowStock ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-200'}`}>
                        {p.stock.toLocaleString('pt-BR')} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-950/60 rounded-lg border border-blue-800/40"
                          title="Editar Produto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-lg border border-rose-800/40"
                          title="Excluir Produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleSubmitProduct} className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-lg">
                {editingProduct.id ? 'Editar Produto' : 'Novo Cadastramento de Produto'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Código de Barras (EAN-13)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editingProduct.code || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, code: '789' + Math.floor(100000000 + Math.random() * 900000000) })}
                      className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl border border-slate-700 text-slate-300"
                      title="Gerar EAN Aleatório"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Categoria</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    placeholder="Ex: Padaria, Bebidas, Hortifruti"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Descrição do Produto</label>
                <input
                  type="text"
                  required
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Ex: COCA-COLA LATA 350ML"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 uppercase"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.costPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.salePrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Unidade Medida</label>
                  <select
                    value={editingProduct.unit || 'UN'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                  >
                    <option value="UN">UN (Unidade)</option>
                    <option value="KG">KG (Quilograma)</option>
                    <option value="CX">CX (Caixa)</option>
                    <option value="PCT">PCT (Pacote)</option>
                    <option value="LT">LT (Litro)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Estoque Atual</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.minStock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStock: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
