import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { getOrders } from '@/lib/storage';
import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";

const steps = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const TrackOrder = () => {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get('id') || '');
    const [order, setOrder] = useState<Order | null>(null);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setOrderId(id);
            handleSearch(id);
        }
    }, [searchParams]);

    const handleSearch = (idToSearch: string) => {
        if (!idToSearch) return;

        setLoading(true);
        setSearched(true);

        // Simulate network delay for animation effect
        setTimeout(() => {
            const allOrders = getOrders();
            const foundOrder = allOrders.find(o => o._id === idToSearch || o._id.includes(idToSearch));
            setOrder(foundOrder || null);
            setLoading(false);
        }, 800);
    };

    const getStepStatus = (stepId: string, currentStatus: string) => {
        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(stepId);

        if (currentStatus === 'cancelled') return 'cancelled';
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container-custom py-12">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
                        <p className="text-gray-500">Enter your order ID to see the current status</p>
                    </div>

                    <Card className="border-none shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex gap-3">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="e.g. 1708892341234"
                                        className="pl-10 h-12 bg-gray-50 border-gray-200"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(orderId)}
                                    />
                                </div>
                                <Button
                                    onClick={() => handleSearch(orderId)}
                                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? 'Tracking...' : 'Track'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {searched && !loading && !order && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900">Order Not Found</h3>
                            <p className="text-gray-500 mt-2">We couldn't find an order with ID "{orderId}". Please check and try again.</p>
                        </motion.div>
                    )}

                    {order && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="border-none shadow-lg overflow-hidden">
                                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                                    <div>
                                        <p className="text-blue-100 text-sm mb-1">Order ID</p>
                                        <p className="text-xl font-bold font-mono">{order._id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-blue-100 text-sm mb-1">Estimated Delivery</p>
                                        <p className="font-semibold">3-5 Business Days</p>
                                    </div>
                                </div>

                                <CardContent className="p-8">
                                    {/* Progress Bar */}
                                    <div className="relative mb-12 mt-4">
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                                        <div
                                            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${order.status === 'delivered' ? 100 :
                                                        order.status === 'shipped' ? 66 :
                                                            order.status === 'processing' ? 33 : 0
                                                    }%`
                                            }}
                                        />

                                        <div className="relative flex justify-between w-full">
                                            {steps.map((step, index) => {
                                                const status = getStepStatus(step.id, order.status);
                                                const isCompleted = status === 'completed' || status === 'current';
                                                const isCurrent = status === 'current';
                                                const Icon = step.icon;

                                                return (
                                                    <div key={step.id} className="flex flex-col items-center group">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-4",
                                                            isCompleted ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-400",
                                                            isCurrent && "ring-4 ring-blue-100 scale-110"
                                                        )}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <p className={cn(
                                                            "mt-3 text-sm font-medium transition-colors duration-300",
                                                            isCompleted ? "text-blue-600" : "text-gray-400"
                                                        )}>
                                                            {step.label}
                                                        </p>
                                                        {isCurrent && (
                                                            <p className="text-xs text-gray-500 mt-1 animate-pulse">In Progress</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Order Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-blue-600" /> Shipping Details
                                            </h4>
                                            <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-4 rounded-lg">
                                                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                                <p>{order.shippingAddress.street}</p>
                                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                                <p>{order.shippingAddress.country}</p>
                                                <p className="pt-2">{order.shippingAddress.phone}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Package className="w-4 h-4 text-blue-600" /> Order Items
                                            </h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                                                        <div className="flex-grow">
                                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                                <span className="font-semibold text-gray-900">Total Amount</span>
                                                <span className="text-lg font-bold text-blue-600">${order.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center mt-8">
                                        <Link to="/orders">
                                            <Button variant="outline" className="gap-2">
                                                View All Orders <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>

                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrackOrder;
