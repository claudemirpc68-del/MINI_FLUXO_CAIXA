import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  Receipt, 
  FileText, 
  Settings, 
  Clock, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { NavigationTab, StoreSettings } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  settings: StoreSettings;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, settings }) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR');
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentDateTime(`${dateStr} ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'pdv' as NavigationTab, label: 'PDV Caixa', icon: ShoppingCart, highlight: true },
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as NavigationTab, label: 'Produtos', icon: Package },
    { id: 'customers' as NavigationTab, label: 'Clientes / Fiado', icon: Users },
    { id: 'suppliers' as NavigationTab, label: 'Fornecedores', icon: Truck },
    { id: 'finance' as NavigationTab, label: 'Financeiro', icon: DollarSign },
    { id: 'cash_register' as NavigationTab, label: 'Caixa', icon: Receipt },
    { id: 'reports' as NavigationTab, label: 'Relatórios', icon: FileText },
    { id: 'backup' as NavigationTab, label: 'Config / Backup', icon: Settings },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-xl sticky top-0 z-40">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold tracking-wider uppercase">
            <Building2 className="w-4 h-4" />
            <span>{settings.storeName}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">CNPJ: {settings.cnpj}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{settings.pdvId} : {settings.operatorName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-mono bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentDateTime}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={() => setActiveTab('pdv')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                MY FLUXO DE CAIXA
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">PDV & Automação Comercial</p>
            </div>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? item.highlight
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400/50'
                      : 'bg-slate-800 text-blue-400 border border-blue-500/30 shadow-md'
                    : item.highlight
                    ? 'bg-blue-950/60 text-blue-300 hover:bg-blue-900/80 border border-blue-800/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
