export type NavigationTab = 
  | 'pdv' 
  | 'dashboard' 
  | 'products' 
  | 'customers' 
  | 'suppliers' 
  | 'finance' 
  | 'cash_register' 
  | 'reports' 
  | 'backup';

export interface Product {
  id: string;
  code: string; // Barcode EAN-13 or internal code
  description: string;
  category: string;
  costPrice: number;
  salePrice: number;
  marketPrice?: number; // ClickSuper regional market average price
  stock: number;
  minStock: number;
  unit: 'UN' | 'KG' | 'CX' | 'PCT' | 'LT';
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string;
  address: string;
  creditLimit: number;
  currentBalance: number; // Positive means debt in crediário
  notes?: string;
  createdAt: string;
}

export interface CrediarioTransaction {
  id: string;
  customerId: string;
  saleId?: string;
  type: 'DEBIT' | 'CREDIT'; // DEBIT = bought on credit, CREDIT = paid debt
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
}

export interface Supplier {
  id: string;
  companyName: string; // Razão Social / Nome Fantasia
  cnpj: string;
  phone: string;
  email: string;
  city: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export type PaymentMethod = 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'CREDIARIO';

export interface SalePayment {
  method: PaymentMethod;
  amount: number;
}

export interface Sale {
  id: string;
  receiptNumber: number;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  payments: SalePayment[];
  changeGiven: number; // Troco
  customerId?: string;
  customerName?: string;
  operator: string;
  pdvId: string;
  status: 'COMPLETED' | 'CANCELLED';
}

export interface CashMovement {
  id: string;
  type: 'SUPRIMENTO' | 'SANGRIA' | 'ABERTURA' | 'FECHAMENTO';
  amount: number;
  description: string;
  operator: string;
  date: string;
}

export interface CashSession {
  id: string;
  pdvId: string;
  operator: string;
  openedAt: string;
  closedAt?: string;
  initialAmount: number;
  finalAmountCalculated?: number;
  finalAmountReal?: number;
  difference?: number; // Quebra de caixa
  status: 'OPEN' | 'CLOSED';
}

export interface AccountPayable {
  id: string;
  supplierId?: string;
  supplierName: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  category: string;
}

export interface AccountReceivable {
  id: string;
  customerId?: string;
  customerName: string;
  description: string;
  amount: number;
  dueDate: string;
  receivedDate?: string;
  status: 'PENDING' | 'RECEIVED' | 'OVERDUE';
}

export interface StoreSettings {
  storeName: string;
  cnpj: string;
  phone: string;
  address: string;
  cityState: string;
  receiptHeaderMsg: string;
  receiptFooterMsg: string;
  drawerPort: string;
  printerPaperWidth: '80mm' | '58mm';
  pixKey: string;
  operatorName: string;
  pdvId: string;
}
