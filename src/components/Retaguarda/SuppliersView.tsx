import React, { useState } from 'react';
import { Truck, Plus, Search, Building2, Phone, Mail, MapPin, PackageCheck, X } from 'lucide-react';
import { Supplier, Product } from '../../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  products: Product[];
  onSaveSupplier: (supplier: Supplier) => void;
  onStockEntry: (productId: string, quantityAdded: number, newCostPrice?: number) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  products,
  onSaveSupplier,
  onStockEntry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);

  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier>>({});
  
  // Stock Entry state
  const [selectedProductId, setSelectedProductId] = useState('');
  const [entryQtyStr, setEntryQtyStr] = useState('');
  const [entryCostStr, setEntryCostStr] = useState('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cnpj.includes(searchTerm) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddSupplier = () => {
    setEditingSupplier({
      id: 'sup-' + Date.now(),
      companyName: '',
      cnpj: '',
      phone: '',
      email: '',
      city: '',
      createdAt: new Date().toISOString(),
    });
    setIsAddSupplierOpen(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier.companyName) return;
    onSaveSupplier(editingSupplier as Supplier);
    setIsAddSupplierOpen(false);
  };

  const handleStockEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    const qty = parseFloat(entryQtyStr.replace(',', '.')) || 0;
    const cost = entryCostStr ? parseFloat(entryCostStr.replace(',', '.')) : undefined;

    if (qty > 0) {
      onStockEntry(selectedProductId, qty, cost);
      setIsStockEntryOpen(false);
      setSelectedProductId('');
      setEntryQtyStr('');
      setEntryCostStr('');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Cadastro de Fornecedores & Entrada de Mercadorias</h2>
          <p className="text-xs text-slate-400">Controle de distribuidores, notas de compra e reposição rápida de estoque</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsStockEntryOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <PackageCheck className="w-5 h-5" />
            <span>ENTRADA DE MERCADORIAS</span>
          </button>

          <button
            onClick={handleOpenAddSupplier}
            className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>NOVO FORNECEDOR</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar fornecedor por razão social, CNPJ ou cidade..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base leading-tight">{sup.companyName}</h3>
                <span className="text-[11px] font-mono text-slate-400">CNPJ: {sup.cnpj || 'Não Informado'}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{sup.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{sup.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{sup.city || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleSaveSupplier} className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-lg">Novo Fornecedor</h3>
              <button type="button" onClick={() => setIsAddSupplierOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Razão Social / Nome Fantasia *</label>
                <input
                  type="text"
                  required
                  value={editingSupplier.companyName || ''}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, companyName: e.target.value })}
                  placeholder="Ex: Distribuidora Alimentos Brasil Ltda"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={editingSupplier.cnpj || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Telefone / Contato</label>
                  <input
                    type="text"
                    value={editingSupplier.phone || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                    placeholder="(11) 4004-0000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">E-mail Comercial</label>
                <input
                  type="email"
                  value={editingSupplier.email || ''}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                  placeholder="vendas@fornecedor.com.br"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Cidade / Estado</label>
                <input
                  type="text"
                  value={editingSupplier.city || ''}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, city: e.target.value })}
                  placeholder="São Paulo / SP"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddSupplierOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl">
                Salvar Fornecedor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stock Entry Modal */}
      {isStockEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleStockEntrySubmit} className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-lg">Entrada de Mercadorias (Reposição)</h3>
              <button type="button" onClick={() => setIsStockEntryOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Selecione o Produto *</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium"
                >
                  <option value="">-- Escolha o produto para entrada --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.description} (Estoque Atual: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  const selProd = products.find((p) => p.id === selectedProductId);
                  const isDecimalUnit = selProd?.unit === 'KG' || selProd?.unit === 'LT';
                  return (
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">
                        Quantidade Recebida {isDecimalUnit ? '(Decimais/Peso)' : '(Inteiros)'} *
                      </label>
                      <input
                        type="number"
                        step={isDecimalUnit ? '0.001' : '1'}
                        min="0.001"
                        required
                        value={entryQtyStr}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (isDecimalUnit) {
                            setEntryQtyStr(raw);
                          } else {
                            const val = parseInt(raw, 10);
                            setEntryQtyStr(isNaN(val) ? '' : val.toString());
                          }
                        }}
                        placeholder={isDecimalUnit ? 'Ex: 12.500' : 'Ex: 50'}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                      />
                    </div>
                  );
                })()}

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Novo Preço Custo (Opcional R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entryCostStr}
                    onChange={(e) => setEntryCostStr(e.target.value)}
                    placeholder="Deixe em branco p/ manter"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsStockEntryOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">
                Cancelar
              </button>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl">
                Dar Entrada no Estoque
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
