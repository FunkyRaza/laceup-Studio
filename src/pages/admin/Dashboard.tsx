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
import { getOrders, getUsers } from '@/lib/storage';

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
    // Generate mock data for the charts
    const salesTimeline = Array.from({ length: 14 }, (_, i) => ({
      date: `Dec ${i + 1}`,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 50) + 10,
      visitors: Math.floor(Math.random() * 1000) + 500,
    }));

    const productCategories = [
      { name: 'Shoes', value: 45, color: '#e14eca' },
      { name: 'Apparel', value: 30, color: '#ff8a48' },
      { name: 'Accessories', value: 15, color: '#00d6b4' },
      { name: 'Electronics', value: 10, color: '#ffffff' },
    ];

    setAnalytics({
      totalOrders: 1450,
      pendingShipments: 25,
      lowStock: 12,
      totalRevenue: 63465,
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
        {/* Card 1: Total Orders - Blue */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingCart size={80} className="text-blue-500" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="bg-blue-50 p-3 rounded-full w-fit mb-4">
                <ShoppingCart className="text-blue-500 h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">1,450</h3>
              <p className="text-gray-500 text-sm">Total Orders</p>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ v: 10 }, { v: 20 }, { v: 15 }, { v: 40 }, { v: 30 }, { v: 60 }]}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Shipments - Pink/Red */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package size={80} className="text-pink-500" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="bg-pink-50 p-3 rounded-full w-fit mb-4">
                <Package className="text-pink-500 h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">25</h3>
              <p className="text-gray-500 text-sm">Pending Shipments</p>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ v: 20 }, { v: 10 }, { v: 50 }, { v: 30 }, { v: 40 }, { v: 20 }]}>
                  <Line type="monotone" dataKey="v" stroke="#ec4899" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Alerts - Teal */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle size={80} className="text-teal-500" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="bg-teal-50 p-3 rounded-full w-fit mb-4">
                <AlertCircle className="text-teal-500 h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">12</h3>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
            </div>
            <div className="h-16 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ v: 15 }, { v: 30 }, { v: 25 }, { v: 45 }, { v: 20 }, { v: 55 }]}>
                  <Line type="monotone" dataKey="v" stroke="#14b8a6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4: Total Revenue - Orange */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard size={80} className="text-orange-500" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="mb-4">
                <span className="text-orange-600 text-sm bg-orange-100 px-2 py-1 rounded">Monthly</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">$63.5k</h3>
              <p className="text-gray-500 text-sm">Total Revenue</p>
            </div>
            <div className="h-16 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{ v: 30 }, { v: 40 }, { v: 25 }, { v: 50 }, { v: 35 }, { v: 70 }, { v: 90 }]}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#f97316" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Line Chart - 2 Columns */}
        <Card className="lg:col-span-2 bg-white border border-gray-100 shadow-sm">
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
                <p className="text-2xl font-bold text-gray-900">$4.2k</p>
                <p className="text-xs text-green-500">+12% vs last week</p>
                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{ v: 10 }, { v: 40 }, { v: 20 }, { v: 50 }, { v: 30 }]}>
                      <Line type="monotone" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Avg. Orders</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-xs text-green-500">+5% vs last week</p>
                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{ v: 30 }, { v: 20 }, { v: 60 }, { v: 40 }, { v: 50 }]}>
                      <Line type="monotone" dataKey="v" stroke="#ec4899" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Avg. Visitors</p>
                <p className="text-2xl font-bold text-gray-900">1.2k</p>
                <p className="text-xs text-red-500">-2% vs last week</p>
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
        </Card>

        {/* Product Categories - Donut Chart */}
        <Card className="bg-white border border-gray-100 shadow-sm h-full">
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
        </Card>
      </div>

      {/* Bottom Row - Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-gray-900 font-bold">$12,450</p>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div>
                    <p className="text-gray-800 font-medium">Cotton T-Shirt</p>
                    <p className="text-gray-400 text-xs">Apparel</p>
                  </div>
                </div>
                <p className="text-gray-900 font-bold">$8,320</p>
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
      </div>
    </div>
  );
};

export default Dashboard;
