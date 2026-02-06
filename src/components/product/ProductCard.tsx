import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, StarHalf } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Generate random rating for demo (4.0-5.0)
  const rating = 4.0 + Math.random() * 1.0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn(
      'group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500',
      'border border-border/50 hover:border-primary/20',
      'hover:-translate-y-1.5 animate-fade-in',
      className
    )}>
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
        <Link to={`/product/${product.slug}`} className="block h-full">
          <img
            src={product?.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {product?.images?.[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} - 2`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>

        {/* Premium Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <Badge
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-full shadow-lg',
                'bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground',
                'border-0 transform transition-all duration-300 hover:scale-105'
              )}
            >
              {discount}% OFF
            </Badge>
          )}
          {product.featured && (
            <Badge
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-full shadow-lg',
                'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-50',
                'border-0 transform transition-all duration-300 hover:scale-105'
              )}
            >
              FEATURED
            </Badge>
          )}
          {discount > 15 && (
            <Badge
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-full shadow-lg',
                'bg-gradient-to-r from-emerald-500 to-emerald-600 text-emerald-50',
                'border-0 animate-pulse'
              )}
            >
              HOT DEAL
            </Badge>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-10">
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={cn(
              'w-10 h-10 rounded-full shadow-lg backdrop-blur-sm border-0',
              'transition-all duration-300 hover:scale-110 hover:shadow-xl',
              isWishlisted
                ? 'bg-destructive/90 text-destructive-foreground hover:bg-destructive'
                : 'bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground'
            )}
          >
            <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
          </Button>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <div className="flex text-amber-400">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
            {hasHalfStar && <StarHalf className="w-3.5 h-3.5 fill-current text-amber-400" />}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-border" />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <Button
            onClick={() => addItem(product)}
            className={cn(
              'w-full py-3 rounded-xl font-semibold shadow-lg',
              'transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
              'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary',
              'text-primary-foreground border-0'
            )}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <Link to={`/product/${product.slug}`}>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category.replace('-', ' ')}
          </p>
          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">₹{product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.oldPrice.toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-semibold text-destructive">
                Save ${((product.compareAtPrice || 0) - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Colors:</span>
              <div className="flex gap-1.5">
                {product.colors.slice(0, 4).map((color) => (
                  <div
                    key={color.name}
                    className="w-5 h-5 rounded-full border-2 border-border shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                    +{product.colors.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}
      </Link>
    </div>

      {/* Hover Glow Effect */ }
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div >
  );
};
