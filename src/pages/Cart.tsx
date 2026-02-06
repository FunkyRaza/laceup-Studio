import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight, ShoppingBag, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EmptyState } from '@/components/ui/empty-state';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const Cart: React.FC = () => {
  const { items, subtotal, shipping, tax, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Your cart is empty</h1>
            <p className="text-slate-500 mb-8 font-medium">Looks like you haven't added anything to your cart yet. Let's find something special for you.</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-200 transition-all duration-300 gap-2 group"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const freeShippingThreshold = 1000; // Updated to Rupees logic if needed, but keeping logic consistent
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container-custom py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
            <p className="text-slate-500 font-medium mt-1">You have {items.length} premium items in your cart</p>
          </div>
          <Link to="/shop" className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 transition-all group">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Progress */}
            {subtotal < freeShippingThreshold && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-bold text-slate-800">
                      Add <span className="text-blue-600">₹{(freeShippingThreshold - subtotal).toLocaleString()}</span> more for free delivery
                    </p>
                  </div>
                  <span className="text-sm font-black text-slate-400">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white border border-slate-100 rounded-[2rem] p-5 md:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col sm:flex-row gap-6"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="relative flex-shrink-0 w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:scale-[1.02] transition-transform duration-500"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.size && (
                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 flex items-center gap-1.5">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-6">
                      <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-black text-slate-900">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                Order Summary
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Subtotal</span>
                  <span className="text-slate-900 font-black">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <span className="text-slate-500 font-bold">Standard Delivery</span>
                  <span className={cn("font-black", shipping === 0 ? "text-green-600 uppercase text-xs" : "text-slate-900")}>
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-slate-500 font-bold">Estimated Tax</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">GST included (approx)</span>
                  </div>
                  <span className="text-slate-900 font-black">₹{tax.toLocaleString()}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-black text-slate-900">Total Amount</span>
                    <span className="text-3xl font-black text-blue-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <Link
                  to="/checkout"
                  className="w-full group bg-slate-900 hover:bg-black text-white font-black py-5 px-8 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center gap-2 py-4 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Secure Checkout Guaranteed</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-blue-800 leading-relaxed">
                  Join our premium loyalty program to earn rewards on this order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
