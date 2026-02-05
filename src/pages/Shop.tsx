import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/skeleton-loaders';
import { EmptyState } from '@/components/ui/empty-state';
import { Product } from '@/types';
import { getProducts } from '@/lib/storage';
import { cn } from '@/lib/utils';

const categories = ['all', 'watches', 'shoes', 't-shirts', 'shirts'];
const genders = ['all', 'men', 'women'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  const genderFilter = searchParams.get('gender') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';
  const priceRange = {
    min: Number(searchParams.get('minPrice')) || 0,
    max: Number(searchParams.get('maxPrice')) || 1000,
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts(getProducts().filter(p => p.isActive));
      setLoading(false);
    }, 500);
  }, []);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || 
             p.description.toLowerCase().includes(query) ||
             p.category.toLowerCase().includes(query)
      );
    }

    // Category
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Gender
    if (genderFilter && genderFilter !== 'all') {
      result = result.filter(p => p.gender === genderFilter || p.gender === 'unisex');
    }

    // Price
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, searchQuery, categoryFilter, genderFilter, sortBy, priceRange]);

  const hasActiveFilters = categoryFilter !== 'all' || genderFilter !== 'all' || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-secondary/30 py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop All</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors',
              showFilters ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-secondary/30 rounded-lg p-6 mb-8 animate-slide-down">
            <div className="flex flex-wrap gap-8">
              {/* Category */}
              <div>
                <p className="font-medium mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm capitalize transition-colors',
                        categoryFilter === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border hover:border-primary'
                      )}
                    >
                      {cat === 't-shirts' ? 'T-Shirts' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <p className="font-medium mb-3">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {genders.map((g) => (
                    <button
                      key={g}
                      onClick={() => updateFilter('gender', g)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm capitalize transition-colors',
                        genderFilter === g
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border hover:border-primary'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                Search: {searchQuery}
                <button onClick={() => updateFilter('search', '')} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm capitalize">
                {categoryFilter}
                <button onClick={() => updateFilter('category', 'all')} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {genderFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm capitalize">
                {genderFilter}
                <button onClick={() => updateFilter('gender', 'all')} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState type="search" />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
