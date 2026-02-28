import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/skeleton-loaders';
import { EmptyState } from '@/components/ui/empty-state';
import { Product } from '@/types';
import api from '@/lib/api';
import { Sparkles } from 'lucide-react';

const Women: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);

                const womenProducts = productsRes.data.filter(
                    (p: Product) => p.isActive && (p.gender?.toLowerCase() === 'women' || p.gender?.toLowerCase() === 'unisex')
                );

                setProducts(womenProducts);
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
            case 'price-asc':
                return result.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return result.sort((a, b) => b.price - a.price);
            case 'name':
                return result.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    };

    const displayProducts = filteredAndSortedProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white py-16 md:py-20">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold tracking-wide">WOMEN'S COLLECTION</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                            Women's Fashion
                        </h1>
                        <p className="text-lg md:text-xl text-white/90">
                            Discover elegance and style with our exclusive women's collection.
                        </p>
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
                                    ? 'bg-pink-600 text-white'
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
                                        ? 'bg-pink-600 text-white'
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
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-pink-600"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">Name A-Z</option>
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
                        title="No Women's Products Found"
                        description="Check back soon for new arrivals!"
                    />
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {displayProducts.length} {displayProducts.length === 1 ? 'Product' : 'Products'}
                            </h2>
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

export default Women;
