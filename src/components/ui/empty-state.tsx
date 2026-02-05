import React from 'react';
import { ShoppingBag, Heart, Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'orders' | 'search';
  title?: string;
  description?: string;
  className?: string;
}

const config = {
  cart: {
    icon: ShoppingBag,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added anything to your cart yet.',
    action: { label: 'Start Shopping', to: '/shop' },
  },
  wishlist: {
    icon: Heart,
    title: 'Your wishlist is empty',
    description: 'Save items you love to your wishlist.',
    action: { label: 'Discover Products', to: '/shop' },
  },
  orders: {
    icon: Package,
    title: 'No orders yet',
    description: 'When you place orders, they\'ll appear here.',
    action: { label: 'Start Shopping', to: '/shop' },
  },
  search: {
    icon: Search,
    title: 'No products found',
    description: 'Try adjusting your search or filter to find what you\'re looking for.',
    action: { label: 'Clear Filters', to: '/shop' },
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  className,
}) => {
  const { icon: Icon, title: defaultTitle, description: defaultDesc, action } = config[type];

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title || defaultTitle}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description || defaultDesc}</p>
      <Link to={action.to} className="btn-primary rounded-lg">
        {action.label}
      </Link>
    </div>
  );
};
