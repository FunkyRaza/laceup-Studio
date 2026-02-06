import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { getOrders, getUsers, getProducts } from '@/lib/storage';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pendingShipments: 0,
    lowStock: 0,
    totalRevenue: 0,
    salesTimeline: [],
    productCategories: []
  });

  useEffect(() => {
    // Fetch real data
    const orders = getOrders();
    const products = getProducts(); // Assuming getProducts is exported from storage
    // const users = getUsers();

    // 1. Calculate Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // 2. Calculate Total Orders
    const totalOrders = orders.length;

    // 3. Calculate Pending Shipments (pending or processing)
    const pendingShipments = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

    // 4. Calculate Low Stock Items (stock < 10)
    const lowStock = products.filter(p => p.stock < 10).length;

    // Generate Chart Data (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const salesTimeline = last7Days.map(date => {
      const dayOrders = orders.filter(o => o.createdAt.startsWith(date));
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      };
    });

    // Generate Category Data
    const categoryData: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        // Since we don't store category directly on order item in this simplified version,
        // we might need to look it up or just mock it for now if not available.
        // For accurate category data, we'd need to fetch product details for each item.
        // Let's use a simplified approach or mock if product details aren't fully available in order items.
        // Actually, let's use the real Products distribution for the pie chart as "Inventory Distribution" instead of sales by category if simpler
        // OR calculate sales if we can.
      });
    });

    // Let's use Inventory Distribution for the Pie Chart as it's easier to get accurately from Products
    const categories: Record<string, number> = {};
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const productCategories = Object.keys(categories).map((cat, index) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: categories[cat],
      color: ['#3b82f6', '#f97316', '#10b981', '#ef4444', '#8b5cf6'][index % 5]
    }));

    setAnalytics({
      totalOrders,
      pendingShipments,
      lowStock,
      totalRevenue,
      salesTimeline,
      productCategories
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">E-commerce Overview</h2>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Orders */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingCart size={80} className="text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="bg-blue-50 p-3 rounded-full w-fit mb-4">
              <ShoppingCart className="text-blue-600 h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalOrders}</h3>
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
          </div>
          <div className="absolute bottom-4 right-4 h-12 w-20 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ v: 10 }, { v: 20 }, { v: 15 }, { v: 40 }, { v: 30 }, { v: 60 }]}>
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Pending Shipments */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package size={80} className="text-orange-500" />
          </div>
          <div className="relative z-10">
            <div className="bg-orange-50 p-3 rounded-full w-fit mb-4">
              <Package className="text-orange-500 h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.pendingShipments}</h3>
            <p className="text-gray-500 text-sm font-medium">Pending Shipments</p>
          </div>
          <div className="absolute bottom-4 right-4 h-12 w-20 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ v: 10 }, { v: 15 }, { v: 10 }, { v: 30 }, { v: 20 }, { v: 40 }]}>
                <Line type="monotone" dataKey="v" stroke="#f97316" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Low Stock Items */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle size={80} className="text-red-500" />
          </div>
          <div className="relative z-10">
            <div className="bg-red-50 p-3 rounded-full w-fit mb-4">
              <AlertCircle className="text-red-500 h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.lowStock}</h3>
            <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
          </div>
          <div className="absolute bottom-4 right-4 h-12 w-20 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ v: 15 }, { v: 30 }, { v: 25 }, { v: 45 }, { v: 20 }, { v: 55 }]}>
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard size={80} className="text-green-600" />
          </div>
          <div className="relative z-10">
            <div className="bg-green-50 p-3 rounded-full w-fit mb-4">
              <TrendingUp className="text-green-600 h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{analytics.totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          </div>
          <div className="absolute bottom-4 right-4 h-12 w-20 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ v: 30 }, { v: 40 }, { v: 25 }, { v: 50 }, { v: 35 }, { v: 70 }, { v: 90 }]}>
                <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      < div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
        {/* Main Line Chart - 2 Columns */}
        < Card className="lg:col-span-2 bg-white border border-gray-100 shadow-sm" >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Sales Analytics</p>
                <CardTitle className="text-gray-800 text-lg mt-1">Performance Timeline</CardTitle>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span className="text-xs text-gray-500">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <span className="text-xs text-gray-500">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-gray-500">Visitors</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.salesTimeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#374151' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-gray-100 pt-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Avg. Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{(analytics.totalRevenue / 7).toFixed(0)}</p>
                <p className="text-xs text-green-500">Daily average</p>
                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.salesTimeline}>
                      <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Avg. Orders</p>
                <p className="text-2xl font-bold text-gray-900">{(analytics.totalOrders / 7).toFixed(1)}</p>
                <p className="text-xs text-green-500">Daily average</p>
                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.salesTimeline}>
                      <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">1.2k</p>
                <p className="text-xs text-gray-400">Mock data</p>
                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{ v: 50 }, { v: 30 }, { v: 40 }, { v: 20 }, { v: 60 }]}>
                      <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card >

        {/* Product Categories - Donut Chart */}
        < Card className="bg-white border border-gray-100 shadow-sm h-full" >
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.productCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.productCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {analytics.productCategories.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                    <div>
                      <p className="text-gray-900 font-bold">{stat.value}%</p>
                      <p className="text-gray-500 text-xs">{stat.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card >
      </div >

      {/* Bottom Row - Statistics */}
      < div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex flex-col justify-center gap-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div>
                    <p className="text-gray-800 font-medium">Nike Air Max</p>
                    <p className="text-gray-400 text-xs">Shoes</p>
                  </div>
                </div>
                <p className="text-gray-900 font-bold">₹12,450</p>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div>
                    <p className="text-gray-800 font-medium">Cotton T-Shirt</p>
                    <p className="text-gray-400 text-xs">Apparel</p>
                  </div>
                </div>
                <p className="text-gray-900 font-bold">₹8,320</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Recent Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-gray-500 italic">
              "Great quality products and fast shipping!" - User123
            </div>
          </CardContent>
        </Card>
      </div >
    </div >
  );
};

export default Dashboard;
