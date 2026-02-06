import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Eye,
  Package,
  Calendar,
  User
} from 'lucide-react';
import { getOrders, updateOrderStatus, getUsers } from '@/lib/storage';
import { Order, User as UserType } from '@/types';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Load orders
  useEffect(() => {
    const fetchedOrders = getOrders();
    const enrichedOrders = fetchedOrders.map(order => {
      const user = getUsers().find((u: UserType) => u._id === order.userId);
      return {
        ...order,
        customerName: user ? `${user.firstName} ${user.lastName} ` : 'Unknown Customer'
      };
    });

    setOrders(enrichedOrders);
    setFilteredOrders(enrichedOrders);
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      result = result.filter(order =>
        order._id.includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrder = updateOrderStatus(orderId, newStatus as any);
    if (updatedOrder) {
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, ...updatedOrder } : order
      ));
      setFilteredOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, ...updatedOrder } : order
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex gap-2">
          {/* Export/Action buttons could go here */}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by Order ID, Customer, or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:bg-white transition-colors"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-gray-50 border-gray-200 text-gray-700">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-100">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium py-4">Order ID</TableHead>
                  <TableHead className="text-gray-500 font-medium">Customer</TableHead>
                  <TableHead className="text-gray-500 font-medium">Date</TableHead>
                  <TableHead className="text-gray-500 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-gray-500 font-medium">Items</TableHead>
                  <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-mono text-xs font-medium text-gray-600">#{order._id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">View Profile</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order._id, value)}
                        >
                          <SelectTrigger className={`h-8 w-[130px] border-none shadow-none text-xs font-medium px-2.5 ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-100">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{order.items.length} items</TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          {selectedOrder && selectedOrder._id === order._id && (
                            <SheetContent className="bg-white border-l border-gray-100 sm:max-w-2xl overflow-y-auto">
                              <SheetHeader className="mb-8 border-b border-gray-100 pb-6">
                                <div className="flex items-center justify-between mb-2">
                                  <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <SheetTitle className="text-3xl font-bold text-gray-900">
                                  Order #{selectedOrder._id.substring(0, 8)}
                                  <span className="text-gray-300 ml-1 font-normal text-lg">...{selectedOrder._id.slice(-4)}</span>
                                </SheetTitle>
                                <SheetDescription className="text-gray-500 text-base">
                                  Customer order details and tracking information
                                </SheetDescription>
                              </SheetHeader>

                              {/* Order Tracking Timeline */}
                              <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                  <Package className="w-4 h-4 text-blue-600" /> Fulfillment Status
                                </h3>

                                <div className="relative px-2">
                                  {/* Progress Bar background */}
                                  <div className="absolute top-2.5 left-0 w-full h-[3px] bg-gray-200 rounded-full" />

                                  {/* Active Progress Bar */}
                                  <div
                                    className="absolute top-2.5 left-0 h-[3px] bg-blue-600 rounded-full transition-all duration-700 ease-out"
                                    style={{
                                      width: `${selectedOrder.status === 'delivered' ? 100 :
                                          selectedOrder.status === 'shipped' ? 66 :
                                            selectedOrder.status === 'processing' ? 33 : 5
                                        }%`
                                    }}
                                  />

                                  <div className="relative flex justify-between">
                                    {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
                                      const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
                                      const currentIndex = statusOrder.indexOf(selectedOrder.status);
                                      const stepIndex = statusOrder.indexOf(step);
                                      const isCompleted = stepIndex <= currentIndex;
                                      const isCurrent = stepIndex === currentIndex;

                                      return (
                                        <div key={step} className="flex flex-col items-center gap-3">
                                          <div className={`
                                            w-6 h-6 rounded-full border-[3px] z-10 flex items-center justify-center transition-colors duration-300
                                            ${isCompleted ? 'bg-blue-600 border-blue-600 shadow-md' : 'bg-white border-gray-300'}
                                            ${isCurrent ? 'scale-125 ring-4 ring-blue-50' : ''}
                                          `}>
                                            {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                          </div>
                                          <span className={`
                                            text-xs font-medium capitalize transition-colors duration-300
                                            ${isCompleted ? 'text-blue-700' : 'text-gray-400'}
                                            ${isCurrent ? 'font-bold' : ''}
                                          `}>
                                            {step}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" /> Customer
                                  </h3>
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                    <div>
                                      <p className="text-xs text-gray-400 uppercase tracking-wide">Contact Person</p>
                                      <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400 uppercase tracking-wide">Email Address</p>
                                      <p className="text-gray-700">{getUsers().find(u => u._id === selectedOrder.userId)?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400 uppercase tracking-wide">User ID</p>
                                      <p className="font-mono text-xs text-gray-500 bg-gray-50 inline-block px-1 py-0.5 rounded">{selectedOrder.userId}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Info */}
                                <div className="space-y-4">
                                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-500" /> Delivery
                                  </h3>
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-1">
                                    <p className="font-semibold text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                      {selectedOrder.shippingAddress.street}<br />
                                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                                      {selectedOrder.shippingAddress.country}
                                    </p>
                                    {selectedOrder.shippingAddress.phone && (
                                      <p className="text-sm text-blue-600 pt-2 flex items-center gap-2 font-medium">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full" /> {selectedOrder.shippingAddress.phone}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
                                  <span>Order Items</span>
                                  <span className="text-sm font-normal text-gray-500 px-3 py-1 bg-gray-100 rounded-full">{selectedOrder.items.length} items</span>
                                </h3>
                                <div className="space-y-4">
                                  {selectedOrder.items.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="h-20 w-20 rounded-lg bg-gray-50 shrink-0 overflow-hidden border border-gray-100">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                          <h4 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {item.size && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Size: {item.size}</span>}
                                            {item.color && (
                                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded flex items-center gap-1">
                                                Color: <span className="w-2 h-2 rounded-full bg-gray-400" /> {item.color}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                          <span className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                                          <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-8 bg-gray-50 rounded-xl p-6 space-y-3">
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${selectedOrder.subtotal?.toFixed(2) || (selectedOrder.total * 0.9).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span>${selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tax</span>
                                    <span>${selectedOrder.tax?.toFixed(2) || (selectedOrder.total * 0.1).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                                    <span>Total Paid</span>
                                    <span>${selectedOrder.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </SheetContent>
                          )}
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Package className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium text-gray-900">No orders found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'processing':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default Orders;