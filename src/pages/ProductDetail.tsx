import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, ChevronLeft, Truck, RefreshCcw, Shield, Star, MessageSquare, Send, User as UserIcon, ArrowRight, Edit, Trash2 } from 'lucide-react';
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

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const { data: foundProduct } = await api.get(`/products/slug/${slug}`);
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes?.[0]);
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
              <div className="aspect-square bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 group">
                <img
                  src={getImageUrl(product.images[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        'w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all duration-300',
                        selectedImage === i ? 'border-blue-600 scale-95' : 'border-white shadow-md'
                      )}
                    >
                      <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-8 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-black">{product.rating || 'New'}</span>
                    {product.reviews && <span className="text-[10px] font-bold text-slate-400">({product.reviews.length})</span>}
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">{product.name}</h1>

                <div className="flex items-end gap-4">
                  <span className="text-4xl font-black text-blue-600">₹{product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl text-slate-300 line-through font-bold">
                        ₹{product.oldPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-100">
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-slate-500 font-medium leading-relaxed text-lg">{product.description}</p>

              {/* Sizes and Colors Display */}
              <div className="space-y-6 py-6">
                {/* Available Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Available Colors</h4>
                      <span className="text-sm font-bold text-slate-500">{product.colors.length} options</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <div 
                          key={color.name}
                          className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer',
                            selectedColor === color.name ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'
                          )}
                          onClick={() => setSelectedColor(color.name)}
                        >
                          <div 
                            className="w-8 h-8 rounded-full border border-slate-200" 
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                          <span className="text-xs font-bold text-slate-700">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Available Sizes</h4>
                      <span className="text-sm font-bold text-slate-500">{product.sizes.length} options</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            'min-w-[60px] h-12 px-4 border-2 rounded-xl font-black text-base transition-all duration-300',
                            selectedSize === size
                              ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-4 text-sm">
                  {selectedSize && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                      <span className="font-bold text-blue-700">Selected Size:</span>
                      <span className="font-black text-blue-900">{selectedSize}</span>
                    </div>
                  )}
                  {selectedColor && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                      <span className="font-bold text-blue-700">Selected Color:</span>
                      <span className="font-black text-blue-900">{selectedColor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex items-center bg-white border border-slate-100 rounded-3xl p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center text-lg font-black text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-slate-900 hover:bg-black text-white font-black py-4 px-8 rounded-3xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    'p-5 border-2 rounded-3xl transition-all duration-300 group',
                    isWishlisted
                      ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-200'
                      : 'border-slate-100 bg-white text-slate-400 hover:border-red-500 hover:text-red-500'
                  )}
                >
                  <Heart className={cn('w-6 h-6', isWishlisted && 'fill-current')} />
                </button>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-3 gap-6 pt-10">
                <div className="text-center p-4 bg-white rounded-3xl border border-slate-50 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Free Shipping</p>
                </div>
                <div className="text-center p-4 bg-white rounded-3xl border border-slate-50 shadow-sm">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <RefreshCcw className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Easy Returns</p>
                </div>
                <div className="text-center p-4 bg-white rounded-3xl border border-slate-50 shadow-sm">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Secure Pay</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="bg-white border-y border-slate-100 py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Customer Feedback</h2>
                  <p className="text-slate-500 font-medium whitespace-pre-wrap">Real reviews from our premium customers</p>
                </div>
                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="text-center">
                    <p className="text-5xl font-black text-slate-900">{product.rating || 'N/A'}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Average Rating</p>
                  </div>
                  <div className="w-px h-12 bg-slate-200" />
                  <div className="text-center">
                    <p className="text-5xl font-black text-slate-900">{product.reviews?.length || 0}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Reviews</p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
                {/* Add Review Form */}
                <div className="lg:col-span-2">
                  <div className="sticky top-32 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      Write a Review
                    </h3>
                    {user ? (
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                className="group transition-transform hover:scale-110"
                              >
                                <Star
                                  className={cn(
                                    "w-8 h-8 transition-colors",
                                    s <= rating ? "text-amber-500 fill-current" : "text-slate-200"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Your Experience</label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell others about this product..."
                            required
                            rows={4}
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-medium text-slate-900 resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          <Send className="w-5 h-5" />
                          {submittingReview ? 'Sending...' : 'Submit Review'}
                        </button>
                      </form>
                    ) : (
                      <div className="text-center py-8">
                        <UserIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold mb-6">You must be signed in to leave a review</p>
                        <Link to="/login" className="inline-block bg-slate-900 text-white font-black px-8 py-3 rounded-2xl hover:bg-black transition-all">
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-3 space-y-10">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review._id} className="group relative pl-16">
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                          {review.userAvatar ? (
                            <img src={review.userAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-black">
                              {review.userName[0]}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-900">{review.userName}</h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < review.rating ? "text-amber-500 fill-current" : "text-slate-200"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50 group-hover:bg-slate-50 transition-colors">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    )).reverse()
                  ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                      <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-xl font-black text-slate-400">No reviews yet</h4>
                      <p className="text-slate-400 font-medium">Be the first to share your experience!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-slate-900 py-20 lg:py-32">
            <div className="container-custom">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tight mb-2 text-wrap">Complete Your Style</h2>
                  <p className="text-slate-400 font-medium">Handpicked recommendations just for you</p>
                </div>
                <Link to="/shop" className="hidden sm:flex items-center gap-2 text-white font-black hover:text-blue-400 transition-all group">
                  EXPLORE SHOP
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
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
