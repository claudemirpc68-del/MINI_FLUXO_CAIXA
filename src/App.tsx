import React, { useState, useEffect } from 'react';
import { NavigationTab, Product, Customer, Supplier, Sale, CashMovement, CashSession, AccountPayable, AccountReceivable, StoreSettings, CrediarioTransaction } from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { PDVView } from './components/PDV/PDVView';
import { DashboardView } from './components/Retaguarda/DashboardView';
import { ProductsView } from './components/Retaguarda/ProductsView';
import { CustomersView } from './components/Retaguarda/CustomersView';
import { SuppliersView } from './components/Retaguarda/SuppliersView';
import { FinanceView } from './components/Retaguarda/FinanceView';
import { CashRegisterView } from './components/Retaguarda/CashRegisterView';
import { ReportsView } from './components/Retaguarda/ReportsView';
import { BackupView } from './components/Retaguarda/BackupView';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('pdv');

  // State loaded from StorageService
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [crediarioTransactions, setCrediarioTransactions] = useState<CrediarioTransaction[]>([]);
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
  const [cashSession, setCashSession] = useState<CashSession>({} as CashSession);
  const [accountsPayable, setAccountsPayable] = useState<AccountPayable[]>([]);
  const [accountsReceivable, setAccountsReceivable] = useState<AccountReceivable[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({} as StoreSettings);

  const reloadAllData = () => {
    setProducts(StorageService.getProducts());
    setCustomers(StorageService.getCustomers());
    setSuppliers(StorageService.getSuppliers());
    setSales(StorageService.getSales());
    setCrediarioTransactions(StorageService.getCrediarioTransactions());
    setCashMovements(StorageService.getCashMovements());
    setCashSession(StorageService.getCashSession());
    setAccountsPayable(StorageService.getAccountsPayable());
    setAccountsReceivable(StorageService.getAccountsReceivable());
    setSettings(StorageService.getSettings());
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  // Handlers
  const handleSaveSale = (sale: Sale) => {
    StorageService.addSale(sale);
    reloadAllData();
  };

  const handleSaveProduct = (product: Product) => {
    StorageService.addOrUpdateProduct(product);
    reloadAllData();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
      StorageService.deleteProduct(id);
      reloadAllData();
    }
  };

  const handleSaveCustomer = (customer: Customer) => {
    StorageService.addOrUpdateCustomer(customer);
    reloadAllData();
  };

  const handleRecordCrediarioPayment = (customerId: string, amount: number, paymentMethod: string) => {
    StorageService.recordCrediarioPayment(customerId, amount, paymentMethod);
    reloadAllData();
  };

  const handleSaveSupplier = (supplier: Supplier) => {
    StorageService.addOrUpdateSupplier(supplier);
    reloadAllData();
  };

  const handleStockEntry = (productId: string, quantityAdded: number, newCostPrice?: number) => {
    const prods = StorageService.getProducts();
    const prod = prods.find(p => p.id === productId);
    if (prod) {
      prod.stock += quantityAdded;
      if (newCostPrice !== undefined && newCostPrice > 0) {
        prod.costPrice = newCostPrice;
      }
      StorageService.saveProducts(prods);
      reloadAllData();
    }
  };

  const handleSaveAccountPayable = (acc: AccountPayable) => {
    const list = StorageService.getAccountsPayable();
    list.unshift(acc);
    StorageService.saveAccountsPayable(list);
    reloadAllData();
  };

  const handleSaveAccountReceivable = (acc: AccountReceivable) => {
    const list = StorageService.getAccountsReceivable();
    list.unshift(acc);
    StorageService.saveAccountsReceivable(list);
    reloadAllData();
  };

  const handlePayBill = (id: string) => {
    const list = StorageService.getAccountsPayable();
    const item = list.find(a => a.id === id);
    if (item) {
      item.status = 'PAID';
      item.paymentDate = new Date().toISOString();
      StorageService.saveAccountsPayable(list);
      reloadAllData();
    }
  };

  const handleReceiveBill = (id: string) => {
    const list = StorageService.getAccountsReceivable();
    const item = list.find(a => a.id === id);
    if (item) {
      item.status = 'RECEIVED';
      item.receivedDate = new Date().toISOString();
      StorageService.saveAccountsReceivable(list);
      reloadAllData();
    }
  };

  const handleAddCashMovement = (type: 'SANGRIA' | 'SUPRIMENTO', amount: number, description: string) => {
    StorageService.addCashMovement({
      id: 'mov-' + Date.now(),
      type,
      amount,
      description,
      operator: settings.operatorName || 'SUPERVISOR',
      date: new Date().toISOString(),
    });
    reloadAllData();
  };

  const handleCloseCashSession = (realAmount: number) => {
    const session = StorageService.getCashSession();
    session.status = 'CLOSED';
    session.closedAt = new Date().toISOString();
    session.finalAmountReal = realAmount;
    StorageService.saveCashSession(session);
    reloadAllData();
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    StorageService.saveSettings(newSettings);
    reloadAllData();
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_my_fluxo_de_caixa_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonString: string): boolean => {
    const success = StorageService.importAllData(jsonString);
    if (success) {
      reloadAllData();
    }
    return success;
  };

  const handleResetDefault = () => {
    if (confirm('Atenção: Isso irá limpar todos os dados salvos localmente e restaurar os dados de demonstração padrão. Deseja continuar?')) {
      StorageService.resetToDefault();
      reloadAllData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
      />

      <main className="flex-1">
        {activeTab === 'pdv' && (
          <PDVView
            products={products}
            customers={customers}
            settings={settings}
            onSaveSale={handleSaveSale}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            sales={sales}
            products={products}
            customers={customers}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            customers={customers}
            crediarioTransactions={crediarioTransactions}
            onSaveCustomer={handleSaveCustomer}
            onRecordCrediarioPayment={handleRecordCrediarioPayment}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersView
            suppliers={suppliers}
            products={products}
            onSaveSupplier={handleSaveSupplier}
            onStockEntry={handleStockEntry}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            accountsPayable={accountsPayable}
            accountsReceivable={accountsReceivable}
            onSaveAccountPayable={handleSaveAccountPayable}
            onSaveAccountReceivable={handleSaveAccountReceivable}
            onPayBill={handlePayBill}
            onReceiveBill={handleReceiveBill}
          />
        )}

        {activeTab === 'cash_register' && (
          <CashRegisterView
            cashSession={cashSession}
            cashMovements={cashMovements}
            sales={sales}
            settings={settings}
            onAddCashMovement={handleAddCashMovement}
            onCloseCashSession={handleCloseCashSession}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            sales={sales}
            products={products}
            customers={customers}
          />
        )}

        {activeTab === 'backup' && (
          <BackupView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onResetDefault={handleResetDefault}
          />
        )}
      </main>
    </div>
  );
}

export default App;
