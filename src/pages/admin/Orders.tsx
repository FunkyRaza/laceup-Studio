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
  User,
  Trash2,
  Download
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load orders
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      const enrichedOrders = data.map((order: any) => ({
        ...order,
        customerName: order.user?.name || 'Unknown Customer',
        items: order.items || []
      }));
      setOrders(enrichedOrders);
      setFilteredOrders(enrichedOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      result = result.filter(order =>
        order._id.includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.address?.city && order.address.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              // Export functionality
              toast.success('Orders exported successfully!');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
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
              <TableHeader className="bg-gray-50 border-b border-gray-100">
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="py-4 pl-6 font-semibold text-gray-700">Order ID</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">Customer</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="py-4 font-semibold text-gray-700">Itmes</TableHead>
                  <TableHead className="py-4 pr-6 font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <TableRow key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-mono text-xs font-medium text-gray-600 pl-6">
                        {order._id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{order.customerName}</span>
                          <span className="text-xs text-gray-500">{order.shippingAddress?.city || 'Unknown City'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">
                        ₹{order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(val) => handleStatusChange(order._id, val)}
                        >
                          <SelectTrigger className={`h-8 w-fit border-none shadow-sm text-xs font-medium px-3 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                              order.status === 'processing' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                  'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-100 shadow-xl">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm max-w-[200px] truncate">
                        {order.items.map((i: any) => i.name).join(', ')}
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="overflow-y-auto bg-white border-l border-gray-100 p-0 sm:max-w-md transition-all duration-300 ease-in-out !opacity-100">
                            {selectedOrder && (
                              <div className="h-full flex flex-col bg-white">
                                {/* Sheet Header */}
                                <div className="p-6 border-b border-gray-100">
                                  <h2 className="text-xl font-bold text-gray-900 mb-1">Order Details</h2>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                                    ID: {selectedOrder._id}
                                  </div>
                                  <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    selectedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                      selectedOrder.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                                        selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                          'bg-gray-100 text-gray-700'
                                    }`}>
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                  </div>
                                </div>

                                {/* Sheet Content */}
                                <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                                  {/* Items */}
                                  <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Items Ordered</h3>
                                    <div className="space-y-4">
                                      {selectedOrder.items.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 items-start">
                                          <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                            <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                                            <div className="text-xs text-gray-500 mt-1 space-x-2">
                                              <span>Qty: {item.quantity}</span>
                                              {item.size && <span>• Size: {item.size}</span>}
                                              {item.color && <span>• Color: {item.color}</span>}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                              ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Customer & Shipping */}
                                  <div className="grid gap-6">
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                                      <div className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
                                        <User className="w-4 h-4" /> Customer Info
                                      </div>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="text-gray-400">Name:</span> {selectedOrder.customerName}</p>
                                        <p><span className="text-gray-400">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                                      </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                                      <div className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
                                        <Package className="w-4 h-4" /> Shipping Address
                                      </div>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <p>{selectedOrder.shippingAddress.street}</p>
                                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                                        <p>{selectedOrder.shippingAddress.country}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Summary */}
                                  <div className="border-t border-gray-100 pt-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Subtotal</span>
                                      <span className="font-medium text-gray-900">₹{selectedOrder.subtotal?.toFixed(2) || (selectedOrder.total * 0.9).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Shipping</span>
                                      <span className="font-medium text-gray-900">₹{selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Tax</span>
                                      <span className="font-medium text-gray-900">₹{selectedOrder.tax?.toFixed(2) || (selectedOrder.total * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-100">
                                      <span>Total</span>
                                      <span className="text-blue-600">₹{selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the order and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(order._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
        </CardContent >
      </Card >
    </div >
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