import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { getUserOrders, getOrders } from '@/lib/storage';
import { cn } from '@/lib/utils';

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
    if (user) {
      setOrders(getUserOrders(user._id));
    } else {
      // Show all orders for guests (in a real app, this would be different)
      setOrders(getOrders());
    }
  }, [user]);

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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-custom py-8 md:py-12">
        {successOrderId && (
          <div className="mb-8 p-6 bg-success/10 border border-success/20 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <p className="font-semibold text-success">Order Placed Successfully!</p>
                <p className="text-sm text-muted-foreground">Order ID: {successOrderId}</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <EmptyState type="orders" />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              
              return (
                <div key={order._id} className="border border-border rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-secondary/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Order ID</p>
                        <p className="font-medium">{order._id.slice(0, 12)}...</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className={cn('flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium', status.bg, status.color)}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-border">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                            {item.color && ` • Color: ${item.color}`}
                          </p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-secondary/30 px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
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
