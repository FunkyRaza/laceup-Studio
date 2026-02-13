import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/skeleton-loaders';
import { EmptyState } from '@/components/ui/empty-state';
import { Product } from '@/types';
import api from '@/lib/api';
import { Percent, Clock } from 'lucide-react';

const Sale: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('discount');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);

                // Filter products on sale (you can add a 'onSale' or 'discount' field to your product model)
                const saleProducts = productsRes.data.filter(
                    (p: Product) => p.isActive && p.discount && p.discount > 0
                );

                setProducts(saleProducts);
                setCategories(categoriesRes.data.filter((c: any) => c.isActive));
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAndSortedProducts = () => {
        let result = selectedCategory === 'all'
            ? products
            : products.filter(p => p.category === selectedCategory);

        switch (sortBy) {
            case 'discount':
                return result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            case 'price-asc':
                return result.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return result.sort((a, b) => b.price - a.price);
            default:
                return result;
        }
    };

    const displayProducts = filteredAndSortedProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-pulse">
                            <Percent className="w-5 h-5" />
                            <span className="text-sm font-semibold tracking-wide">LIMITED TIME OFFER</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                            Sale
                        </h1>
                        <p className="text-lg md:text-2xl text-white/95 mb-6">
                            Up to 70% off on selected items
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">Hurry! Deals end soon</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 sticky top-[120px] z-40 shadow-sm">
                <div className="container-custom py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Category Filter */}
                        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-5 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${selectedCategory === 'all'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`px-5 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${selectedCategory === category.name
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="discount">Highest Discount</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container-custom py-12">
                {loading ? (
                    <ProductGridSkeleton />
                ) : displayProducts.length === 0 ? (
                    <EmptyState
                        type="search"
                        title="No Sale Items Available"
                        description="Check back soon for amazing deals!"
                    />
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {displayProducts.length} {displayProducts.length === 1 ? 'Item' : 'Items'} on Sale
                            </h2>
                            <p className="text-gray-600 mt-1">Save big on your favorite products</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {displayProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Sale;
