import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import api from '@/lib/api';
import { cn, getImageUrl } from '@/lib/utils';

const statusConfig = {
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
};

const Orders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);

  const successOrderId = searchParams.get('success');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Link to="/login" className="btn-primary rounded-lg">
            Sign In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="container-custom py-8 md:py-12">
        {successOrderId && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Order Placed Successfully!</p>
              <p className="text-sm text-green-700">Order ID: <span className="font-mono font-medium">{successOrderId}</span></p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track your recent purchases</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <EmptyState type="orders" />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div key={order._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Order Header */}
                  <div className="bg-gray-50/50 p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Placed</p>
                      <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</p>
                      <p className="font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2 flex flex-col md:items-end justify-center">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order ID: <span className="font-mono text-gray-700">{order._id.slice(0, 12)}...</span></p>
                      <div className="flex gap-3 mt-1">
                        <Link to={`/track-order?id=${order._id}`}>
                          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm">
                            <Truck className="w-4 h-4" />
                            Track Order
                          </button>
                        </Link>
                        {/* Status Badge */}
                        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border', status.bg, status.color, status.color.replace('text-', 'border-').replace('500', '200').replace('success', 'success/20').replace('warning', 'warning/20').replace('destructive', 'destructive/20'))}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-6 items-start">
                          <div className="relative group shrink-0">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-xl border border-gray-100 shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                              <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">Premium quality product from LacedUp. Delivered with care.</p>

                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                Qty: {item.quantity}
                              </span>
                              {item.size && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  Color: {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer / Address */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-700 shrink-0">Shipping to:</span>
                      <span>
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
