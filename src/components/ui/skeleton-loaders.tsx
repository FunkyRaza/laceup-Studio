import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const ProductCardSkeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-[70vh] bg-muted rounded-lg" />
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-muted rounded-lg" />
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-10 bg-muted rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-12 bg-muted rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};
