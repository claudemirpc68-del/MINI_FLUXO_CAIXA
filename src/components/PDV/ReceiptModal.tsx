import React from 'react';
import { X, Printer, CheckCircle, FileText } from 'lucide-react';
import { Sale, StoreSettings } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  settings: StoreSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  sale,
  settings,
}) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>Venda Concluída com Sucesso!</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Container Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60 flex justify-center">
          
          {/* Printable Receipt Paper Mock */}
          <div 
            id="printable-receipt"
            className="bg-white text-black p-5 rounded shadow-lg font-mono text-xs w-[320px] leading-tight select-text"
          >
            <div className="text-center font-bold text-sm uppercase mb-1">
              {settings.storeName}
            </div>
            <div className="text-center text-[10px] mb-1">
              CNPJ: {settings.cnpj}<br/>
              {settings.address} - {settings.cityState}<br/>
              Tel: {settings.phone}
            </div>

            <div className="text-center my-2 font-bold border-y border-dashed border-black py-1 uppercase">
              CUPOM NÃO FISCAL #{sale.receiptNumber.toString().padStart(6, '0')}
            </div>

            <div className="text-[10px] mb-2">
              Data: {new Date(sale.date).toLocaleString('pt-BR')}<br/>
              PDV: {sale.pdvId} | Operador: {sale.operator}<br/>
              {sale.customerName && <span>Cliente: {sale.customerName}</span>}
            </div>

            <div className="border-b border-black pb-1 font-bold flex text-[10px] uppercase">
              <span className="w-12">Cód.</span>
              <span className="flex-1">Descrição</span>
              <span className="w-12 text-right">Qtd</span>
              <span className="w-14 text-right">Total</span>
            </div>

            <div className="divide-y divide-gray-300 py-1">
              {sale.items.map((item, index) => (
                <div key={index} className="py-1 flex text-[10px]">
                  <span className="w-12 font-bold">{item.product.code}</span>
                  <span className="flex-1 truncate pr-1">{item.product.description}</span>
                  <span className="w-12 text-right">{item.quantity}</span>
                  <span className="w-14 text-right font-bold">
                    {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-black pt-2 mt-2 space-y-1 font-bold">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>R$ {sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>DESCONTO:</span>
                  <span>- R$ {sale.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-dashed border-black pt-1">
                <span>TOTAL COMPRA:</span>
                <span>R$ {sale.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-2 mt-2 text-[10px]">
              <div className="font-bold mb-0.5">FORMA DE PAGAMENTO:</div>
              {sale.payments.map((p, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{p.method}:</span>
                  <span>R$ {p.amount.toFixed(2)}</span>
                </div>
              ))}
              {sale.changeGiven > 0 && (
                <div className="flex justify-between font-bold text-black mt-1">
                  <span>TROCO:</span>
                  <span>R$ {sale.changeGiven.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] mt-4 pt-2 border-t border-dashed border-black uppercase text-gray-700">
              {settings.receiptHeaderMsg}<br/>
              {settings.receiptFooterMsg}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs font-bold"
          >
            Nova Venda (F2)
          </button>
          
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>IMPRIMIR CUPOM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
