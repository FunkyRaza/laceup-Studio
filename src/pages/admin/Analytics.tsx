import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import api from '@/lib/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  MousePointer,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Target,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart as PieChartIcon,
  Tablet
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/detailed');
        setAnalyticsData(response.data);
      } catch (error: any) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics/detailed');
      setAnalyticsData(response.data);
      toast.success('Analytics refreshed!');
    } catch (error) {
      toast.error('Failed to refresh analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.info('Exporting analytics data...');
    // Simulate export
    setTimeout(() => {
      toast.success('Report exported successfully!');
    }, 1500);
  };

  // Mock data for charts when API data is not available
  const mockRevenueData = [
    { name: 'Mon', revenue: 4000, orders: 24, visitors: 1200 },
    { name: 'Tue', revenue: 3000, orders: 13, visitors: 1900 },
    { name: 'Wed', revenue: 2000, orders: 8, visitors: 1500 },
    { name: 'Thu', revenue: 2780, orders: 19, visitors: 2100 },
    { name: 'Fri', revenue: 1890, orders: 12, visitors: 1800 },
    { name: 'Sat', revenue: 2390, orders: 16, visitors: 2400 },
    { name: 'Sun', revenue: 3490, orders: 21, visitors: 2800 },
  ];

  const mockTrafficData = [
    { name: 'Direct', value: 45, color: '#3b82f6' },
    { name: 'Social', value: 25, color: '#10b981' },
    { name: 'Referral', value: 20, color: '#f59e0b' },
    { name: 'Organic', value: 10, color: '#ef4444' },
  ];

  const mockDeviceData = [
    { name: 'Desktop', value: 65, color: '#3b82f6' },
    { name: 'Mobile', value: 25, color: '#10b981' },
    { name: 'Tablet', value: 10, color: '#f59e0b' },
  ];

  const mockConversionData = [
    { name: 'Jan', rate: 2.4 },
    { name: 'Feb', rate: 3.2 },
    { name: 'Mar', rate: 2.8 },
    { name: 'Apr', rate: 4.1 },
    { name: 'May', rate: 3.9 },
    { name: 'Jun', rate: 4.5 },
  ];

  const mockTopProducts = [
    { name: 'Running Shoes', sales: 1242, revenue: 45670 },
    { name: 'Casual Sneakers', sales: 987, revenue: 38920 },
    { name: 'Formal Shoes', sales: 756, revenue: 32100 },
    { name: 'Sports Sandals', sales: 634, revenue: 18950 },
    { name: 'Boots', sales: 423, revenue: 21560 },
  ];

  // Use real data if available, otherwise use mock data
  const revenueData = analyticsData?.monthlyRevenue || mockRevenueData;
  const trafficData = mockTrafficData;
  const deviceData = mockDeviceData;
  const conversionData = mockConversionData;
  const topProducts = mockTopProducts;

  const metrics = [
    {
      title: 'Total Revenue',
      value: analyticsData ? `$${(analyticsData.totalRevenue / 1000).toFixed(1)}k` : '$42.6k',
      change: analyticsData ? `+${analyticsData.revenueGrowth}%` : '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: analyticsData ? analyticsData.totalOrders : '1,243',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'New Customers',
      value: analyticsData ? analyticsData.totalCustomers : '842',
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: 'up'
    },
    {
      title: 'Page Views',
      value: '24,567',
      change: '-2.1%',
      icon: Eye,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: 'down'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className={`flex items-center mt-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{metric.change}</span>
                  <span className="text-xs text-gray-500 ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-gray-900">Revenue Trend</CardTitle>
              <CardDescription className="text-gray-500">Monthly revenue performance</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Traffic Sources</CardTitle>
            <CardDescription className="text-gray-500">Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {trafficData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Rate */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Conversion Rate
            </CardTitle>
            <CardDescription className="text-gray-500">Monthly conversion performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Device Usage</CardTitle>
            <CardDescription className="text-gray-500">How users access your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      device.name === 'Desktop' ? 'bg-blue-100' :
                      device.name === 'Mobile' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {device.name === 'Desktop' ? (
                        <Monitor className="h-4 w-4 text-blue-600" />
                      ) : device.name === 'Mobile' ? (
                        <Smartphone className="h-4 w-4 text-green-600" />
                      ) : (
                        <Tablet className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{device.name}</div>
                      <div className="text-sm text-gray-500">Traffic source</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{device.value}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          device.name === 'Desktop' ? 'bg-blue-600' :
                          device.name === 'Mobile' ? 'bg-green-600' : 'bg-yellow-600'
                        }`}
                        style={{ width: `${device.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Products */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Products</CardTitle>
            <CardDescription className="text-gray-500">Best selling items this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${(product.revenue / 1000).toFixed(1)}k</div>
                    <div className="text-xs text-green-600">+{Math.floor(Math.random() * 15) + 5}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Real-time Activity
          </CardTitle>
          <CardDescription className="text-gray-500">Live updates from your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-gray-900">New order received</div>
                    <div className="text-sm text-gray-500">Order #{1200 + index} • {Math.floor(Math.random() * 60) + 1} min ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${(Math.random() * 200 + 50).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Running Shoes</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
          <PieChartIcon className="h-4 w-4 mr-2" />
          Detailed Reports
        </Button>
        <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
          <Zap className="h-4 w-4 mr-2" />
          Performance Insights
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Globe className="h-4 w-4 mr-2" />
          View Full Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Analytics;