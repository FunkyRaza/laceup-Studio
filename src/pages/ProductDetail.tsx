import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, ChevronLeft, Truck, RefreshCcw, Shield, Star, MessageSquare, Send, User as UserIcon, ArrowRight, Edit, Trash2, ZoomIn, Package, Award, Sparkles, Zap, Crown, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Product, Review } from '@/types';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { cn, getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
    
  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
    
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !showZoom) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const { data: foundProduct } = await api.get(`/products/slug/${slug}`);
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes?.[0] ? (typeof foundProduct.sizes[0] === 'object' ? foundProduct.sizes[0].name : foundProduct.sizes[0]) : undefined);
        setSelectedColor(foundProduct.colors?.[0]?.name);

        // Get related products
        const { data: allProducts } = await api.get('/products');
        const related = allProducts
          .filter((p: Product) => p.isActive && p._id !== foundProduct._id)
          .filter((p: Product) => {
            const prodCat = typeof foundProduct.category === 'object' ? foundProduct.category._id : foundProduct.category;
            const pCat = typeof p.category === 'object' ? p.category._id : p.category;
            return pCat === prodCat || p.gender === foundProduct.gender;
          })
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    setSelectedImage(0);
    setQuantity(1);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container-custom py-16">
          <div className="animate-pulse grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-200 rounded-[2.5rem]" />
            <div className="space-y-6">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-12 bg-slate-200 rounded w-3/4" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
              <div className="h-32 bg-slate-200 rounded-3xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Product Not Found</h1>
            <p className="text-slate-500 mb-8 font-medium">The product you're looking for doesn't exist.</p>
            <Link to="/shop" className="bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl hover:bg-black transition-all">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success('Added to cart!');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${product?._id}/reviews`, {
        rating,
        comment,
      });

      // Refresh product data
      const { data: updatedProduct } = await api.get(`/products/slug/${slug}`);
      setProduct(updatedProduct);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container-custom py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-blue-600 transition-all group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            GO BACK
          </button>
        </div>

        {/* Product Details */}
        <div className="container-custom pb-16">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Images */}
            <div className="space-y-6">
              <div 
                ref={imageRef}
                className="relative aspect-square bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 group cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={getImageUrl(product.images[selectedImage])}
                  alt={product.name}
                  onLoad={handleImageLoad}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Zoom Overlay */}
                {showZoom && imageLoaded && (
                  <div 
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at ${zoomPosition.x}% ${zoomPosition.y}%, transparent 100px, rgba(0,0,0,0.7) 200px)`
                    }}
                  >
                    <div className="flex items-center gap-2 text-white font-black px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                      <ZoomIn className="w-5 h-5" />
                      <span>Hover to Zoom</span>
                    </div>
                  </div>
                )}
                
                {/* Premium Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={cn(
                            "p-2 rounded-full backdrop-blur-sm transition-all duration-300",
                            isWishlisted 
                              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                              : "bg-white/20 text-white hover:bg-white/30"
                          )}
                        >
                          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setShowZoom(!showZoom)}
                          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle Zoom</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        'w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all duration-300 relative group',
                        selectedImage === i 
                          ? 'border-blue-600 scale-95 shadow-lg shadow-blue-200' 
                          : 'border-white shadow-md hover:shadow-lg hover:scale-105'
                      )}
                    >
                      <img 
                        src={getImageUrl(img)} 
                        alt={`View ${i + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      {selectedImage === i && (
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-8 py-4">
              {/* Premium Header */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-xs font-black uppercase tracking-widest border-0 shadow-lg">
                    <Package className="w-3 h-3 mr-1" />
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </Badge>
                              
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full border border-amber-200 shadow-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating || 0) ? "fill-amber-500 text-amber-500" : "text-amber-200"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-black text-amber-800 ml-2">
                      {product.rating ? product.rating.toFixed(1) : 'New'}
                    </span>
                    {product.reviews && product.reviews.length > 0 && (
                      <span className="text-xs font-bold text-amber-600">
                        ({product.reviews.length} reviews)
                      </span>
                    )}
                  </div>
                              
                  {product.featured && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 text-xs font-black uppercase tracking-widest border-0 animate-pulse">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
            
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {product.name}
                  </h1>
                              
                  <div className="flex flex-wrap items-end gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.oldPrice && (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl text-slate-400 line-through font-bold">
                            ₹{product.oldPrice.toLocaleString()}
                          </span>
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 text-xs font-black border-0 animate-pulse">
                            {discount}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                                
                    {product.stock > 0 && product.stock <= 5 ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-black border-0">
                        <Zap className="w-4 h-4 mr-1" />
                        In Stock ({product.stock} available)
                      </Badge>
                    ) : product.stock > 5 ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-black border-0">
                        <Zap className="w-4 h-4 mr-1" />
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="px-4 py-2 text-sm font-black">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            
              {/* Premium Description */}
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100/50">
                <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Product Details
                </h3>
                <p className="text-slate-700 font-medium leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Premium Sizes and Colors Display */}
              <div className="space-y-8 py-8">
                {/* Available Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
                        Available Colors
                      </h3>
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-bold">
                        {product.colors.filter(color => {
                          if (!color) return false;
                          const colorQuantity = typeof color === 'object' && color !== null && 'quantity' in color ? color.quantity : 0;
                          return colorQuantity > 0;
                        }).length} options
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {(product.colors || []).map((color) => {
                        if (!color) return null;
                        const colorCode = typeof color === 'object' && color !== null && 'code' in color ? color.code : '#000000';
                        const colorQuantity = typeof color === 'object' && color !== null && 'quantity' in color ? color.quantity : 0;
                                      
                        // Only show colors that have quantity > 0
                        if (colorQuantity <= 0) return null;
                                      
                        return (
                          <div 
                            key={color.name}
                            className={cn(
                              'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group relative overflow-hidden',
                              selectedColor === color.name 
                                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-200 scale-105' 
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                            )}
                            onClick={() => setSelectedColor(color.name)}
                          >
                            <div className="relative">
                              <div 
                                className="w-12 h-12 rounded-full border-2 border-white shadow-lg" 
                                style={{ backgroundColor: colorCode || '#000000' }}
                                title={color.name}
                              />
                              {selectedColor === color.name && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-black text-slate-800 group-hover:text-blue-700 transition-colors">
                              {color.name}
                            </span>
                            <div className="absolute bottom-1 right-1">
                              <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 font-bold">
                                {colorQuantity}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              
                {/* Available Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        Available Sizes
                      </h3>
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-bold">
                        {product.sizes.filter(size => {
                          if (!size) return false;
                          const sizeQuantity = typeof size === 'object' && size !== null && 'quantity' in size ? size.quantity : 0;
                          return sizeQuantity > 0;
                        }).length} options
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {product.sizes?.map((size, index) => {
                        if (!size) return null;
                        const sizeName = typeof size === 'object' && size !== null && 'name' in size ? size.name : String(size);
                        const sizeQuantity = typeof size === 'object' && size !== null && 'quantity' in size ? size.quantity : 0;
                                      
                        // Only show sizes that have quantity > 0
                        if (sizeQuantity <= 0) return null;
                                      
                        return (
                          <button
                            key={sizeName}
                            onClick={() => setSelectedSize(sizeName)}
                            className={cn(
                              'relative p-4 border-2 rounded-xl font-black text-base transition-all duration-300 group overflow-hidden',
                              selectedSize === sizeName
                                ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 scale-105' 
                                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                            )}
                          >
                            <span className="relative z-10">{sizeName}</span>
                            {selectedSize === sizeName && (
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20"></div>
                            )}
                            <div className="absolute top-1 right-1">
                              <Badge 
                                variant={selectedSize === sizeName ? "secondary" : "outline"} 
                                className="text-[8px] px-1.5 py-0.5 font-bold border-0"
                              >
                                {sizeQuantity}
                              </Badge>
                            </div>
                          </button>
                        );
                      }) || []}
                    </div>
                  </div>
                )}
              </div>

              {/* Premium Selection Display */}
              {(selectedSize || selectedColor) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Your Selection</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedSize && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-blue-200 shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-bold text-blue-700">Size:</span>
                        <span className="font-black text-blue-900">{selectedSize}</span>
                      </div>
                    )}
                    {selectedColor && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-blue-200 shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-bold text-blue-700">Color:</span>
                        <span className="font-black text-blue-900">{selectedColor}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Premium Quantity & Actions */}
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100/50">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  Add to Cart
                </h3>
                              
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Premium Quantity Selector */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex-1 max-w-xs">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-xl hover:bg-slate-100 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center text-lg font-black text-slate-900">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      disabled={quantity >= 99}
                      className="h-10 w-10 rounded-xl hover:bg-slate-100 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
              
                  {/* Premium Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !selectedColor || product.stock <= 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-6 px-8 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Add to Cart
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></div>
                  </Button>
              
                  {/* Premium Wishlist Button */}
                  <Button
                    variant="outline"
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      "px-6 py-6 border-2 rounded-2xl transition-all duration-300 group text-lg font-black",
                      isWishlisted
                        ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600 hover:shadow-xl hover:shadow-red-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-red-500 hover:text-red-500 hover:shadow-lg"
                    )}
                  >
                    <Heart className={cn('w-6 h-6', isWishlisted && 'fill-current group-hover:scale-110 transition-transform')} />
                  </Button>
                </div>
                              
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <p className="text-sm font-bold text-orange-800 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Only {product.stock} items left in stock!
                    </p>
                  </div>
                )}
              </div>

              {/* Premium Features */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-100/50">
                <h3 className="text-xl font-black text-slate-900 mb-6 text-center">Why Choose This Product</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Free Shipping</h4>
                    <p className="text-sm text-slate-600">On orders over ₹500</p>
                  </div>
                                
                  <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <RefreshCcw className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Easy Returns</h4>
                    <p className="text-sm text-slate-600">30-day return policy</p>
                  </div>
                                
                  <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Secure Payment</h4>
                    <p className="text-sm text-slate-600">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Reviews Section */}
        <section className="bg-gradient-to-b from-white to-slate-50 py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              {/* Premium Header */}
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-sm font-black uppercase tracking-widest border-0">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Customer Reviews
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
                  Real experiences from our valued customers
                </p>
              </div>
                      
              {/* Premium Stats */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100/50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-black text-white">
                      {product.rating ? product.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Average Rating</h3>
                </div>
                        
                <div className="hidden md:block w-px h-16 bg-slate-200"></div>
                        
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-black text-white">
                      {product.reviews?.length || 0}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Total Reviews</h3>
                </div>
                        
                <div className="hidden md:block w-px h-16 bg-slate-200"></div>
                        
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-black text-white">
                      {product.reviews?.filter(r => r.rating >= 4).length || 0}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Positive Reviews</h3>
                </div>
              </div>
        
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Premium Review Form */}
                <div className="lg:order-2">
                  <div className="sticky top-8 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-100/50 shadow-xl">
                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                      Share Your Experience
                    </h3>
                            
                    {user ? (
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        {/* Premium Rating Selector */}
                        <div>
                          <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Your Rating</label>
                          <div className="flex justify-center gap-2 p-4 bg-slate-50 rounded-2xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="group transition-transform hover:scale-110 focus:outline-none"
                              >
                                <Star
                                  className={cn(
                                    "w-10 h-10 transition-colors",
                                    star <= rating ? "text-amber-500 fill-current" : "text-slate-300"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                          <div className="text-center mt-2">
                            <span className="text-sm font-bold text-slate-600">
                              {rating === 1 && 'Poor'}
                              {rating === 2 && 'Fair'}
                              {rating === 3 && 'Good'}
                              {rating === 4 && 'Very Good'}
                              {rating === 5 && 'Excellent'}
                            </span>
                          </div>
                        </div>
                                
                        {/* Premium Comment Box */}
                        <div>
                          <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-3">Your Review</label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your experience with this product..."
                            required
                            rows={5}
                            className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-900 resize-none placeholder-slate-400"
                          />
                        </div>
                                
                        {/* Premium Submit Button */}
                        <Button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                          <Send className="w-5 h-5" />
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                          <UserIcon className="w-10 h-10 text-slate-500" />
                        </div>
                        <h4 className="text-xl font-black text-slate-700 mb-3">Sign in to leave a review</h4>
                        <p className="text-slate-500 font-medium mb-8">Share your experience with our community</p>
                        <Link to="/login" className="inline-block bg-gradient-to-r from-slate-900 to-black text-white font-black px-8 py-4 rounded-2xl hover:from-black hover:to-slate-800 transition-all shadow-lg hover:shadow-xl">
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
        
                {/* Premium Reviews List */}
                <div className="lg:order-1 space-y-8">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review._id} className="group relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-100/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        {/* Premium Avatar */}
                        <div className="absolute -top-6 left-8 w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-white shadow-lg">
                          {review.userAvatar ? (
                            <img src={review.userAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-black text-lg">
                              {review.userName?.[0] || 'U'}
                            </div>
                          )}
                        </div>
                                
                        <div className="space-y-4 pl-16">
                          {/* Premium Header */}
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <h4 className="text-xl font-black text-slate-900">{review.userName}</h4>
                            <div className="flex items-center gap-4">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-5 h-5",
                                      i < review.rating ? "text-amber-500 fill-current" : "text-slate-200"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                                  
                          {/* Premium Review Content */}
                          <div className="bg-white/50 rounded-2xl p-6 border border-slate-100/50">
                            <p className="text-slate-700 font-medium leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                                  
                          {/* Helpful Indicator */}
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Sparkles className="w-4 h-4" />
                            <span>Verified Purchase</span>
                          </div>
                        </div>
                      </div>
                    )).reverse()
                  ) : (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-12 h-12 text-slate-400" />
                      </div>
                      <h4 className="text-2xl font-black text-slate-600 mb-3">No reviews yet</h4>
                      <p className="text-slate-500 font-medium mb-8">Be the first to share your experience with this product!</p>
                      {!user && (
                        <Link to="/login" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black px-8 py-4 rounded-2xl hover:shadow-xl transition-all">
                          Sign in to review
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-gradient-to-b from-slate-900 to-black py-20 lg:py-32">
            <div className="container-custom">
              <div className="text-center mb-16">
                <Badge className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 text-sm font-black uppercase tracking-widest border-0">
                  <Crown className="w-4 h-4 mr-2" />
                  Complete Your Collection
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                  You Might Also Like
                </h2>
                <p className="text-slate-300 font-medium text-lg max-w-2xl mx-auto">
                  Handpicked recommendations to complement your style
                </p>
              </div>
                      
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((p) => (
                  <div key={p._id} className="group">
                    <ProductCard product={p} />
                    <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Link 
                        to={`/product/${p.slug}`}
                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black px-6 py-3 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
                      
              <div className="text-center mt-12">
                <Link 
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-white to-slate-100 text-slate-900 font-black px-8 py-4 rounded-2xl hover:shadow-2xl transition-all group"
                >
                  <span>Explore More Products</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
