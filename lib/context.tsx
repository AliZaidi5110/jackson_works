"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './catalog';
import { VehicleSpec } from './vrm';

export interface CartItem {
  id: number;
  product: Product;
  qty: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  activeVehicle: VehicleSpec | null;
  savedGarage: VehicleSpec[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQty: (productId: number, qty: number) => void;
  toggleWishlist: (product: Product) => void;
  setActiveVehicle: (vehicle: VehicleSpec | null) => void;
  addToGarage: (vehicle: VehicleSpec) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<VehicleSpec | null>(null);
  const [savedGarage, setSavedGarage] = useState<VehicleSpec[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    try {
      let savedCart = localStorage.getItem('apex_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      let savedVehicle = localStorage.getItem('apex_active_vehicle');
      if (savedVehicle) setActiveVehicle(JSON.parse(savedVehicle));
      let savedGarageData = localStorage.getItem('apex_garage');
      if (savedGarageData) setSavedGarage(JSON.parse(savedGarageData));
    } catch(e) {}
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addToCart = (product: Product, qty = 1) => {
    setCart(prev => {
      let existing = prev.find(i => i.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      } else {
        updated = [...prev, { id: product.id, product, qty }];
      }
      localStorage.setItem('apex_cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added to Basket: ${product.title}`, 'success');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      let updated = prev.filter(i => i.id !== productId);
      localStorage.setItem('apex_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      let updated = prev.map(i => i.id === productId ? { ...i, qty } : i);
      localStorage.setItem('apex_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      let exists = prev.some(w => w.id === product.id);
      let updated = exists ? prev.filter(w => w.id !== product.id) : [...prev, product];
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist', exists ? 'info' : 'success');
      return updated;
    });
  };

  const handleSetActiveVehicle = (vehicle: VehicleSpec | null) => {
    setActiveVehicle(vehicle);
    if (vehicle) {
      localStorage.setItem('apex_active_vehicle', JSON.stringify(vehicle));
      showToast(`Active Vehicle: ${vehicle.make} ${vehicle.model}`, 'success');
    } else {
      localStorage.removeItem('apex_active_vehicle');
    }
  };

  const addToGarage = (vehicle: VehicleSpec) => {
    setSavedGarage(prev => {
      if (prev.some(v => v.vrm === vehicle.vrm && v.model === vehicle.model)) return prev;
      let updated = [vehicle, ...prev];
      localStorage.setItem('apex_garage', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      cart, wishlist, activeVehicle, savedGarage,
      addToCart, removeFromCart, updateCartQty, toggleWishlist,
      setActiveVehicle: handleSetActiveVehicle, addToGarage, toast, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
