import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-custom py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-2">Join the Club</h3>
            <p className="text-primary-foreground/70 mb-6">
              Subscribe to get early access to new collections, exclusive offers, and style updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40 transition-colors"
              />
              <button className="px-6 py-3 bg-primary-foreground text-primary font-medium rounded-lg hover:bg-primary-foreground/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              LACEUP
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Premium fashion essentials for the modern individual. Quality, style, and comfort.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/shop?category=watches" className="hover:text-primary-foreground transition-colors">Watches</Link></li>
              <li><Link to="/shop?category=shoes" className="hover:text-primary-foreground transition-colors">Shoes</Link></li>
              <li><Link to="/shop?category=t-shirts" className="hover:text-primary-foreground transition-colors">T-Shirts</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-primary-foreground transition-colors">Shirts</Link></li>
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
            <p>© 2024 LACEUP. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
