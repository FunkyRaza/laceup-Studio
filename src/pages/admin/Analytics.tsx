import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProducts, getOrders, getUsers } from '@/lib/storage';
import { Product, Order, User } from '@/types';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyRevenue: [],
    monthlyOrders: [],
    categoryPerformance: [],
    recentOrders: [],
    revenueGrowth: 0
  });

  const [dateRange, setDateRange] = useState('month');

  // Fetch data and calculate analytics
  useEffect(() => {
    const products = getProducts();
    const orders = getOrders();
    const users = getUsers();

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = users.length;
    const totalProducts = products.length;

    // Mock monthly revenue data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = months.map(month => ({
      name: month,
      revenue: Math.floor(Math.random() * 10000) + 5000,
    }));

    // Mock monthly orders data
    const monthlyOrders = months.map(month => ({
      name: month,
      orders: Math.floor(Math.random() * 100) + 20,
    }));

    // Mock category performance
    const categories = ['watches', 'shoes', 't-shirts', 'shirts'];
    const categoryPerformance = categories.map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      revenue: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 50) + 5,
    }));

    // Recent orders
    const recentOrders = [...orders].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);

    // Calculate revenue growth (mock data)
    const revenueGrowth = 12.5;

    setAnalytics({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      monthlyRevenue,
      monthlyOrders,
      categoryPerformance,
      recentOrders,
      revenueGrowth
    });
  }, [dateRange]);

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-gray-500">Detailed insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="bg-white border-gray-200 text-gray-900 w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/50 rounded-t-xl border-b border-gray-50">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded">+{analytics.revenueGrowth}% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/50 rounded-t-xl border-b border-gray-50">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</div>
            <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded">+8.2% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/50 rounded-t-xl border-b border-gray-50">
            <CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle>
            <div className="p-2 bg-purple-50 rounded-full">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</div>
            <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded">+3.1% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/50 rounded-t-xl border-b border-gray-50">
            <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
            <div className="p-2 bg-orange-50 rounded-full">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</div>
            <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded">+5.7% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance Chart */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="revenue"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    stroke="none"
                  >
                    {analytics.categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders Chart */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-green-600" />
              Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    activeDot={{ r: 6 }}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Growth Chart */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-600" />
              Customer Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="revenue" name="New Customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;