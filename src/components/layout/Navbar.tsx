import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const mainLinks = [
  { name: 'Home', path: '/' },
  { name: 'New Arrivals', path: '/shop?sort=newest' },
  { name: 'Men', path: '/shop?gender=men', hasDropdown: true },
  { name: 'Women', path: '/shop?gender=women', hasDropdown: true },
  { name: 'Brands', path: '/brands' },
  { name: 'Track Order', path: '/track-order' },
  { name: 'Sale', path: '/shop?sale=true', isHighlight: true },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch dynamic categories
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.filter((c: any) => c.isActive));
      } catch (error) {
        console.error('Navbar category fetch failed', error);
      }
    };
    fetchCategories();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans',
          isScrolled ? 'shadow-md' : ''
        )}
      >
        {/* Top Announcement Bar */}
        <div className="bg-[#1e1e2f] text-white py-2.5 px-4 text-xs font-medium tracking-wide">
          <div className="container-custom flex justify-between items-center">
            <p className="hidden md:block opacity-90">Free Express Shipping on orders over $150</p>
            <p className="md:hidden text-center w-full">Free Shipping over $150</p>
            <div className="hidden md:flex items-center gap-6 opacity-90">
              <Link to="/contact" className="hover:text-gray-300 transition-colors">Help Center</Link>
              <Link to="/track-order" className="hover:text-gray-300 transition-colors">Track Order</Link>
              {isAdmin && (
                <Link to="/admin" className="text-blue-300 hover:text-white transition-colors font-bold">Admin Panel</Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className={cn(
          "bg-white border-b border-gray-100 transition-all duration-300",
          isScrolled ? "py-2" : "py-4"
        )}>
          <div className="container-custom">
            <div className="flex items-center justify-between">

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <img
                  src="/assets/logo2.jpeg"
                  alt="LacedUp"
                  className={cn(
                    "object-contain transition-all duration-300",
                    isScrolled ? "h-8" : "h-10"
                  )}
                />
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-8 mx-8">
                {mainLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative group h-full"
                    onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={link.path}
                      className={cn(
                        "text-sm font-semibold uppercase tracking-wider py-4 border-b-2 border-transparent transition-all duration-200",
                        link.isHighlight ? "text-red-600 hover:border-red-600" : "text-gray-800 hover:text-black hover:border-black"
                      )}
                    >
                      {link.name}
                    </Link>

                    {/* Dropdown Menu */}
                    {link.hasDropdown && (
                      <div
                        className={cn(
                          'absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible',
                        )}
                      >
                        <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-6 min-w-[240px]">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Shop {link.name}</p>
                          <div className="space-y-3">
                            {categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                to={`/shop?category=${cat.slug}&gender=${link.name.toLowerCase()}`}
                                className="block text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-all"
                              >
                                {cat.name}
                              </Link>
                            ))}
                            <Link
                              to={`/shop?gender=${link.name.toLowerCase()}`}
                              className="block text-sm font-bold text-black pt-2 mt-2 border-t border-gray-100 hover:underline"
                            >
                              View All {link.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Right Icons */}
              <div className="flex items-center gap-2 md:gap-4">
                <button className="hidden md:flex p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                <Link to="/wishlist" className="hidden md:flex p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <div className="hidden md:block relative group z-50">
                  <Link
                    to={isAuthenticated ? '/profile' : '/login'}
                    className="flex p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>

                  {isAuthenticated && (
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white border border-gray-100 rounded-lg shadow-xl p-2 w-48">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                          My Profile
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md font-medium">
                            Admin Dashboard
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => {
                            logout();
                            navigate('/login');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-all duration-300',
          isMobileMenuOpen ? 'visible' : 'invisible'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            'absolute top-0 left-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-300',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <img src="/assets/logo2.jpeg" alt="LacedUp" className="h-8 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-6">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block text-lg font-medium",
                    link.isHighlight ? "text-red-500" : "text-gray-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
                <Link to="/login" className="flex items-center gap-3 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>My Account</span>
                </Link>
                <Link to="/wishlist" className="flex items-center gap-3 text-gray-600">
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
                <Link to="/contact" className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className={cn("transition-all duration-300", isScrolled ? "h-[100px]" : "h-[120px]")} />
    </>
  );
};
