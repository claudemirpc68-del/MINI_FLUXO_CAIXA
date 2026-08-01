import React, { useState, useRef, useEffect } from 'react';
import { Layers, X, PlusCircle, Barcode } from 'lucide-react';
import { Product } from '../../types';

interface BulkInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onBulkAddItems: (items: { product: Product; quantity: number }[]) => void;
}

export const BulkInsertModal: React.FC<BulkInsertModalProps> = ({
  isOpen,
  onClose,
  products,
  onBulkAddItems,
}) => {
  const [rawInput, setRawInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcessInsert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSuccessMsg('');

    const lines = rawInput
      .split(/[\n,;]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const itemsToAdd: { product: Product; quantity: number }[] = [];
    let addedCount = 0;

    lines.forEach((line) => {
      let qty = 1;
      let code = line;

      // Match multiplier pattern like "3*7896006700018"
      const match = line.match(/^([\d\,\.]+)\s*[\*xX]\s*(.+)$/);
      if (match) {
        const parsedQty = parseFloat(match[1].replace(',', '.'));
        if (!isNaN(parsedQty) && parsedQty > 0) {
          qty = parsedQty;
          code = match[2].trim();
        }
      }

      const p = products.find(
        (prod) => prod.code.toLowerCase() === code.toLowerCase() || prod.id === code
      );

      if (p) {
        itemsToAdd.push({ product: p, quantity: qty });
        addedCount += qty;
      }
    });

    if (itemsToAdd.length > 0) {
      onBulkAddItems(itemsToAdd);
      setSuccessMsg(`✅ ${addedCount} produto(s) inserido(s) no caixa! Prontinho para o próximo produto.`);
      setRawInput('');
      textareaRef.current?.focus();
    } else {
      setSuccessMsg('⚠️ Nenhum produto correspondente encontrado para os códigos digitados.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Inserção de Produtos em Massa</h2>
              <p className="text-xs text-slate-400">Digite ou cole códigos de barras (um por linha ou multiplicador ex: 3*7896006700018)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleProcessInsert} className="p-6 space-y-4 flex-1 flex flex-col">
          {successMsg && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Barcode className="w-4 h-4 text-blue-400" />
              <span>Códigos de Barras / Quantidade * Código (Cole ou digite abaixo):</span>
            </label>
            <textarea
              ref={textareaRef}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Cole os códigos de barras aqui (ex:&#10;7896006700018&#10;7896006730114&#10;3*7896007700017)"
              rows={7}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-600"
            />
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-300">💡 Sempre Pronto para Novo Produto:</p>
            <p>• Após clicar em inserir, a caixa de texto é limpa e o foco retorna automaticamente para digitar o próximo produto.</p>
            <p>• Você pode colar dezenas de códigos de barras de uma vez só.</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Concluir / Fechar
            </button>
            <button
              type="submit"
              disabled={!rawInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 text-xs flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>INSERIR PRODUTOS NO CAIXA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
