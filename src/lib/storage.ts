// LocalStorage utilities with MongoDB-ready structure

import { Product, User, Order, CartItem, WishlistItem, Category } from '@/types';

const STORAGE_KEYS = {
  USERS: 'laceup_users',
  PRODUCTS: 'laceup_products',
  CART: 'laceup_cart',
  WISHLIST: 'laceup_wishlist',
  ORDERS: 'laceup_orders',
  CATEGORIES: 'laceup_categories',
  CURRENT_USER: 'laceup_current_user',
  ANALYTICS: 'laceup_analytics',
};

// Generic storage functions
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Generate MongoDB-like ObjectId
export const generateId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomPart = Math.random().toString(16).substring(2, 18);
  return timestamp + randomPart.padEnd(16, '0').substring(0, 16);
};

// User functions
export const getUsers = (): User[] => getItem(STORAGE_KEYS.USERS, []);
export const setUsers = (users: User[]): void => setItem(STORAGE_KEYS.USERS, users);

export const getCurrentUser = (): User | null => getItem(STORAGE_KEYS.CURRENT_USER, null);
export const setCurrentUser = (user: User | null): void => setItem(STORAGE_KEYS.CURRENT_USER, user);

export const createUser = (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): User => {
  const users = getUsers();
  const now = new Date().toISOString();
  const newUser: User = {
    ...userData,
    _id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  users.push(newUser);
  setUsers(users);
  return newUser;
};

export const findUserByEmail = (email: string): User | undefined => {
  return getUsers().find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(u => u._id === userId);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  setUsers(users);
  return users[index];
};

export const deleteUser = (userId: string): boolean => {
  const users = getUsers();
  const filtered = users.filter(u => u._id !== userId);
  if (filtered.length === users.length) return false;
  setUsers(filtered);
  return true;
};

// Product functions
export const getProducts = (): Product[] => getItem(STORAGE_KEYS.PRODUCTS, []);
export const setProducts = (products: Product[]): void => setItem(STORAGE_KEYS.PRODUCTS, products);

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find(p => p._id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return getProducts().find(p => p.slug === slug);
};

export const createProduct = (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Product => {
  const products = getProducts();
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...productData,
    _id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  products.push(newProduct);
  setProducts(products);
  return newProduct;
};

export const updateProduct = (productId: string, updates: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p._id === productId);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  setProducts(products);
  return products[index];
};

export const deleteProduct = (productId: string): boolean => {
  const products = getProducts();
  const filtered = products.filter(p => p._id !== productId);
  if (filtered.length === products.length) return false;
  setProducts(filtered);
  return true;
};

// Cart functions
export const getCart = (): CartItem[] => getItem(STORAGE_KEYS.CART, []);
export const setCart = (cart: CartItem[]): void => setItem(STORAGE_KEYS.CART, cart);

export const addToCart = (product: Product, quantity: number = 1, size?: string, color?: string): CartItem => {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.productId === product._id && item.size === size && item.color === color
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
    setCart(cart);
    return cart[existingIndex];
  }

  const newItem: CartItem = {
    _id: generateId(),
    productId: product._id,
    product,
    quantity,
    size,
    color,
  };
  cart.push(newItem);
  setCart(cart);
  return newItem;
};

export const updateCartItem = (itemId: string, quantity: number): CartItem | null => {
  const cart = getCart();
  const index = cart.findIndex(item => item._id === itemId);
  if (index === -1) return null;
  
  if (quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
  }
  setCart(cart);
  return cart[index] || null;
};

export const removeFromCart = (itemId: string): boolean => {
  const cart = getCart();
  const filtered = cart.filter(item => item._id !== itemId);
  if (filtered.length === cart.length) return false;
  setCart(filtered);
  return true;
};

export const clearCart = (): void => setCart([]);

// Wishlist functions
export const getWishlist = (): WishlistItem[] => getItem(STORAGE_KEYS.WISHLIST, []);
export const setWishlist = (wishlist: WishlistItem[]): void => setItem(STORAGE_KEYS.WISHLIST, wishlist);

export const addToWishlist = (product: Product): WishlistItem => {
  const wishlist = getWishlist();
  const existing = wishlist.find(item => item.productId === product._id);
  if (existing) return existing;

  const newItem: WishlistItem = {
    _id: generateId(),
    productId: product._id,
    product,
    addedAt: new Date().toISOString(),
  };
  wishlist.push(newItem);
  setWishlist(wishlist);
  return newItem;
};

export const removeFromWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.productId !== productId);
  if (filtered.length === wishlist.length) return false;
  setWishlist(filtered);
  return true;
};

export const isInWishlist = (productId: string): boolean => {
  return getWishlist().some(item => item.productId === productId);
};

// Order functions
export const getOrders = (): Order[] => getItem(STORAGE_KEYS.ORDERS, []);
export const setOrders = (orders: Order[]): void => setItem(STORAGE_KEYS.ORDERS, orders);

export const getUserOrders = (userId: string): Order[] => {
  return getOrders().filter(order => order.userId === userId);
};

export const createOrder = (orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Order => {
  const orders = getOrders();
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...orderData,
    _id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  orders.push(newOrder);
  setOrders(orders);
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status']): Order | null => {
  const orders = getOrders();
  const index = orders.findIndex(o => o._id === orderId);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
  setOrders(orders);
  return orders[index];
};

// Category functions
export const getCategories = (): Category[] => getItem(STORAGE_KEYS.CATEGORIES, []);
export const setCategories = (categories: Category[]): void => setItem(STORAGE_KEYS.CATEGORIES, categories);

// Calculate cart totals
export const getCartTotals = () => {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  return { subtotal, shipping, tax, total, itemCount: cart.length };
};
