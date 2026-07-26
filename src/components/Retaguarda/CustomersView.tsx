import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  DollarSign, 
  CreditCard, 
  History, 
  X, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Customer, CrediarioTransaction } from '../../types';

interface CustomersViewProps {
  customers: Customer[];
  crediarioTransactions: CrediarioTransaction[];
  onSaveCustomer: (customer: Customer) => void;
  onRecordCrediarioPayment: (customerId: string, amount: number, paymentMethod: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  crediarioTransactions,
  onSaveCustomer,
  onRecordCrediarioPayment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer>>({});

  // Crediario Payment Modal
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState<Customer | null>(null);
  const [payAmountStr, setPayAmountStr] = useState<string>('');
  const [payMethod, setPayMethod] = useState<string>('DINHEIRO');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpfCnpj.includes(searchTerm) ||
      c.phone.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingCustomer({
      id: 'cust-' + Date.now(),
      name: '',
      cpfCnpj: '',
      phone: '',
      address: '',
      creditLimit: 500,
      currentBalance: 0,
      createdAt: new Date().toISOString(),
    });
    setIsNewCustomerModalOpen(true);
  };

  const handleSaveCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer.name) return;
    onSaveCustomer(editingCustomer as Customer);
    setIsNewCustomerModalOpen(false);
  };

  const handlePayDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentCustomer) return;
    const val = parseFloat(payAmountStr.replace(',', '.')) || 0;
    if (val <= 0) return;

    onRecordCrediarioPayment(selectedPaymentCustomer.id, val, payMethod);
    setSelectedPaymentCustomer(null);
    setPayAmountStr('');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Cadastro de Clientes & Crediário (Fiado)</h2>
          <p className="text-xs text-slate-400">Gerenciamento de limites de crédito, débitos acumulados e quitação de parcelas</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
        >
          <UserPlus className="w-5 h-5" />
          <span>CADASTRAR NOVO CLIENTE</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente por nome, CPF/CNPJ ou telefone..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const isDebt = customer.currentBalance > 0;

          return (
            <div
              key={customer.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-100 text-base">{customer.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDebt ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'}`}>
                    {isDebt ? 'Débito Ativo' : 'Em Dia'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>CPF/CNPJ: <strong className="text-slate-300 font-mono">{customer.cpfCnpj || 'Não Informado'}</strong></p>
                  <p>Telefone: <strong className="text-slate-300">{customer.phone || 'N/A'}</strong></p>
                  <p className="truncate">Endereço: <span className="text-slate-300">{customer.address || 'N/A'}</span></p>
                </div>
              </div>

              {/* Financial Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Limite Crédito</span>
                  <span className="font-mono font-bold text-slate-300">R$ {customer.creditLimit.toFixed(2)}</span>
                </div>
                <div className="border-l border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Saldo Devedor</span>
                  <span className={`font-mono font-extrabold ${isDebt ? 'text-amber-400' : 'text-emerald-400'}`}>
                    R$ {customer.currentBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isDebt && (
                  <button
                    onClick={() => {
                      setSelectedPaymentCustomer(customer);
                      setPayAmountStr(customer.currentBalance.toFixed(2));
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Quitar Débito</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Customer Modal */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleSaveCustomerSubmit} className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-lg">Cadastrar Cliente para Crediário</h3>
              <button type="button" onClick={() => setIsNewCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Nome Completo do Cliente *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="Ex: João Carlos da Silva"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">CPF / CNPJ</label>
                  <input
                    type="text"
                    value={editingCustomer.cpfCnpj || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, cpfCnpj: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Endereço Residencial/Comercial</label>
                <input
                  type="text"
                  value={editingCustomer.address || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  placeholder="Rua, Número, Bairro"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Limite Máximo de Crédito (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingCustomer.creditLimit || 500}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, creditLimit: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsNewCustomerModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl">
                Salvar Cliente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pay Debt Modal */}
      {selectedPaymentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handlePayDebtSubmit} className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-base">Receber Pagamento do Crediário</h3>
              <button type="button" onClick={() => setSelectedPaymentCustomer(null)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400">Cliente: <strong className="text-slate-100">{selectedPaymentCustomer.name}</strong></p>
                <p className="text-slate-400">Saldo Devedor Atual: <strong className="text-amber-400 font-mono">R$ {selectedPaymentCustomer.currentBalance.toFixed(2)}</strong></p>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Valor Abatido / Pago (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmountStr}
                  onChange={(e) => setPayAmountStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-mono font-extrabold text-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Forma de Pagamento</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                >
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="PIX">Pix</option>
                  <option value="CARTAO_DEBITO">Cartão Débito</option>
                  <option value="CARTAO_CREDITO">Cartão Crédito</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedPaymentCustomer(null)} className="px-4 py-2 text-slate-400 hover:text-slate-200">
                Cancelar
              </button>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl">
                Confirmar Recebimento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
