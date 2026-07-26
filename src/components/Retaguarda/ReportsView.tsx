import React, { useState } from 'react';
import { FileText, Printer, Download, Filter, ShoppingBag, Users, Package } from 'lucide-react';
import { Sale, Product, Customer } from '../../types';

interface ReportsViewProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ sales, products, customers }) => {
  const [reportType, setReportType] = useState<'sales' | 'products' | 'crediario'>('sales');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Central de Relatórios Gerenciais</h2>
          <p className="text-xs text-slate-400">Emissão de relatórios detalhados para tomada de decisão e contabilidade</p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
        >
          <Printer className="w-5 h-5" />
          <span>IMPRIMIR / EXPORTAR PDF</span>
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setReportType('sales')}
          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
            reportType === 'sales'
              ? 'bg-blue-950/80 border-blue-500 text-white ring-2 ring-blue-500/40'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Relatório de Vendas Realizadas</h3>
            <p className="text-[11px] opacity-70">Detalhamento de cupons por período e pagamentos</p>
          </div>
        </button>

        <button
          onClick={() => setReportType('products')}
          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
            reportType === 'products'
              ? 'bg-blue-950/80 border-blue-500 text-white ring-2 ring-blue-500/40'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Relatório de Posição de Estoque</h3>
            <p className="text-[11px] opacity-70">Avaliação do valor total estocado e reposição</p>
          </div>
        </button>

        <button
          onClick={() => setReportType('crediario')}
          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
            reportType === 'crediario'
              ? 'bg-blue-950/80 border-blue-500 text-white ring-2 ring-blue-500/40'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Relatório de Crediário & Fiado</h3>
            <p className="text-[11px] opacity-70">Relação de clientes com saldos devedores</p>
          </div>
        </button>
      </div>

      {/* Report Content Table Container */}
      <div id="printable-report" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6">
        {reportType === 'sales' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-slate-100">Relatório Consolidado de Vendas</h3>
              <span className="text-xs text-slate-400 font-mono">Total de Registros: {sales.length}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase">
                  <th className="py-2.5 px-3">Cupom #</th>
                  <th className="py-2.5 px-3">Data / Hora</th>
                  <th className="py-2.5 px-3">Itens</th>
                  <th className="py-2.5 px-3">Pagamento</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                  <th className="py-2.5 px-3 text-right">Total Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-blue-400">#{sale.receiptNumber}</td>
                    <td className="py-2.5 px-3 text-slate-300">{new Date(sale.date).toLocaleString('pt-BR')}</td>
                    <td className="py-2.5 px-3 font-sans">{sale.items.length} itens</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                        {sale.payments.map(p => p.method).join(', ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">R$ {sale.subtotal.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">R$ {sale.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'products' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-slate-100">Relatório de Inventário & Valor em Estoque</h3>
              <span className="text-xs text-slate-400 font-mono">Total de Itens: {products.length}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase">
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Descrição</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3 text-right">Estoque</th>
                  <th className="py-2.5 px-3 text-right">Preço Venda</th>
                  <th className="py-2.5 px-3 text-right">Valor Total Estocado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-blue-400">{p.code}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-200 font-medium">{p.description}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400">{p.category}</td>
                    <td className="py-2.5 px-3 text-right text-slate-200">{p.stock} {p.unit}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">R$ {p.salePrice.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">R$ {(p.stock * p.salePrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'crediario' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-slate-100">Relatório de Inadimplência & Fiado em Aberto</h3>
              <span className="text-xs text-slate-400 font-mono">Clientes com Débito: {customers.filter(c => c.currentBalance > 0).length}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase">
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">CPF / CNPJ</th>
                  <th className="py-2.5 px-3">Telefone</th>
                  <th className="py-2.5 px-3 text-right">Limite Crédito</th>
                  <th className="py-2.5 px-3 text-right">Saldo Devedor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {customers
                  .filter((c) => c.currentBalance > 0)
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-200">{c.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{c.cpfCnpj}</td>
                      <td className="py-2.5 px-3 text-slate-400">{c.phone}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">R$ {c.creditLimit.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-amber-400">R$ {c.currentBalance.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
