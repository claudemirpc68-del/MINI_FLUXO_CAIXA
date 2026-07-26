import React, { useState } from 'react';
import { 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  X 
} from 'lucide-react';
import { AccountPayable, AccountReceivable } from '../../types';

interface FinanceViewProps {
  accountsPayable: AccountPayable[];
  accountsReceivable: AccountReceivable[];
  onSaveAccountPayable: (account: AccountPayable) => void;
  onSaveAccountReceivable: (account: AccountReceivable) => void;
  onPayBill: (id: string) => void;
  onReceiveBill: (id: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  accountsPayable,
  accountsReceivable,
  onSaveAccountPayable,
  onSaveAccountReceivable,
  onPayBill,
  onReceiveBill,
}) => {
  const [activeTab, setActiveTab] = useState<'payable' | 'receivable'>('payable');
  const [isAddPayableOpen, setIsAddPayableOpen] = useState(false);

  // Form state
  const [newPayable, setNewPayable] = useState<Partial<AccountPayable>>({
    supplierName: '',
    description: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Mercadorias',
    status: 'PENDING',
  });

  const totalPayablePending = accountsPayable
    .filter((a) => a.status === 'PENDING')
    .reduce((acc, a) => acc + a.amount, 0);

  const totalReceivablePending = accountsReceivable
    .filter((a) => a.status === 'PENDING')
    .reduce((acc, a) => acc + a.amount, 0);

  const handleAddPayableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayable.description || !newPayable.amount) return;

    onSaveAccountPayable({
      id: 'ap-' + Date.now(),
      supplierName: newPayable.supplierName || 'Fornecedor Diverso',
      description: newPayable.description,
      amount: newPayable.amount,
      dueDate: newPayable.dueDate || new Date().toISOString().split('T')[0],
      status: 'PENDING',
      category: newPayable.category || 'Outros',
    });

    setIsAddPayableOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Gestão Financeira & Contas</h2>
          <p className="text-xs text-slate-400">Controle de Contas a Pagar, Contas a Receber e Fluxo de Caixa previsto</p>
        </div>

        <button
          onClick={() => setIsAddPayableOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>NOVA CONTA A PAGAR</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400">Total Contas a Pagar (Pendente)</span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              R$ {totalPayablePending.toFixed(2).replace('.', ',')}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <ArrowDownCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400">Total Contas a Receber (Pendente)</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              R$ {totalReceivablePending.toFixed(2).replace('.', ',')}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('payable')}
          className={`pb-3 transition-colors ${
            activeTab === 'payable'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Contas a Pagar ({accountsPayable.length})
        </button>
        <button
          onClick={() => setActiveTab('receivable')}
          className={`pb-3 transition-colors ${
            activeTab === 'receivable'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Contas a Receber ({accountsReceivable.length})
        </button>
      </div>

      {/* Accounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {activeTab === 'payable' ? (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-extrabold uppercase">
                <th className="py-3 px-4">Fornecedor / Beneficiário</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {accountsPayable.map((ap) => (
                <tr key={ap.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-bold text-slate-200">{ap.supplierName}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">{ap.description}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{ap.category}</td>
                  <td className="py-3 px-4 text-slate-300">{ap.dueDate}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-400">R$ {ap.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ap.status === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                      {ap.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {ap.status === 'PENDING' && (
                      <button
                        onClick={() => onPayBill(ap.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-[11px] font-bold px-3 py-1 rounded-lg"
                      >
                        Baixar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-extrabold uppercase">
                <th className="py-3 px-4">Cliente / Origem</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {accountsReceivable.map((ar) => (
                <tr key={ar.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-bold text-slate-200">{ar.customerName}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">{ar.description}</td>
                  <td className="py-3 px-4 text-slate-300">{ar.dueDate}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">R$ {ar.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ar.status === 'RECEIVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                      {ar.status === 'RECEIVED' ? 'RECEBIDO' : 'PENDENTE'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {ar.status === 'PENDING' && (
                      <button
                        onClick={() => onReceiveBill(ar.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-sans text-[11px] font-bold px-3 py-1 rounded-lg"
                      >
                        Baixar Recebido
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Payable Modal */}
      {isAddPayableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleAddPayableSubmit} className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-lg">Nova Conta a Pagar</h3>
              <button type="button" onClick={() => setIsAddPayableOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Fornecedor / Beneficiário</label>
                <input
                  type="text"
                  required
                  value={newPayable.supplierName || ''}
                  onChange={(e) => setNewPayable({ ...newPayable, supplierName: e.target.value })}
                  placeholder="Ex: Distribuidora Brasil"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Descrição do Vencimento</label>
                <input
                  type="text"
                  required
                  value={newPayable.description || ''}
                  onChange={(e) => setNewPayable({ ...newPayable, description: e.target.value })}
                  placeholder="Ex: Fatura de Aluguel ou Reposição"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPayable.amount || ''}
                    onChange={(e) => setNewPayable({ ...newPayable, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-rose-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={newPayable.dueDate || ''}
                    onChange={(e) => setNewPayable({ ...newPayable, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddPayableOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl">
                Salvar Conta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
