import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Settings, 
  Save, 
  Database, 
  Terminal, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { StoreSettings } from '../../types';

interface BackupViewProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => boolean;
  onResetDefault: () => void;
}

export const BackupView: React.FC<BackupViewProps> = ({
  settings,
  onSaveSettings,
  onExportBackup,
  onImportBackup,
  onResetDefault,
}) => {
  const [formSettings, setFormSettings] = useState<StoreSettings>({ ...settings });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [importStatusMsg, setImportStatusMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportBackup(content);
        if (success) {
          setImportStatusMsg({ type: 'success', msg: 'Backup importado e restaurado com sucesso!' });
        } else {
          setImportStatusMsg({ type: 'error', msg: 'Falha ao importar o arquivo de backup. Verifique a estrutura do arquivo JSON.' });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-100 tracking-tight">Configurações & Backup de Dados</h2>
        <p className="text-xs text-slate-400">Dados do estabelecimento, gaveta eletrônica Menno MGI 40AC e cópia de segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Store Settings Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-slate-100 text-base">Parâmetros da Empresa & Cupom</h3>
          </div>

          <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Nome Fantasia / Razão Social</label>
                <input
                  type="text"
                  required
                  value={formSettings.storeName}
                  onChange={(e) => setFormSettings({ ...formSettings, storeName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">CNPJ</label>
                <input
                  type="text"
                  required
                  value={formSettings.cnpj}
                  onChange={(e) => setFormSettings({ ...formSettings, cnpj: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Telefone Contato</label>
                <input
                  type="text"
                  value={formSettings.phone}
                  onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Chave Pix para QR Code</label>
                <input
                  type="text"
                  value={formSettings.pixKey}
                  onChange={(e) => setFormSettings({ ...formSettings, pixKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-teal-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Endereço Completo</label>
              <input
                type="text"
                value={formSettings.address}
                onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Identificador do PDV</label>
                <input
                  type="text"
                  value={formSettings.pdvId}
                  onChange={(e) => setFormSettings({ ...formSettings, pdvId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Porta da Gaveta Eletrônica</label>
                <input
                  type="text"
                  value={formSettings.drawerPort}
                  onChange={(e) => setFormSettings({ ...formSettings, drawerPort: e.target.value })}
                  placeholder="COM1 (Menno MGI 40AC)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Mensagem de Rodapé do Cupom</label>
              <input
                type="text"
                value={formSettings.receiptFooterMsg}
                onChange={(e) => setFormSettings({ ...formSettings, receiptFooterMsg: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            {saveSuccessMsg && (
              <div className="bg-emerald-950 text-emerald-400 border border-emerald-800 p-2.5 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>SALVAR CONFIGURAÇÕES</span>
            </button>
          </form>
        </div>

        {/* Right Column: Backup & Restore */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Backup Export Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-slate-100 text-base">Exportar Cópia de Segurança</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gere um arquivo `.json` contendo todo o seu catálogo de produtos, histórico de vendas, cadastro de clientes do crediário e movimento de caixa.
            </p>
            <button
              onClick={onExportBackup}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Download className="w-5 h-5" />
              <span>BAIXAR BACKUP DO SISTEMA</span>
            </button>
          </div>

          {/* Backup Import Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Upload className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-slate-100 text-base">Restaurar Backup Existente</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Selecione um arquivo de backup previamente salvo para restaurar a base de dados.
            </p>
            
            <label className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>SELECIONAR ARQUIVO BACKUP (.JSON)</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            {importStatusMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 font-semibold ${importStatusMsg.type === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                {importStatusMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{importStatusMsg.msg}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
