/**
 * JDM Engine Specialists UK – App Context
 * Cart, wishlist, VAT toggle, deposit system, garage/fitment
 */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { JdmProduct, SAMPLE_PRODUCTS, calculateDeposit } from './jdm-catalog';

export interface CartItem {
  id: number;
  product: JdmProduct;
  qty: number;
}

export interface VehicleSpec {
  make: string;
  engine: string;
  chassis?: string;
}

interface AppContextType {
  products: JdmProduct[];
  saveProduct: (product: JdmProduct) => void;
  deleteProduct: (productId: number) => void;
  cart: CartItem[];
  wishlist: JdmProduct[];
  activeVehicle: VehicleSpec | null;
  vatInclusive: boolean;           // true = show inc. VAT; false = show ex. VAT
  depositPct: number;              // global deposit %, editable in admin
  addToCart: (product: JdmProduct, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQty: (productId: number, qty: number) => void;
  toggleWishlist: (product: JdmProduct) => void;
  setActiveVehicle: (vehicle: VehicleSpec | null) => void;
  setVatInclusive: (v: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  cartTotal: number;
  cartCount: number;
  cartDeposit: number;
  cartBalance: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<JdmProduct[]>(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<JdmProduct[]>([]);
  const [activeVehicle, setActiveVehicleState] = useState<VehicleSpec | null>(null);
  const [vatInclusive, setVatInclusiveState] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const depositPct = 10; // TODO: make configurable from admin settings

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('jdm_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedProducts = localStorage.getItem('jdm_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      const savedWishlist = localStorage.getItem('jdm_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      const savedVehicle = localStorage.getItem('jdm_active_vehicle');
      if (savedVehicle) setActiveVehicleState(JSON.parse(savedVehicle));
      const savedVat = localStorage.getItem('jdm_vat_inclusive');
      if (savedVat !== null) setVatInclusiveState(savedVat === 'true');
    } catch (e) {}
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addToCart = (product: JdmProduct, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      const updated = existing
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { id: product.id, product, qty }];
      localStorage.setItem('jdm_cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added to Basket: ${product.shortTitle}`, 'success');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== productId);
      localStorage.setItem('jdm_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQty = (productId: number, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(prev => {
      const updated = prev.map(i => i.id === productId ? { ...i, qty } : i);
      localStorage.setItem('jdm_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWishlist = (product: JdmProduct) => {
    setWishlist(prev => {
      const exists = prev.some(w => w.id === product.id);
      showToast(exists ? 'Removed from saved items' : 'Saved to wishlist', exists ? 'info' : 'success');
      const updated = exists ? prev.filter(w => w.id !== product.id) : [...prev, product];
      localStorage.setItem('jdm_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const saveProduct = (product: JdmProduct) => {
    setProducts(prev => {
      const exists = prev.some(item => item.id === product.id);
      const updated = exists ? prev.map(item => item.id === product.id ? product : item) : [product, ...prev];
      localStorage.setItem('jdm_products', JSON.stringify(updated));
      return updated;
    });
    showToast('Product saved on this device', 'success');
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem('jdm_products', JSON.stringify(updated));
      return updated;
    });
    showToast('Product removed from this device', 'info');
  };

  const setActiveVehicle = (vehicle: VehicleSpec | null) => {
    setActiveVehicleState(vehicle);
    if (vehicle) {
      localStorage.setItem('jdm_active_vehicle', JSON.stringify(vehicle));
      showToast(`Engine set: ${vehicle.engine}`, 'success');
    } else {
      localStorage.removeItem('jdm_active_vehicle');
    }
  };

  const setVatInclusive = (v: boolean) => {
    setVatInclusiveState(v);
    localStorage.setItem('jdm_vat_inclusive', String(v));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.priceIncVat * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const { deposit: cartDeposit, balance: cartBalance } = calculateDeposit(cartTotal, depositPct);

  return (
    <AppContext.Provider value={{
      products, saveProduct, deleteProduct,
      cart, wishlist, activeVehicle, vatInclusive, depositPct,
      addToCart, removeFromCart, updateCartQty, toggleWishlist,
      setActiveVehicle, setVatInclusive,
      toast, showToast,
      cartTotal, cartCount, cartDeposit, cartBalance,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
