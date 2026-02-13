import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/skeleton-loaders';
import { EmptyState } from '@/components/ui/empty-state';
import { Product } from '@/types';
import api from '@/lib/api';
import { Sparkles } from 'lucide-react';

const NewArrivals: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);

                // Get products from last 30 days, sorted by newest
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const newProducts = productsRes.data
                    .filter((p: Product) => p.isActive && new Date(p.createdAt) >= thirtyDaysAgo)
                    .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setProducts(newProducts);
                setCategories(categoriesRes.data.filter((c: any) => c.isActive));
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 md:py-24">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-semibold tracking-wide">JUST DROPPED</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                            New Arrivals
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            Discover the latest additions to our collection. Fresh styles, premium quality.
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="border-b border-gray-200 bg-white sticky top-[120px] z-40 shadow-sm">
                <div className="container-custom py-4">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${selectedCategory === 'all'
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Products
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${selectedCategory === category.name
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container-custom py-12">
                {loading ? (
                    <ProductGridSkeleton />
                ) : filteredProducts.length === 0 ? (
                    <EmptyState
                        type="search"
                        title="No New Arrivals Yet"
                        description="Check back soon for the latest products!"
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {filteredProducts.length} New {filteredProducts.length === 1 ? 'Product' : 'Products'}
                                </h2>
                                <p className="text-gray-600 mt-1">Added in the last 30 days</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {filteredProducts.map((product) => (
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

export default NewArrivals;
