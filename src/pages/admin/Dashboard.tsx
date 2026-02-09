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
import api from '@/lib/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingShipments: 0,
    lowStock: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [salesTimeline, setSalesTimeline] = useState<any[]>([]);
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        setStats({
          totalOrders: data.totalOrders || 0,
          pendingShipments: data.pendingShipments || 0,
          lowStock: data.lowStock || 0,
          totalRevenue: data.totalRevenue || 0,
          totalProducts: data.totalProducts || 0,
          totalUsers: data.totalUsers || 0
        });
        setSalesTimeline(data.salesTimeline || []);
        setProductCategories(data.productCategories || []);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">E-commerce Overview</h2>
      </div>

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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalOrders}</h3>
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingShipments}</h3>
            <p className="text-gray-500 text-sm font-medium">Pending Shipments</p>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.lowStock}</h3>
            <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Performance Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTimeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Inventory Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {productCategories.map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }}></div>
                  <span className="text-gray-500">{stat.name}: {stat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
