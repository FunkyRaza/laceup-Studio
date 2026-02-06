import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const brands = [
    { id: 1, name: 'Nike', slug: 'nike', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', description: 'Just Do It.' },
    { id: 2, name: 'Adidas', slug: 'adidas', image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', description: 'Impossible is Nothing.' },
    { id: 3, name: 'Puma', slug: 'puma', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Puma_logo.svg', description: 'Forever Faster.' },
    { id: 4, name: 'Reebok', slug: 'reebok', image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Reebok_2019_logo.svg', description: 'Be More Human.' },
    { id: 5, name: 'New Balance', slug: 'new-balance', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg', description: 'Fearlessly Independent.' },
    { id: 6, name: 'Converse', slug: 'converse', image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg', description: 'Shoes are Boring. Wear Sneakers.' },
    { id: 7, name: 'Vans', slug: 'vans', image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Vans_logo.svg', description: 'Off The Wall.' },
    { id: 8, name: 'Under Armour', slug: 'under-armour', image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg', description: 'I Will.' },
];

const Brands = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-12 bg-gray-50">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Our Brands</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the latest collections from the world's top sportswear and sneaker brands.
                    </p>
                </div>
            </div>

            {/* Brand Grid */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            to={`/shop?brand=${brand.slug}`}
                            className="group block bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="h-24 flex items-center justify-center mb-6">
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    className="h-16 w-auto max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{brand.description}</p>
                                <span className="inline-flex items-center text-sm font-semibold text-black group-hover:text-red-600 transition-colors">
                                    Shop Now <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Brands;
