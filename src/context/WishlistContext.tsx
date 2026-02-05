import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem, Product } from '@/types';
import { getWishlist, addToWishlist as addToWishlistStorage, removeFromWishlist as removeFromWishlistStorage, isInWishlist as checkIsInWishlist } from '@/lib/storage';
import { toast } from 'sonner';

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const refreshWishlist = () => {
    setItems(getWishlist());
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const addItem = (product: Product) => {
    addToWishlistStorage(product);
    refreshWishlist();
    toast.success(`${product.name} added to wishlist`);
  };

  const removeItem = (productId: string) => {
    const item = items.find(i => i.productId === productId);
    removeFromWishlistStorage(productId);
    refreshWishlist();
    if (item) {
      toast.success(`${item.product.name} removed from wishlist`);
    }
  };

  const isInWishlist = (productId: string) => {
    return checkIsInWishlist(productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeItem(product._id);
    } else {
      addItem(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        addItem,
        removeItem,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
