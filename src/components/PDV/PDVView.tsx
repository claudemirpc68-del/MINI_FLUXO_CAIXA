import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Trash2, 
  Percent, 
  DollarSign, 
  PlusCircle, 
  CreditCard, 
  Scan, 
  Barcode,
  PackageCheck,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Product, CartItem, Customer, Sale, StoreSettings, SalePayment } from '../../types';
import { ProductSearchModal } from './ProductSearchModal';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { BulkInsertModal } from './BulkInsertModal';

interface PDVViewProps {
  products: Product[];
  customers: Customer[];
  settings: StoreSettings;
  onSaveSale: (sale: Sale) => void;
}

export const PDVView: React.FC<PDVViewProps> = ({
  products,
  customers,
  settings,
  onSaveSale,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [quantityMultiplier, setQuantityMultiplier] = useState<number>(1);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const [inputError, setInputError] = useState<string>('');
  const [selectedPdvCategory, setSelectedPdvCategory] = useState<string>('TODAS');

  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const cartTableRef = useRef<HTMLDivElement>(null);

  const handleBulkInsertProducts = () => {
    const targetCodes = [
      '7896006700018',
      '7896006730114',
      '7896007700017',
      '7896005800115',
      '7896006800015',
      '7896024800011',
      '7898215150013',
      '7896003700110',
      '7896004000103',
      '7896002100010',
      '7891000062008',
      '7896030800012',
      '7891150040010',
      '7896098900013',
      '7891024130004',
      '7891024000017',
      '7894900010015',
      '7891000025706',
      '7891515443000',
      '5601007000016',
    ];

    targetCodes.forEach((code) => {
      const p = products.find((prod) => prod.code === code);
      if (p) {
        addItemToCart(p, 1);
      }
    });

    setIsBulkModalOpen(true);
  };

  const handleBulkAddItems = (items: { product: Product; quantity: number }[]) => {
    items.forEach(({ product, quantity }) => {
      addItemToCart(product, quantity);
    });
  };

  // Focus input automatically
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, [isSearchOpen, isPaymentOpen, isReceiptOpen, isBulkModalOpen]);

  // Auto-scroll cart table to bottom whenever new products are added to the list
  useEffect(() => {
    if (cartTableRef.current) {
      cartTableRef.current.scrollTop = cartTableRef.current.scrollHeight;
    }
  }, [cart.length]);

  // Calculations
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalDiscount = (subtotal * discountPercent) / 100;
  const totalPurchase = Math.max(0, subtotal - totalDiscount);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interrupt modal typing
      if (isSearchOpen || isPaymentOpen || isReceiptOpen) {
        if (e.key === 'Escape') {
          setIsSearchOpen(false);
          setIsPaymentOpen(false);
          setIsReceiptOpen(false);
        }
        return;
      }

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          setIsSearchOpen(true);
          break;
        case 'F2':
          e.preventDefault();
          handleClearCart();
          break;
        case 'F3':
          e.preventDefault();
          if (selectedItemIndex !== null) {
            handleRemoveItem(selectedItemIndex);
          } else if (cart.length > 0) {
            handleRemoveItem(cart.length - 1);
          }
          break;
        case 'F4':
          e.preventDefault();
          handleToggleDiscount();
          break;
        case 'F5':
        case 'F6':
          e.preventDefault();
          if (cart.length > 0) {
            setIsPaymentOpen(true);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setBarcodeInput('');
          setQuantityMultiplier(1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, selectedItemIndex, isSearchOpen, isPaymentOpen, isReceiptOpen]);

  // Real-time update of quantity multiplier LCD display as user types 3* or 2.5x
  useEffect(() => {
    const rawInput = barcodeInput.trim();
    const match = rawInput.match(/^([\d\,\.]+)\s*[\*xX]/);
    if (match) {
      const parsedQty = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(parsedQty) && parsedQty > 0) {
        setQuantityMultiplier(parsedQty);
        return;
      }
    }
    setQuantityMultiplier(1);
  }, [barcodeInput]);

  // Handle Product Scan / Code Submission
  const handleProductSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError('');

    const rawInput = barcodeInput.trim();
    if (!rawInput) return;

    let qty = 1;
    let searchCode = rawInput;

    // Check for quantity multiplier pattern like "3*136", "3x136", "2,5*136"
    const match = rawInput.match(/^([\d\,\.]+)\s*[\*xX]\s*(.+)$/);
    if (match) {
      const parsedQty = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(parsedQty) && parsedQty > 0) {
        qty = parsedQty;
        searchCode = match[2].trim();
      }
    }

    if (!searchCode) return;

    // Find product by exact code, EAN or ID
    const product = products.find(
      (p) => p.code.toLowerCase() === searchCode.toLowerCase() || p.id === searchCode
    );

    if (!product) {
      setInputError(`Produto com código "${searchCode}" não encontrado! Use F1 para pesquisar por nome.`);
      setBarcodeInput('');
      setQuantityMultiplier(1);
      return;
    }

    // Add product to cart with calculated quantity
    addItemToCart(product, qty);
    setBarcodeInput('');
    setQuantityMultiplier(1);
  };

  const addItemToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty,
        };
        setSelectedItemIndex(existingIndex);
        return updated;
      } else {
        const newItem: CartItem = {
          id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          product,
          quantity,
          unitPrice: product.salePrice,
          discount: 0,
          totalPrice: product.salePrice * quantity,
        };
        setSelectedItemIndex(prev.length);
        return [...prev, newItem];
      }
    });

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 50);
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    setSelectedItemIndex(null);
  };

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      const item = updated[index];
      updated[index] = {
        ...item,
        quantity: newQty,
        totalPrice: item.unitPrice * newQty,
      };
      return updated;
    });
  };

  const handleClearCart = () => {
    if (cart.length > 0) {
      setCart([]);
      setDiscountPercent(0);
      setSelectedItemIndex(null);
    }
  };

  const handleToggleDiscount = () => {
    const disc = prompt('Digite a % de desconto global na compra (0 a 50%):', discountPercent.toString());
    if (disc !== null) {
      const num = parseFloat(disc);
      if (!isNaN(num) && num >= 0 && num <= 50) {
        setDiscountPercent(num);
      }
    }
  };

  // Complete Sale Callback from PaymentModal
  const handleCompleteSale = (
    payments: SalePayment[], 
    changeGiven: number, 
    customerId?: string, 
    customerName?: string
  ) => {
    const newSale: Sale = {
      id: 'sale-' + Date.now(),
      receiptNumber: Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: cart,
      subtotal,
      discount: totalDiscount,
      total: totalPurchase,
      payments,
      changeGiven,
      customerId,
      customerName,
      operator: settings.operatorName,
      pdvId: settings.pdvId,
      status: 'COMPLETED'
    };

    onSaveSale(newSale);
    setCompletedSale(newSale);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
    setCart([]);
    setDiscountPercent(0);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-4 md:p-6 flex flex-col gap-4">
      
      {/* Top Banner Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">SUPERMERCADO CAIXA LIVRE</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-slate-400">
          <span>ATALHOS: <strong className="text-blue-400">F1</strong> Busca | <strong className="text-blue-400">F5/F6</strong> Pagar | <strong className="text-blue-400">F3</strong> Rem. Item</span>
        </div>
      </div>

      {/* Main PDV Layout (Grid Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* LEFT COLUMN: LCD Displays, Mascot & Shortcut Keys */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* LCD QUANTITY MULTIPLIER DISPLAY */}
          <div 
            onClick={() => {
              const val = prompt('Digite a quantidade/multiplicador para os próximos itens (Ex: 3 ou 2.5):', quantityMultiplier.toString());
              if (val !== null) {
                const num = parseFloat(val.replace(',', '.'));
                if (!isNaN(num) && num > 0) {
                  setQuantityMultiplier(num);
                }
              }
            }}
            className="lcd-screen p-4 rounded-xl flex items-center justify-between border-2 border-emerald-900/60 hover:border-emerald-400/80 shadow-inner cursor-pointer transition-all group"
            title="Clique para editar o multiplicador de quantidade"
          >
            <div className="flex flex-col">
              <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Multiplicador:</span>
              <span className="text-[10px] text-emerald-400/70 font-semibold group-hover:text-emerald-300">✏️ Clique p/ alterar</span>
            </div>
            <span className="lcd-digits text-3xl font-extrabold">
              {quantityMultiplier.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} X
            </span>
          </div>

          {/* LCD TOTAL ITENS DISPLAY */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
            <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">TOTAL ITENS :</span>
            <span className="font-mono text-3xl font-black text-slate-100 bg-slate-950 px-4 py-1 rounded-lg border border-slate-800">
              {totalItemsCount.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* LCD TOT. COMPRA DISPLAY (BIG NEON DISPLAY) */}
          <div className="lcd-screen p-5 rounded-2xl flex flex-col justify-between border-4 border-emerald-700/80 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">
              <span>TOT. COMPRA:</span>
              {discountPercent > 0 && (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
                  Desconto {discountPercent}%
                </span>
              )}
            </div>
            <div className="lcd-digits text-4xl sm:text-5xl font-black text-right tracking-tight py-2">
              R$ {totalPurchase.toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* QUICK CATEGORIES PRODUCT CATALOG PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-slate-100 text-xs uppercase tracking-wider">Produtos por Categoria</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {products.filter((p) => selectedPdvCategory === 'TODAS' || p.category === selectedPdvCategory).length} itens
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {['TODAS', ...Array.from(new Set(products.map((p) => p.category)))].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedPdvCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                    selectedPdvCategory === cat
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid by Category */}
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {products
                .filter((p) => selectedPdvCategory === 'TODAS' || p.category === selectedPdvCategory)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      addItemToCart(p, quantityMultiplier > 1 ? quantityMultiplier : 1);
                      setQuantityMultiplier(1);
                    }}
                    className="bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-300 line-clamp-2 leading-tight">
                        {p.description}
                      </span>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700 shrink-0">
                        {p.unit}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono">
                      <span className="text-[10px] text-slate-500">{p.code.slice(-4)}</span>
                      <span className="text-xs font-black text-emerald-400">
                        R$ {p.salePrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative shadow-xl overflow-hidden min-h-[220px] flex-1">
            <div className="relative group">
              <img 
                src="/mascot.png" 
                alt="Mascote Supermercado PDV" 
                className="max-h-44 object-contain drop-shadow-2xl rounded-xl group-hover:scale-105 transition-transform"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="font-extrabold text-slate-200 text-sm">SUPERMERCADOS PREÇO JUSTO</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                Passe o leitor de código de barras ou pesquise pelo teclado com <strong className="text-blue-400">F1</strong>
              </p>
            </div>
          </div>

          {/* Shortcuts Reference Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1">
              Teclas do Operador
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
              <div><strong className="text-blue-400">|F1|</strong> Busca Produto</div>
              <div><strong className="text-emerald-400">|F5|</strong> Finalizar Venda</div>
              <div><strong className="text-blue-400">|F2|</strong> Nova Venda / Limpar</div>
              <div><strong className="text-amber-400">|F6|</strong> Venda Crediário</div>
              <div><strong className="text-rose-400">|F3|</strong> Cancelar Item</div>
              <div><strong className="text-purple-400">|ESC|</strong> Limpar Leitor</div>
              <div><strong className="text-amber-400">|F4|</strong> Aplicar Desconto</div>
              <div><strong className="text-slate-400">|Q*Cód|</strong> Multiplicar Qtd</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Barcode Input & Cart Item Table */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Barcode Scanner Input Form */}
          <form onSubmit={handleProductSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="w-6 h-6 absolute left-3.5 top-3.5 text-blue-400" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Código de Barras ou digite Ex: 3*136 (Qtd * Código)..."
                className="w-full bg-slate-900 border-2 border-blue-600/60 rounded-xl pl-12 pr-4 py-3 text-slate-100 text-base font-mono font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-500"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-blue-600/30 transition-all shrink-0"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Pesquisar (F1)</span>
            </button>

            <button
              type="button"
              onClick={handleBulkInsertProducts}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-3 rounded-xl flex items-center gap-1.5 text-xs shadow-lg shadow-emerald-700/30 transition-all shrink-0 border border-emerald-500/30"
              title="Inserir produtos em massa no carrinho"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">⚡ Inserir Produtos em Massa</span>
            </button>
          </form>

          {inputError && (
            <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Cart Table Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl min-h-[400px]">
            
            {/* Table Header */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 grid grid-cols-12 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              <span className="col-span-1">Item</span>
              <span className="col-span-2">Cód. Produto</span>
              <span className="col-span-4">Descrição</span>
              <span className="col-span-2 text-right">Qtde</span>
              <span className="col-span-1 text-right">Vr. Unit</span>
              <span className="col-span-2 text-right">Vr. Total</span>
            </div>

            {/* Table Scrollable Body */}
            <div ref={cartTableRef} className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 py-16">
                  <Scan className="w-16 h-16 mb-4 opacity-30 animate-pulse text-blue-500" />
                  <p className="text-lg font-bold text-slate-400">Caixa Pronto para Receber Itens</p>
                  <p className="text-xs text-slate-500 mt-1">Digite o código do produto ou aperte F1 para pesquisar</p>
                </div>
              ) : (
                cart.map((item, index) => {
                  const isSelected = selectedItemIndex === index;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemIndex(index)}
                      className={`grid grid-cols-12 items-center px-3 py-2.5 rounded-lg text-xs font-mono transition-colors cursor-pointer group ${
                        isSelected 
                          ? 'bg-blue-950/80 border border-blue-500/50 text-white font-bold' 
                          : 'hover:bg-slate-800/50 text-slate-200'
                      }`}
                    >
                      <span className="col-span-1 text-slate-500 font-bold">{(index + 1).toString().padStart(2, '0')}</span>
                      <span className="col-span-2 text-blue-400 font-bold">{item.product.code}</span>
                      <span className="col-span-4 font-sans font-semibold truncate pr-2">{item.product.description}</span>
                      <div className="col-span-2 flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(index, item.quantity - (item.product.unit === 'KG' ? 0.1 : 1))}
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-rose-200 flex items-center justify-center text-xs font-bold border border-slate-700 transition-colors shrink-0"
                          title="Diminuir quantidade"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step={item.product.unit === 'KG' ? '0.001' : '1'}
                          min="0.001"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) {
                              handleUpdateItemQuantity(index, val);
                            }
                          }}
                          className="w-16 bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded px-1 py-0.5 text-right font-mono font-bold text-amber-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(index, item.quantity + (item.product.unit === 'KG' ? 0.1 : 1))}
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-emerald-900/80 text-slate-300 hover:text-emerald-200 flex items-center justify-center text-xs font-bold border border-slate-700 transition-colors shrink-0"
                          title="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <span className="col-span-1 text-right text-slate-400">
                        {item.unitPrice.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="col-span-2 text-right font-extrabold text-emerald-400 text-sm">
                        {item.totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer Bar */}
            <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={cart.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 text-xs font-bold disabled:opacity-40 transition-colors"
                >
                  Cancelar Venda (F2)
                </button>
                
                {selectedItemIndex !== null && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(selectedItemIndex)}
                    className="px-3 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border border-amber-800/40 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover Item Selecionado (F3)</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(true)}
                  disabled={cart.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 text-sm flex items-center gap-2 transition-all"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>FINALIZAR PAGAMENTO (F5)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(product, customQty) => {
          const qty = customQty && customQty > 0 ? customQty : (quantityMultiplier > 1 ? quantityMultiplier : 1);
          addItemToCart(product, qty);
          setBarcodeInput('');
          setQuantityMultiplier(1);
        }}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        subtotal={subtotal}
        discount={totalDiscount}
        total={totalPurchase}
        customers={customers}
        onCompleteSale={handleCompleteSale}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        sale={completedSale}
        settings={settings}
      />

      <BulkInsertModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        products={products}
        onBulkAddItems={handleBulkAddItems}
      />
    </div>
  );
};
