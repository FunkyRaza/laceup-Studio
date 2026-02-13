// MongoDB-ready data structures

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  image?: string; // Main image from backend
  images: string[]; // Supports multiple images
  video?: string;
  category: string | Category; // flexible
  subCategory?: string;
  gender: 'Men' | 'Women' | 'Unisex';
  sizes?: string[];
  colors?: ProductColor[];
  stock: number;
  featured: boolean;
  isActive: boolean;
  discount?: number; // Discount percentage (0-100)

  // Additional Fields
  hsnCode?: string;
  brand?: string;
  quality?: string;
  tags?: string[];

  // Meta Options
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;

  reviews?: Review[];
  rating?: number;

  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface WishlistItem {
  _id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyRevenue: MonthlyData[];
  monthlyOrders: MonthlyData[];
  categoryPerformance: CategoryPerformance[];
  recentOrders: Order[];
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
  orders: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
