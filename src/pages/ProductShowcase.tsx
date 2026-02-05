import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { getProducts } from '@/lib/storage';

const ProductShowcase: React.FC = () => {
  const products = getProducts().filter(p => p.isActive);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 md:py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Premium <span className="text-primary">Product Cards</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience luxury e-commerce design with our premium product cards. 
            Crafted for conversion, trust, and exceptional user experience.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-secondary/20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Design</h3>
              <p className="text-muted-foreground">
                Clean, modern aesthetics with professional spacing and typography that builds trust
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smooth Animations</h3>
              <p className="text-muted-foreground">
                Subtle hover effects, image zoom, and micro-interactions for engaging user experience
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-amber-500 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Pricing</h3>
              <p className="text-muted-foreground">
                Clear discount display, strike-through pricing, and savings calculation for better conversion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Premium Product Showcase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of premium products with enhanced card design. 
              Notice the smooth animations, clean layout, and professional presentation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="py-16 bg-secondary/10">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Excellence</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Design Principles</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Pixel-perfect alignment and spacing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Consistent typography hierarchy</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Professional color palette</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Thoughtful use of shadows and depth</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6">Performance Features</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Optimized image loading with lazy loading</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Smooth 60fps animations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mobile-responsive design</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Accessible color contrast</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductShowcase;