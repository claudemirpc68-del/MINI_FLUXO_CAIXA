import React, { useState } from 'react';
import { 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Lock, 
  Unlock, 
  DollarSign, 
  Plus, 
  Minus,
  CheckCircle,
  X
} from 'lucide-react';
import { CashMovement, CashSession, Sale, StoreSettings } from '../../types';

interface CashRegisterViewProps {
  cashSession: CashSession;
  cashMovements: CashMovement[];
  sales: Sale[];
  settings: StoreSettings;
  onAddCashMovement: (type: 'SANGRIA' | 'SUPRIMENTO', amount: number, description: string) => void;
  onCloseCashSession: (realAmount: number) => void;
}

export const CashRegisterView: React.FC<CashRegisterViewProps> = ({
  cashSession,
  cashMovements,
  sales,
  settings,
  onAddCashMovement,
  onCloseCashSession,
}) => {
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'SANGRIA' | 'SUPRIMENTO'>('SUPRIMENTO');
  const [movementAmountStr, setMovementAmountStr] = useState('');
  const [movementDesc, setMovementDesc] = useState('');

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [realCashInputStr, setRealCashInputStr] = useState('');

  // Calculations for current open session
  const moneySalesTotal = sales
    .filter(s => s.status === 'COMPLETED')
    .reduce((acc, s) => {
      const m = s.payments.find(p => p.method === 'DINHEIRO');
      return acc + (m ? m.amount - s.changeGiven : 0);
    }, 0);

  const totalSuprimentos = cashMovements
    .filter(m => m.type === 'SUPRIMENTO')
    .reduce((acc, m) => acc + m.amount, 0);

  const totalSangrias = cashMovements
    .filter(m => m.type === 'SANGRIA')
    .reduce((acc, m) => acc + m.amount, 0);

  const expectedCashInDrawer = cashSession.initialAmount + moneySalesTotal + totalSuprimentos - totalSangrias;

  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(movementAmountStr.replace(',', '.')) || 0;
    if (amount <= 0 || !movementDesc) return;

    onAddCashMovement(movementType, amount, movementDesc);
    setIsMovementModalOpen(false);
    setMovementAmountStr('');
    setMovementDesc('');
  };

  const handleCloseSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const realAmount = parseFloat(realCashInputStr.replace(',', '.')) || 0;
    onCloseCashSession(realAmount);
    setIsCloseModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Movimentação & Fechamento de Caixa</h2>
          <p className="text-xs text-slate-400">Sangria de segurança, suprimento de fundo de troco e fechamento com apuração de quebra</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setMovementType('SUPRIMENTO');
              setIsMovementModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>SUPRIMENTO (ENTRADA)</span>
          </button>

          <button
            onClick={() => {
              setMovementType('SANGRIA');
              setIsMovementModalOpen(true);
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Minus className="w-4 h-4" />
            <span>SANGRIA (SAÍDA)</span>
          </button>

          {cashSession.status === 'OPEN' && (
            <button
              onClick={() => {
                setRealCashInputStr(expectedCashInDrawer.toFixed(2));
                setIsCloseModalOpen(true);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 text-sm transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>FECHAR CAIXA</span>
            </button>
          )}
        </div>
      </div>

      {/* Session Status Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${cashSession.status === 'OPEN' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <h3 className="font-extrabold text-slate-100 text-base">
              STATUS DO CAIXA: {cashSession.status === 'OPEN' ? 'ABERTO' : 'FECHADO'} ({settings.pdvId})
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Operador: {cashSession.operator}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block font-sans">Fundo Inicial Troco</span>
            <span className="text-lg font-bold text-slate-200">R$ {cashSession.initialAmount.toFixed(2)}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block font-sans">Vendas Dinheiro</span>
            <span className="text-lg font-bold text-emerald-400">+ R$ {moneySalesTotal.toFixed(2)}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block font-sans">Suprimentos / Sangrias</span>
            <span className="text-lg font-bold text-blue-400">R$ {(totalSuprimentos - totalSangrias).toFixed(2)}</span>
          </div>

          <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block font-sans">SALDO EM GAVETA ESPERADO</span>
            <span className="text-xl font-black text-emerald-400">R$ {expectedCashInDrawer.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 font-bold text-slate-200 text-sm">
          Histórico de Sangrias e Suprimentos da Sessão
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-extrabold">
              <th className="py-3 px-4">Data / Hora</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Descrição / Motivo</th>
              <th className="py-3 px-4">Operador</th>
              <th className="py-3 px-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {cashMovements.map((mov) => (
              <tr key={mov.id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-400">{new Date(mov.date).toLocaleString('pt-BR')}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded font-sans text-[10px] font-bold ${mov.type === 'SUPRIMENTO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    {mov.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans text-slate-200">{mov.description}</td>
                <td className="py-3 px-4 text-slate-400">{mov.operator}</td>
                <td className={`py-3 px-4 text-right font-bold ${mov.type === 'SUPRIMENTO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {mov.type === 'SUPRIMENTO' ? '+' : '-'} R$ {mov.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sangria / Suprimento Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleMovementSubmit} className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-base">
                {movementType === 'SUPRIMENTO' ? 'Registrar Suprimento de Caixa' : 'Registrar Sangria (Retirada de Dinheiro)'}
              </h3>
              <button type="button" onClick={() => setIsMovementModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Valor R$ *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={movementAmountStr}
                  onChange={(e) => setMovementAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-mono font-extrabold text-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Motivo / Descrição *</label>
                <input
                  type="text"
                  required
                  value={movementDesc}
                  onChange={(e) => setMovementDesc(e.target.value)}
                  placeholder={movementType === 'SUPRIMENTO' ? 'Ex: Troco adicional em moedas' : 'Ex: Recolhimento de gaveta para cofre'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsMovementModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl">
                Confirmar Lançamento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Close Cash Session Modal */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form onSubmit={handleCloseSessionSubmit} className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-100 text-base">Conferência & Fechamento de Caixa</h3>
              <button type="button" onClick={() => setIsCloseModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400">Saldo Esperado no Sistema: <strong className="text-emerald-400 font-mono">R$ {expectedCashInDrawer.toFixed(2)}</strong></p>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Valor Contado em Espécie na Gaveta (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={realCashInputStr}
                  onChange={(e) => setRealCashInputStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-mono font-extrabold text-xl"
                />
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsCloseModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">
                Cancelar
              </button>
              <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2 rounded-xl">
                Encerrar Fechamento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
