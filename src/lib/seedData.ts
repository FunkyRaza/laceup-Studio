import { Product, Category, User } from '@/types';
import { generateId, getProducts, setProducts, getCategories, setCategories, getUsers, setUsers } from './storage';

const sampleProducts: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>[] = [
  // Watches
  {
    name: 'Classic Minimalist Watch',
    slug: 'classic-minimalist-watch',
    description: 'Elegant timepiece with a clean dial and premium leather strap. Perfect for any occasion.',
    price: 299,
    compareAtPrice: 399,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    ],
    category: 'watches',
    gender: 'unisex',
    stock: 50,
    featured: true,
    isActive: true,
  },
  {
    name: 'Luxury Chronograph',
    slug: 'luxury-chronograph',
    description: 'Premium stainless steel chronograph with sapphire crystal. A statement of refined taste.',
    price: 599,
    compareAtPrice: 799,
    images: [
      'https://images.unsplash.com/photo-1587836374828-a58e53f4be82?w=800',
    ],
    category: 'watches',
    gender: 'men',
    stock: 25,
    featured: true,
    isActive: true,
  },
  {
    name: 'Rose Gold Elegance',
    slug: 'rose-gold-elegance',
    description: 'Delicate rose gold watch with mother of pearl dial. Timeless feminine beauty.',
    price: 349,
    images: [
      'https://images.unsplash.com/photo-1549972574-8e3e1ed6a347?w=800',
    ],
    category: 'watches',
    gender: 'women',
    stock: 35,
    featured: false,
    isActive: true,
  },
  
  // Shoes
  {
    name: 'Premium Leather Sneakers',
    slug: 'premium-leather-sneakers',
    description: 'Handcrafted Italian leather sneakers with cushioned insole. Comfort meets luxury.',
    price: 249,
    compareAtPrice: 329,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
    ],
    category: 'shoes',
    gender: 'men',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
    ],
    stock: 100,
    featured: true,
    isActive: true,
  },
  {
    name: 'Minimalist Running Shoes',
    slug: 'minimalist-running-shoes',
    description: 'Lightweight performance shoes with responsive cushioning. Designed for speed.',
    price: 189,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    ],
    category: 'shoes',
    gender: 'unisex',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Red', hex: '#EF4444' },
      { name: 'Blue', hex: '#3B82F6' },
    ],
    stock: 150,
    featured: true,
    isActive: true,
  },
  {
    name: 'Elegant Heels',
    slug: 'elegant-heels',
    description: 'Sophisticated stiletto heels with padded footbed. Grace with every step.',
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    ],
    category: 'shoes',
    gender: 'women',
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Nude', hex: '#E8D4C4' },
    ],
    stock: 45,
    featured: false,
    isActive: true,
  },
  
  // T-Shirts
  {
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    description: 'Premium Pima cotton t-shirt with perfect fit. The foundation of every wardrobe.',
    price: 59,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    ],
    category: 't-shirts',
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A5F' },
    ],
    stock: 200,
    featured: true,
    isActive: true,
  },
  {
    name: 'Oversized Graphic Tee',
    slug: 'oversized-graphic-tee',
    description: 'Relaxed fit t-shirt with minimalist graphic print. Street style essential.',
    price: 79,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    ],
    category: 't-shirts',
    gender: 'unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Off White', hex: '#FAF9F6' },
      { name: 'Charcoal', hex: '#36454F' },
    ],
    stock: 120,
    featured: false,
    isActive: true,
  },
  {
    name: 'Fitted V-Neck Tee',
    slug: 'fitted-v-neck-tee',
    description: 'Soft modal blend v-neck with flattering silhouette. Everyday elegance.',
    price: 49,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
    ],
    category: 't-shirts',
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blush', hex: '#DE5D83' },
    ],
    stock: 180,
    featured: false,
    isActive: true,
  },
  
  // Shirts
  {
    name: 'Oxford Button-Down',
    slug: 'oxford-button-down',
    description: 'Classic Oxford cloth button-down shirt. Timeless American style.',
    price: 129,
    compareAtPrice: 169,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    ],
    category: 'shirts',
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Light Blue', hex: '#ADD8E6' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    stock: 75,
    featured: true,
    isActive: true,
  },
  {
    name: 'Linen Summer Shirt',
    slug: 'linen-summer-shirt',
    description: 'Breathable pure linen shirt for warm days. Relaxed Mediterranean style.',
    price: 149,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800',
    ],
    category: 'shirts',
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Natural', hex: '#F5F5DC' },
      { name: 'Olive', hex: '#808000' },
    ],
    stock: 60,
    featured: false,
    isActive: true,
  },
  {
    name: 'Silk Blouse',
    slug: 'silk-blouse',
    description: 'Luxurious silk blouse with subtle sheen. Effortless sophistication.',
    price: 199,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800',
    ],
    category: 'shirts',
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Champagne', hex: '#F7E7CE' },
    ],
    stock: 40,
    featured: true,
    isActive: true,
  },
];

const sampleCategories: Omit<Category, '_id'>[] = [
  {
    name: 'Watches',
    slug: 'watches',
    description: 'Timeless timepieces for every occasion',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    isActive: true,
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Step into style with our curated collection',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    isActive: true,
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Essential comfort meets modern design',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    isActive: true,
  },
  {
    name: 'Shirts',
    slug: 'shirts',
    description: 'Refined shirts for the discerning individual',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    isActive: true,
  },
];

export const seedData = () => {
  // Seed products if empty
  if (getProducts().length === 0) {
    const now = new Date().toISOString();
    const products: Product[] = sampleProducts.map(product => ({
      ...product,
      _id: generateId(),
      createdAt: now,
      updatedAt: now,
    }));
    setProducts(products);
  }

  // Seed categories if empty
  if (getCategories().length === 0) {
    const categories: Category[] = sampleCategories.map(category => ({
      ...category,
      _id: generateId(),
    }));
    setCategories(categories);
  }

  // Create admin user if no users exist
  if (getUsers().length === 0) {
    const now = new Date().toISOString();
    const adminUser: User = {
      _id: generateId(),
      email: 'admin@laceup.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    };
    setUsers([adminUser]);
  }
};
