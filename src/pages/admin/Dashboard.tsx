import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  CreditCard,
  AlertCircle,
  DollarSign,
  ShoppingBag,
  UserCheck,
  BarChart3
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1">Monitor your business performance and metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Last 7 Days
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Revenue */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4 backdrop-blur-sm">
              <DollarSign className="text-white h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-lg text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShoppingBag size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4 backdrop-blur-sm">
              <ShoppingBag className="text-white h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalOrders}</h3>
            <p className="text-emerald-100 text-sm font-medium">Total Orders</p>
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 p-6 shadow-lg text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserCheck size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4 backdrop-blur-sm">
              <UserCheck className="text-white h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalUsers}</h3>
            <p className="text-violet-100 text-sm font-medium">Total Customers</p>
          </div>
        </div>

        {/* Card 4: Total Products */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 shadow-lg text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4 backdrop-blur-sm">
              <Package className="text-white h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalProducts}</h3>
            <p className="text-amber-100 text-sm font-medium">Total Products</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border border-gray-100 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Sales Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTimeline}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="orders" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-600" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {productCategories.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                    <span className="text-sm text-gray-600">{stat.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-gray-900 text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">#ORD-{1000 + item}</p>
                      <p className="text-sm text-gray-500">John Doe</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{(item * 1250).toLocaleString()}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-gray-900 text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <ShoppingBag className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Product</p>
              </button>
              <button className="p-4 bg-green-50 border border-green-100 rounded-xl text-center hover:bg-green-100 transition-colors">
                <Package className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Category</p>
              </button>
              <button className="p-4 bg-violet-50 border border-violet-100 rounded-xl text-center hover:bg-violet-100 transition-colors">
                <Users className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">View Customers</p>
              </button>
              <button className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center hover:bg-amber-100 transition-colors">
                <BarChart3 className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">View Reports</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
