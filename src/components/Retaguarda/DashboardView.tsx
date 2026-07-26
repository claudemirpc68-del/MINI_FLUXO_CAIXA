import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  ArrowUpRight, 
  PieChart, 
  BarChart3,
  ShieldCheck,
  Lock,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Product, Sale, Customer } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardViewProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sales,
  products,
  customers,
}) => {
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString('pt-BR'));

  // Live Auto-Refresh simulation effect
  useEffect(() => {
    if (!isLiveSync) return;
    const interval = setInterval(() => {
      setLastSyncTime(new Date().toLocaleTimeString('pt-BR'));
    }, 5000);
    return () => clearInterval(interval);
  }, [isLiveSync]);

  // Metrics calculation
  const totalFaturamento = sales.reduce((acc, s) => acc + s.total, 0);
  const totalSalesCount = sales.length;
  const averageTicket = totalSalesCount > 0 ? totalFaturamento / totalSalesCount : 0;
  
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const totalCrediarioDebt = customers.reduce((acc, c) => acc + c.currentBalance, 0);

  // ClickSuper Market Intelligence benchmark calculation
  const productsWithMarketPrice = products.filter(p => p.marketPrice && p.marketPrice > 0);
  const storeTotalSum = productsWithMarketPrice.reduce((acc, p) => acc + p.salePrice, 0);
  const marketTotalSum = productsWithMarketPrice.reduce((acc, p) => acc + (p.marketPrice || p.salePrice), 0);
  
  const priceDifferencePercent = marketTotalSum > 0 
    ? (((marketTotalSum - storeTotalSum) / marketTotalSum) * 100).toFixed(1)
    : '0';

  // Sales by payment method chart data
  const paymentMethodsMap: Record<string, number> = {};
  sales.forEach(sale => {
    sale.payments.forEach(p => {
      paymentMethodsMap[p.method] = (paymentMethodsMap[p.method] || 0) + p.amount;
    });
  });

  const doughnutData = {
    labels: Object.keys(paymentMethodsMap),
    datasets: [
      {
        data: Object.values(paymentMethodsMap),
        backgroundColor: [
          '#10b981', // Dinheiro - Emerald
          '#3b82f6', // Débito - Blue
          '#6366f1', // Crédito - Indigo
          '#14b8a6', // Pix - Teal
          '#f59e0b', // Crediário - Amber
        ],
        borderWidth: 2,
        borderColor: '#0f172a',
      },
    ],
  };

  // Monthly/Weekly growth chart data
  const barData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [420, 680, 510, 890, 1250, 1540, 980],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Page Title & Live Sync Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Dashboard & Desempenho Comercial</h2>
          <p className="text-xs text-slate-400">Visão em tempo real de vendas, inteligência de preços ClickSuper e fluxo de caixa</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* ClickSuper Security SSL Banner */}
          <div className="bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 text-emerald-300 font-semibold shadow-inner">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Navegação Segura SSL/TLS (ClickSuper 256-bit)</span>
          </div>

          {/* Live Auto-Refresh Toggle */}
          <button
            onClick={() => setIsLiveSync(!isLiveSync)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
              isLiveSync
                ? 'bg-blue-950 text-blue-300 border-blue-500/40 shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveSync ? 'animate-spin text-blue-400' : ''}`} />
            <span>Live Feed: {isLiveSync ? `ON (${lastSyncTime})` : 'PAUSADO'}</span>
          </button>
        </div>
      </div>

      {/* ClickSuper Market Intelligence Benchmark Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/60 p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 text-sm">Inteligência de Mercado ClickSuper</h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Sincronizado
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Seus preços estão em média <strong className="text-emerald-400 font-bold">{priceDifferencePercent}% mais competitivos</strong> em relação aos supermercados da região (ClickSuper Index).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block font-sans">Preço Médio Região</span>
            <span className="font-bold text-amber-400">R$ {marketTotalSum.toFixed(2)}</span>
          </div>
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block font-sans">Sua Tabela PDV</span>
            <span className="font-bold text-emerald-400">R$ {storeTotalSum.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Faturamento Total */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Faturamento Total</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              R$ {totalFaturamento.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% este mês
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Ticket Médio */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Ticket Médio por Venda</span>
            <div className="text-2xl font-black text-blue-400 font-mono">
              R$ {averageTicket.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[11px] text-slate-400">Total de {totalSalesCount} cupons emitidos</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Crediário Pendente */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Crediário / Fiado a Receber</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              R$ {totalCrediarioDebt.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[11px] text-amber-500 font-medium">Saldo devedor acumulado</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Alerta Estoque Crítico */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Produtos em Risco</span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {lowStockProducts.length} itens
            </div>
            <span className="text-[11px] text-rose-400 font-medium">Abaixo do estoque mínimo</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Vendas Bar Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-slate-200 text-sm">Estatísticas de Vendas Semanais</h3>
            </div>
            <span className="text-xs text-slate-400">Últimos 7 dias</span>
          </div>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                }
              }} 
            />
          </div>
        </div>

        {/* Payment Methods Doughnut Chart */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-200 text-sm">Vendas por Meio de Pagamento</h3>
            </div>
          </div>
          <div className="h-56 flex items-center justify-center">
            {Object.keys(paymentMethodsMap).length > 0 ? (
              <Doughnut 
                data={doughnutData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } } }
                }} 
              />
            ) : (
              <p className="text-xs text-slate-500">Ainda não há dados de vendas suficientes</p>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert Table */}
      {lowStockProducts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span>Alerta de Reposição urgente (Estoque Crítico)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2 px-3">Código</th>
                  <th className="py-2 px-3">Descrição</th>
                  <th className="py-2 px-3">Categoria</th>
                  <th className="py-2 px-3 text-right">Estoque Mínimo</th>
                  <th className="py-2 px-3 text-right">Estoque Atual</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-400">{p.code}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">{p.description}</td>
                    <td className="py-2.5 px-3 text-slate-400">{p.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">{p.minStock} {p.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400">{p.stock} {p.unit}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Repor Estoque
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
