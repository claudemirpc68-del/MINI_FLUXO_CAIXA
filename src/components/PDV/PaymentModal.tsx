import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  CreditCard, 
  QrCode, 
  UserCheck, 
  CheckCircle2, 
  Printer, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Customer, PaymentMethod, SalePayment } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  discount: number;
  total: number;
  customers: Customer[];
  onCompleteSale: (
    payments: SalePayment[], 
    changeGiven: number, 
    customerId?: string, 
    customerName?: string
  ) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  discount,
  total,
  customers,
  onCompleteSale,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('DINHEIRO');
  const [paidAmountStr, setPaidAmountStr] = useState<string>(total.toFixed(2));
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const paidAmount = parseFloat(paidAmountStr.replace(',', '.')) || 0;
  const changeGiven = selectedMethod === 'DINHEIRO' ? Math.max(0, paidAmount - total) : 0;
  const isPaidEnough = selectedMethod === 'DINHEIRO' ? paidAmount >= total : true;

  const handleConfirmPayment = () => {
    setErrorMessage('');

    if (selectedMethod === 'DINHEIRO' && paidAmount < total) {
      setErrorMessage('O valor pago em dinheiro é insuficiente para cobrir o total da venda!');
      return;
    }

    let customerName = undefined;
    if (selectedMethod === 'CREDIARIO') {
      if (!selectedCustomerId) {
        setErrorMessage('Selecione um cliente cadastrado para realizar a venda no Crediário (Fiado)!');
        return;
      }
      const customer = customers.find(c => c.id === selectedCustomerId);
      if (customer) {
        customerName = customer.name;
        // Check credit limit
        if (customer.currentBalance + total > customer.creditLimit) {
          setErrorMessage(`Limite de crédito excedido! Saldo atual: R$ ${customer.currentBalance.toFixed(2)}, Limite: R$ ${customer.creditLimit.toFixed(2)}.`);
          return;
        }
      }
    }

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }

    const finalPayments: SalePayment[] = [
      { method: selectedMethod, amount: selectedMethod === 'DINHEIRO' ? paidAmount : total }
    ];

    onCompleteSale(finalPayments, changeGiven, selectedCustomerId || undefined, customerName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Finalizar Venda (F5 / F6)</h2>
              <p className="text-xs text-slate-400">Escolha a forma de pagamento e confirme o recebimento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Display */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Subtotal</span>
              <span className="text-lg font-bold text-slate-300 font-mono">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Desconto</span>
              <span className="text-lg font-bold text-amber-400 font-mono">R$ {discount.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="bg-emerald-950/60 rounded-lg p-1 border border-emerald-500/30">
              <span className="text-[11px] font-bold uppercase text-emerald-400 block">TOTAL A PAGAR</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-300 block mb-2 tracking-wider">
              1. Selecione a Forma de Pagamento
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('DINHEIRO')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedMethod === 'DINHEIRO'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Dinheiro</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('CARTAO_DEBITO')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedMethod === 'CARTAO_DEBITO'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>C. Débito</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('CARTAO_CREDITO')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedMethod === 'CARTAO_CREDITO'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>C. Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('PIX')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedMethod === 'PIX'
                    ? 'bg-teal-600 text-white border-teal-400 shadow-lg shadow-teal-600/30 ring-2 ring-teal-400/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>Pix</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('CREDIARIO')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedMethod === 'CREDIARIO'
                    ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span>Fiado / Cred.</span>
              </button>
            </div>
          </div>

          {/* Conditional Details based on Method */}
          {selectedMethod === 'DINHEIRO' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase">Valor Recebido do Cliente (R$)</label>
                <div className="flex gap-1.5">
                  {[total, 20, 50, 100, 200].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPaidAmountStr(val.toFixed(2))}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded border border-slate-700 font-mono"
                    >
                      R${val}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                step="0.01"
                value={paidAmountStr}
                onChange={(e) => setPaidAmountStr(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-2xl font-extrabold text-emerald-400 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {/* Change Box */}
              <div className="flex items-center justify-between bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-300 uppercase">Troco do Cliente:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  R$ {changeGiven.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          )}

          {selectedMethod === 'PIX' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
              <div className="w-32 h-32 bg-white p-2 mx-auto rounded-lg shadow-inner flex items-center justify-center">
                {/* Simulated QR Code */}
                <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center text-black font-black text-xs text-center">
                  QR CODE PIX<br/>R$ {total.toFixed(2)}
                </div>
              </div>
              <p className="text-xs text-slate-300 font-medium">Apresente o QR Code ao cliente para leitura via App de Banco</p>
            </div>
          )}

          {selectedMethod === 'CREDIARIO' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase block">Selecione o Cliente do Crediário</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Selecione o Cliente --</option>
                {customers.map(cust => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name} - CPF: {cust.cpfCnpj} (Saldo Dev: R$ {cust.currentBalance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancelar (ESC)
          </button>

          <button
            type="button"
            onClick={handleConfirmPayment}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all group"
          >
            <span>CONFIRMAR & EMITIR CUPOM</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
