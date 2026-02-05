import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { getCart, setCart, addToCart as addToCartStorage, updateCartItem, removeFromCart, clearCart as clearCartStorage, getCartTotals } from '@/lib/storage';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 });

  const refreshCart = () => {
    setItems(getCart());
    setTotals(getCartTotals());
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addItem = (product: Product, quantity = 1, size?: string, color?: string) => {
    addToCartStorage(product, quantity, size, color);
    refreshCart();
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    updateCartItem(itemId, quantity);
    refreshCart();
  };

  const removeItem = (itemId: string) => {
    const item = items.find(i => i._id === itemId);
    removeFromCart(itemId);
    refreshCart();
    if (item) {
      toast.success(`${item.product.name} removed from cart`);
    }
  };

  const clearCart = () => {
    clearCartStorage();
    refreshCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: totals.itemCount,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
