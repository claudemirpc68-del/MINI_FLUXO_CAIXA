import { 
  Product, 
  Customer, 
  Supplier, 
  Sale, 
  CashMovement, 
  CashSession, 
  AccountPayable, 
  AccountReceivable, 
  StoreSettings, 
  CrediarioTransaction 
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'my_fluxo_products_v1',
  CUSTOMERS: 'my_fluxo_customers_v1',
  SUPPLIERS: 'my_fluxo_suppliers_v1',
  SALES: 'my_fluxo_sales_v1',
  CREDIARIO: 'my_fluxo_crediario_v1',
  CASH_MOVEMENTS: 'my_fluxo_cash_movements_v1',
  CASH_SESSION: 'my_fluxo_cash_session_v1',
  ACCOUNTS_PAYABLE: 'my_fluxo_acc_payable_v1',
  ACCOUNTS_RECEIVABLE: 'my_fluxo_acc_receivable_v1',
  SETTINGS: 'my_fluxo_settings_v1',
};

// Initial Mock Data inspired by Veloz PDV reference image & supermarket standards
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-136',
    code: '136',
    description: 'BANANA NANICA C/ KG',
    category: 'Hortifruti',
    costPrice: 1.10,
    salePrice: 2.00,
    marketPrice: 2.49,
    stock: 45.5,
    minStock: 10,
    unit: 'KG',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-137',
    code: '7891000100137',
    description: 'LEITE EM PÓ INTEGRAL 400G',
    category: 'Laticínios',
    costPrice: 0.60,
    salePrice: 1.00,
    marketPrice: 1.25,
    stock: 120,
    minStock: 25,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-600201',
    code: '600201',
    description: 'GATEAU ALSACE GOURMET',
    category: 'Padaria',
    costPrice: 22.00,
    salePrice: 40.00,
    marketPrice: 44.90,
    stock: 15,
    minStock: 5,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-80',
    code: '7898000800080',
    description: 'TAÇA VINHO TINTO GALLA 250ML',
    category: 'Bebidas',
    costPrice: 1.50,
    salePrice: 2.80,
    marketPrice: 3.10,
    stock: 60,
    minStock: 15,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-102',
    code: '7894900011517',
    description: 'COCA-COLA LATA 350ML',
    category: 'Bebidas',
    costPrice: 1.20,
    salePrice: 2.18,
    marketPrice: 2.50,
    stock: 150,
    minStock: 30,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-200102',
    code: '200102',
    description: 'BRIOCHE PARISIENNE ARTESANAL',
    category: 'Padaria',
    costPrice: 1.10,
    salePrice: 2.20,
    marketPrice: 2.60,
    stock: 80,
    minStock: 20,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-273',
    code: '273',
    description: 'ABACAXI PÉROLA UN',
    category: 'Hortifruti',
    costPrice: 0.80,
    salePrice: 1.48,
    marketPrice: 1.99,
    stock: 35,
    minStock: 10,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-116',
    code: '116',
    description: 'AMEIXA SECA A VULSO KG',
    category: 'Hortifruti',
    costPrice: 6.00,
    salePrice: 10.56,
    marketPrice: 12.00,
    stock: 24.8,
    minStock: 5,
    unit: 'KG',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7891',
    code: '789100030001',
    description: 'ARROZ TIPO 1 5KG SUPERIOR',
    category: 'Mercearia',
    costPrice: 18.50,
    salePrice: 26.90,
    marketPrice: 29.90,
    stock: 40,
    minStock: 12,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7892',
    code: '789100030002',
    description: 'FEIJÃO CARIOCA 1KG',
    category: 'Mercearia',
    costPrice: 4.80,
    salePrice: 7.50,
    marketPrice: 8.20,
    stock: 85,
    minStock: 20,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896006700018',
    code: '7896006700018',
    description: 'ARROZ TIPO 1 CAMIL 5KG',
    category: 'Mercearia',
    costPrice: 19.50,
    salePrice: 28.90,
    marketPrice: 31.90,
    stock: 50,
    minStock: 10,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896006730114',
    code: '7896006730114',
    description: 'FEIJÃO CARIOCA CAMIL 1KG',
    category: 'Mercearia',
    costPrice: 5.20,
    salePrice: 8.50,
    marketPrice: 9.20,
    stock: 80,
    minStock: 15,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896007700017',
    code: '7896007700017',
    description: 'AÇÚCAR REFINADO UNIÃO 1KG',
    category: 'Mercearia',
    costPrice: 3.10,
    salePrice: 4.79,
    marketPrice: 5.29,
    stock: 100,
    minStock: 20,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896005800115',
    code: '7896005800115',
    description: 'CAFÉ TORRADO E MOÍDO PILÃO 500G',
    category: 'Mercearia',
    costPrice: 12.80,
    salePrice: 18.90,
    marketPrice: 20.50,
    stock: 45,
    minStock: 10,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896006800015',
    code: '7896006800015',
    description: 'ÓLEO DE SOJA LIZA 900ML',
    category: 'Mercearia',
    costPrice: 4.50,
    salePrice: 6.99,
    marketPrice: 7.49,
    stock: 120,
    minStock: 25,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896024800011',
    code: '7896024800011',
    description: 'SAL REFINADO CISNE 1KG',
    category: 'Mercearia',
    costPrice: 1.80,
    salePrice: 3.20,
    marketPrice: 3.60,
    stock: 60,
    minStock: 15,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7898215150013',
    code: '7898215150013',
    description: 'LEITE INTEGRAL PIRACANJUBA 1L',
    category: 'Laticínios',
    costPrice: 3.80,
    salePrice: 5.49,
    marketPrice: 5.99,
    stock: 150,
    minStock: 30,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896003700110',
    code: '7896003700110',
    description: 'MACARRÃO ESPAGUETE ADRIA 500G',
    category: 'Mercearia',
    costPrice: 2.70,
    salePrice: 4.39,
    marketPrice: 4.89,
    stock: 90,
    minStock: 20,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896004000103',
    code: '7896004000103',
    description: 'EXTRATO DE TOMATE ELEFANTE 340G',
    category: 'Mercearia',
    costPrice: 3.90,
    salePrice: 5.80,
    marketPrice: 6.40,
    stock: 75,
    minStock: 15,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896002100010',
    code: '7896002100010',
    description: 'FARINHA DE TRIGO DONA BENTA 1KG',
    category: 'Mercearia',
    costPrice: 3.80,
    salePrice: 5.99,
    marketPrice: 6.50,
    stock: 70,
    minStock: 15,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7891000062008',
    code: '7891000062008',
    description: 'BISCOITO PASSATEMPO CHOCOLATE 130G',
    category: 'Mercearia',
    costPrice: 2.10,
    salePrice: 3.49,
    marketPrice: 3.99,
    stock: 110,
    minStock: 25,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896030800012',
    code: '7896030800012',
    description: 'FLOCÃO DE MILHO MARATÁ 500G',
    category: 'Mercearia',
    costPrice: 1.60,
    salePrice: 2.99,
    marketPrice: 3.39,
    stock: 85,
    minStock: 20,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7891150040010',
    code: '7891150040010',
    description: 'SABÃO EM PÓ OMO LAVAGEM PERFEITA 800G',
    category: 'Limpeza',
    costPrice: 9.90,
    salePrice: 14.90,
    marketPrice: 16.50,
    stock: 65,
    minStock: 12,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7896098900013',
    code: '7896098900013',
    description: 'DETERGENTE LÍQUIDO YPÊ NEUTRO 500ML',
    category: 'Limpeza',
    costPrice: 1.50,
    salePrice: 2.49,
    marketPrice: 2.89,
    stock: 200,
    minStock: 40,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7891024130004',
    code: '7891024130004',
    description: 'CREME DENTAL COLGATE TOTAL 12 90G',
    category: 'Higiene',
    costPrice: 4.20,
    salePrice: 6.89,
    marketPrice: 7.50,
    stock: 95,
    minStock: 20,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7891024000017',
    code: '7891024000017',
    description: 'PAPEL HIGIÊNICO NEVE FOLHA DUPLA 4 UN',
    category: 'Higiene',
    costPrice: 6.20,
    salePrice: 9.90,
    marketPrice: 11.20,
    stock: 50,
    minStock: 10,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7894900010015',
    code: '7894900010015',
    description: 'REFRIGERANTE COCA-COLA PET 2L',
    category: 'Bebidas',
    costPrice: 6.80,
    salePrice: 9.99,
    marketPrice: 10.99,
    stock: 130,
    minStock: 25,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7891000025706',
    code: '7891000025706',
    description: 'ACHOCOLATADO EM PÓ NESCAU 2.0 370G',
    category: 'Mercearia',
    costPrice: 5.50,
    salePrice: 8.79,
    marketPrice: 9.50,
    stock: 75,
    minStock: 15,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7891515443000',
    code: '7891515443000',
    description: 'MANTEIGA QUALY COM SAL 500G',
    category: 'Laticínios',
    costPrice: 7.20,
    salePrice: 10.90,
    marketPrice: 11.90,
    stock: 40,
    minStock: 10,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5601007000016',
    code: '5601007000016',
    description: 'AZEITE DE OLIVA EXTRA VIRGEM GALLO 500ML',
    category: 'Mercearia',
    costPrice: 26.00,
    salePrice: 38.90,
    marketPrice: 42.00,
    stock: 30,
    minStock: 8,
    unit: 'UN',
    updatedAt: new Date().toISOString()
  }
];

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'João Carlos da Silva',
    cpfCnpj: '123.456.789-00',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 120 - Centro',
    creditLimit: 500.00,
    currentBalance: 145.50,
    notes: 'Cliente preferencial da padaria',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cust-2',
    name: 'Maria Oliveira Santos',
    cpfCnpj: '987.654.321-11',
    phone: '(11) 97654-3210',
    address: 'Av. Brasil, 450 - Bairro Novo',
    creditLimit: 1000.00,
    currentBalance: 0.00,
    notes: 'Paga sempre no dia 10',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cust-3',
    name: 'Mercado & Mercearia São José',
    cpfCnpj: '12.345.678/0001-90',
    phone: '(11) 3344-5566',
    address: 'Rua Principal, 88 - Industrial',
    creditLimit: 2500.00,
    currentBalance: 620.00,
    createdAt: new Date().toISOString()
  }
];

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    companyName: 'Distribuidora Alimentos Brasil Ltda',
    cnpj: '45.678.901/0001-23',
    phone: '(11) 4004-1234',
    email: 'vendas@alimentosbrasil.com.br',
    city: 'São Paulo/SP',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sup-2',
    companyName: 'Laticínios & Cia Vale Verde',
    cnpj: '67.890.123/0001-45',
    phone: '(11) 4004-5678',
    email: 'contato@valeverde.com.br',
    city: 'Campinas/SP',
    createdAt: new Date().toISOString()
  }
];

const MOCK_SETTINGS: StoreSettings = {
  storeName: 'SUPERMERCADOS PREÇO JUSTO',
  cnpj: '12.345.678/0001-99',
  phone: '(11) 3456-7890',
  address: 'Av. Paulista, 1000 - Bela Vista',
  cityState: 'São Paulo - SP',
  receiptHeaderMsg: '*** OBRIGADO PELA PREFERÊNCIA! ***',
  receiptFooterMsg: 'Volte sempre! Documento Sem Valor Fiscal.',
  drawerPort: 'COM1 (Menno MGI 40AC)',
  printerPaperWidth: '80mm',
  pixKey: '12.345.678/0001-99',
  operatorName: 'SUPERVISOR',
  pdvId: 'PDV-01'
};

const MOCK_SALES: Sale[] = [
  {
    id: 'sale-1001',
    receiptNumber: 1001,
    date: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    items: [
      {
        id: 'item-1',
        product: MOCK_PRODUCTS[0],
        quantity: 2.576,
        unitPrice: 2.00,
        discount: 0,
        totalPrice: 5.15
      },
      {
        id: 'item-2',
        product: MOCK_PRODUCTS[1],
        quantity: 2,
        unitPrice: 1.00,
        discount: 0,
        totalPrice: 2.00
      },
      {
        id: 'item-3',
        product: MOCK_PRODUCTS[4],
        quantity: 4,
        unitPrice: 2.18,
        discount: 0,
        totalPrice: 8.72
      }
    ],
    subtotal: 15.87,
    discount: 0,
    total: 15.87,
    payments: [{ method: 'DINHEIRO', amount: 20.00 }],
    changeGiven: 4.13,
    operator: 'SUPERVISOR',
    pdvId: 'PDV-01',
    status: 'COMPLETED'
  },
  {
    id: 'sale-1002',
    receiptNumber: 1002,
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      {
        id: 'item-4',
        product: MOCK_PRODUCTS[2],
        quantity: 1,
        unitPrice: 40.00,
        discount: 0,
        totalPrice: 40.00
      },
      {
        id: 'item-5',
        product: MOCK_PRODUCTS[3],
        quantity: 2,
        unitPrice: 2.80,
        discount: 0,
        totalPrice: 5.60
      }
    ],
    subtotal: 45.60,
    discount: 0,
    total: 45.60,
    payments: [{ method: 'PIX', amount: 45.60 }],
    changeGiven: 0,
    operator: 'SUPERVISOR',
    pdvId: 'PDV-01',
    status: 'COMPLETED'
  }
];

export class StorageService {
  // Products
  static getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      this.saveProducts(MOCK_PRODUCTS);
      return MOCK_PRODUCTS;
    }
    return JSON.parse(data);
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  static addOrUpdateProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id || p.code === product.code);
    if (index >= 0) {
      products[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      products.push({ ...product, updatedAt: new Date().toISOString() });
    }
    this.saveProducts(products);
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  }

  // Customers
  static getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!data) {
      this.saveCustomers(MOCK_CUSTOMERS);
      return MOCK_CUSTOMERS;
    }
    return JSON.parse(data);
  }

  static saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  static addOrUpdateCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      customers[index] = customer;
    } else {
      customers.push(customer);
    }
    this.saveCustomers(customers);
  }

  static updateCustomerBalance(customerId: string, amountChange: number): void {
    const customers = this.getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      customer.currentBalance = Math.max(0, customer.currentBalance + amountChange);
      this.saveCustomers(customers);
    }
  }

  // Suppliers
  static getSuppliers(): Supplier[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    if (!data) {
      this.saveSuppliers(MOCK_SUPPLIERS);
      return MOCK_SUPPLIERS;
    }
    return JSON.parse(data);
  }

  static saveSuppliers(suppliers: Supplier[]): void {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }

  static addOrUpdateSupplier(supplier: Supplier): void {
    const list = this.getSuppliers();
    const idx = list.findIndex(s => s.id === supplier.id);
    if (idx >= 0) {
      list[idx] = supplier;
    } else {
      list.push(supplier);
    }
    this.saveSuppliers(list);
  }

  // Sales
  static getSales(): Sale[] {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!data) {
      this.saveSales(MOCK_SALES);
      return MOCK_SALES;
    }
    return JSON.parse(data);
  }

  static saveSales(sales: Sale[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  static addSale(sale: Sale): void {
    const sales = this.getSales();
    sales.unshift(sale); // Latest first
    this.saveSales(sales);

    // Update product stock automatically
    const products = this.getProducts();
    sale.items.forEach(item => {
      const prod = products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    this.saveProducts(products);

    // If sale was on crediário, update customer debt balance
    if (sale.customerId) {
      const crediarioPayment = sale.payments.find(p => p.method === 'CREDIARIO');
      if (crediarioPayment && crediarioPayment.amount > 0) {
        this.updateCustomerBalance(sale.customerId, crediarioPayment.amount);
        this.addCrediarioTransaction({
          id: 'cred-' + Date.now(),
          customerId: sale.customerId,
          saleId: sale.id,
          type: 'DEBIT',
          amount: crediarioPayment.amount,
          date: sale.date,
          description: `Venda no Crediário (Cupom #${sale.receiptNumber})`
        });
      }
    }
  }

  // Crediário
  static getCrediarioTransactions(): CrediarioTransaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.CREDIARIO);
    return data ? JSON.parse(data) : [];
  }

  static addCrediarioTransaction(trans: CrediarioTransaction): void {
    const list = this.getCrediarioTransactions();
    list.unshift(trans);
    localStorage.setItem(STORAGE_KEYS.CREDIARIO, JSON.stringify(list));
  }

  static recordCrediarioPayment(customerId: string, amount: number, paymentMethod: string): void {
    this.updateCustomerBalance(customerId, -amount);
    this.addCrediarioTransaction({
      id: 'cred-' + Date.now(),
      customerId,
      type: 'CREDIT',
      amount,
      date: new Date().toISOString(),
      description: `Quitação de Débito (${paymentMethod})`,
      paymentMethod
    });
  }

  // Cash Movements & Session
  static getCashMovements(): CashMovement[] {
    const data = localStorage.getItem(STORAGE_KEYS.CASH_MOVEMENTS);
    return data ? JSON.parse(data) : [];
  }

  static addCashMovement(mov: CashMovement): void {
    const list = this.getCashMovements();
    list.unshift(mov);
    localStorage.setItem(STORAGE_KEYS.CASH_MOVEMENTS, JSON.stringify(list));
  }

  static getCashSession(): CashSession {
    const data = localStorage.getItem(STORAGE_KEYS.CASH_SESSION);
    if (!data) {
      const defaultSession: CashSession = {
        id: 'session-1',
        pdvId: 'PDV-01',
        operator: 'SUPERVISOR',
        openedAt: new Date().toISOString(),
        initialAmount: 150.00, // troco inicial
        status: 'OPEN'
      };
      this.saveCashSession(defaultSession);
      return defaultSession;
    }
    return JSON.parse(data);
  }

  static saveCashSession(session: CashSession): void {
    localStorage.setItem(STORAGE_KEYS.CASH_SESSION, JSON.stringify(session));
  }

  // Accounts Payable & Receivable
  static getAccountsPayable(): AccountPayable[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_PAYABLE);
    if (!data) {
      const initial: AccountPayable[] = [
        {
          id: 'ap-1',
          supplierName: 'Distribuidora Alimentos Brasil',
          description: 'Fatura de Reposição de Estoque',
          amount: 850.00,
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          status: 'PENDING',
          category: 'Mercadorias'
        },
        {
          id: 'ap-2',
          supplierName: 'Companhia de Energia Eletrica',
          description: 'Conta de Luz do Estabelecimento',
          amount: 320.40,
          dueDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
          status: 'PENDING',
          category: 'Despesas Fixas'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS_PAYABLE, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static saveAccountsPayable(items: AccountPayable[]): void {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_PAYABLE, JSON.stringify(items));
  }

  static getAccountsReceivable(): AccountReceivable[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_RECEIVABLE);
    if (!data) {
      const initial: AccountReceivable[] = [
        {
          id: 'ar-1',
          customerName: 'João Carlos da Silva',
          description: 'Venda Crediário Fatura #104',
          amount: 145.50,
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          status: 'PENDING'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS_RECEIVABLE, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static saveAccountsReceivable(items: AccountReceivable[]): void {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_RECEIVABLE, JSON.stringify(items));
  }

  // Settings
  static getSettings(): StoreSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(MOCK_SETTINGS));
      return MOCK_SETTINGS;
    }
    return JSON.parse(data);
  }

  static saveSettings(settings: StoreSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Backup & Restore
  static exportAllData(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      customers: this.getCustomers(),
      suppliers: this.getSuppliers(),
      sales: this.getSales(),
      crediario: this.getCrediarioTransactions(),
      cashMovements: this.getCashMovements(),
      cashSession: this.getCashSession(),
      accountsPayable: this.getAccountsPayable(),
      accountsReceivable: this.getAccountsReceivable(),
      settings: this.getSettings()
    };
    return JSON.stringify(payload, null, 2);
  }

  static importAllData(jsonString: string): boolean {
    try {
      const payload = JSON.parse(jsonString);
      if (payload.products) this.saveProducts(payload.products);
      if (payload.customers) this.saveCustomers(payload.customers);
      if (payload.suppliers) this.saveSuppliers(payload.suppliers);
      if (payload.sales) this.saveSales(payload.sales);
      if (payload.crediario) localStorage.setItem(STORAGE_KEYS.CREDIARIO, JSON.stringify(payload.crediario));
      if (payload.cashMovements) localStorage.setItem(STORAGE_KEYS.CASH_MOVEMENTS, JSON.stringify(payload.cashMovements));
      if (payload.cashSession) this.saveCashSession(payload.cashSession);
      if (payload.accountsPayable) this.saveAccountsPayable(payload.accountsPayable);
      if (payload.accountsReceivable) this.saveAccountsReceivable(payload.accountsReceivable);
      if (payload.settings) this.saveSettings(payload.settings);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  }

  static resetToDefault(): void {
    localStorage.clear();
  }
}
