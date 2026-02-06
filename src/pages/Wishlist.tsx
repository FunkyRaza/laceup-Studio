import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EmptyState } from '@/components/ui/empty-state';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const Wishlist: React.FC = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <EmptyState type="wishlist" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-custom py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Wishlist ({items.length})</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item._id} className="group relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-lg mb-4">
                <Link to={`/product/${item.product.slug}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-3 right-3 p-2 bg-background rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <button
                    onClick={() => addItem(item.product)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              <Link to={`/product/${item.product.slug}`}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {item.product.category.replace('-', ' ')}
                </p>
                <h3 className="font-medium group-hover:text-accent transition-colors line-clamp-1">
                  {item.product.name}
                </h3>
                <p className="font-semibold mt-1">₹{item.product.price.toFixed(2)}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
