import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Watches', slug: 'watches', gender: ['men', 'women'] },
  { name: 'Shoes', slug: 'shoes', gender: ['men', 'women'] },
  { name: 'T-Shirts', slug: 't-shirts', gender: ['men', 'women'] },
  { name: 'Shirts', slug: 'shirts', gender: ['men', 'women'] },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-background/95 backdrop-blur-md shadow-soft' : 'bg-background'
        )}
      >
        {/* Top Bar */}
        <div className="border-b border-border">
          <div className="container-custom">
            <div className="flex items-center justify-between h-10 text-xs text-muted-foreground">
              <p>Free shipping on orders over $100</p>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
                <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-foreground transition-colors font-medium">Admin Panel</Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-tight">
              LACEUP
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Men', 'Women'].map((gender) => (
                <div
                  key={gender}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(gender)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 py-2 text-sm font-medium hover:text-muted-foreground transition-colors">
                    {gender}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  
                  {/* Mega Menu */}
                  <div
                    className={cn(
                      'absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible transition-all duration-200',
                      activeDropdown === gender && 'opacity-100 visible'
                    )}
                  >
                    <div className="bg-background border border-border rounded-lg shadow-large p-6 min-w-[200px]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Categories</p>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/shop?category=${cat.slug}&gender=${gender.toLowerCase()}`}
                            className="block py-2 text-sm hover:text-accent transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <Link
                          to={`/shop?gender=${gender.toLowerCase()}`}
                          className="text-sm font-medium hover:text-accent transition-colors"
                        >
                          View All {gender}'s →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/shop" className="text-sm font-medium hover:text-muted-foreground transition-colors">
                All Products
              </Link>
              <Link to="/showcase" className="text-sm font-medium hover:text-muted-foreground transition-colors text-primary">
                Showcase
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Link to="/shop" className="p-2 hover:bg-secondary rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              
              <Link to="/wishlist" className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-all duration-300',
          isMobileMenuOpen ? 'visible' : 'invisible'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-foreground/20 transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            'absolute top-0 right-0 w-full max-w-sm h-full bg-background shadow-large transition-transform duration-300',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="pt-32 px-6 pb-6 h-full overflow-y-auto">
            <nav className="space-y-6">
              {['Men', 'Women'].map((gender) => (
                <div key={gender}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {gender}
                  </p>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/shop?category=${cat.slug}&gender=${gender.toLowerCase()}`}
                        className="block py-2 text-lg font-medium hover:text-accent transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <Link to="/shop" className="block py-2 text-lg font-medium">All Products</Link>
                <Link to="/showcase" className="block py-2 text-lg font-medium text-primary">Showcase</Link>
                <Link to="/about" className="block py-2 text-lg font-medium">About</Link>
                <Link to="/contact" className="block py-2 text-lg font-medium">Contact</Link>
                {isAdmin && (
                  <Link to="/admin" className="block py-2 text-lg font-medium text-accent">Admin Panel</Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[104px] lg:h-[120px]" />
    </>
  );
};
