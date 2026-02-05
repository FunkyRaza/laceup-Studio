import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCcw, Headphones } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Product, Category } from '@/types';
import { getProducts, getCategories } from '@/lib/storage';
import { seedData } from '@/lib/seedData';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: RefreshCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support' },
];

const Index: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    seedData();
    setProducts(getProducts().filter(p => p.isActive));
    setCategories(getCategories());
  }, []);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <p className="text-accent font-medium mb-4 tracking-wider uppercase">New Collection 2024</p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Elevate Your
              <span className="block text-accent">Style</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Discover premium fashion essentials crafted for the modern individual. Quality meets sophistication.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary rounded-lg inline-flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/shop?category=new" className="btn-outline rounded-lg">
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Explore our curated collections for every occasion
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-primary-foreground mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-primary-foreground/70 group-hover:text-primary-foreground transition-colors flex items-center gap-1">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked favorites you'll love</p>
            </div>
            <Link to="/shop?featured=true" className="hidden md:flex items-center gap-2 font-medium hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop?featured=true" className="btn-outline rounded-lg inline-flex items-center gap-2">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920"
              alt="Summer Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container-custom">
                <div className="max-w-lg text-primary-foreground">
                  <p className="text-accent font-medium mb-4 tracking-wider uppercase">Limited Edition</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Summer Collection</h2>
                  <p className="text-lg text-primary-foreground/80 mb-8">
                    Embrace the season with our exclusive summer pieces. Limited stock available.
                  </p>
                  <Link to="/shop" className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/90 transition-colors">
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">The latest additions to our collection</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 font-medium hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-4xl md:text-5xl font-light leading-relaxed mb-8">
              "LACEUP has completely transformed my wardrobe. The quality is exceptional and the styles are timeless."
            </p>
            <div>
              <p className="font-semibold">Alexandra Chen</p>
              <p className="text-sm text-muted-foreground">Fashion Editor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">@laceup</h2>
            <p className="text-muted-foreground">Follow us on Instagram for daily inspiration</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product, i) => (
              <a
                key={i}
                href="#"
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={product.images[0]}
                  alt="Instagram"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                  <span className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    View Post
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
