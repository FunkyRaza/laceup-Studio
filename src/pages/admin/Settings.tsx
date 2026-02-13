import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/api';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Palette,
  Globe,
  Save,
  Upload,
  Bell,
  Eye,
  Database,
  HardDrive,
  Monitor,
  Smartphone,
  Server,
  Key,
  CreditCard,
  Zap,
  Cloud,
  Activity,
  BarChart3,
  Lock,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Download
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
    siteName: 'LACEUP Admin',
    siteDescription: 'Premium e-commerce platform',
    language: 'en',
    currency: 'INR',
    timezone: 'UTC-5',
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true,
      newsletter: true
    },
    integrations: {
      googleAnalytics: false,
      facebookPixel: false,
      mailchimp: false,
      stripe: true
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/me');
        const adminData = response.data;
        
        setFormData(prev => ({
          ...prev,
          firstName: adminData.name?.split(' ')[0] || '',
          lastName: adminData.name?.split(' ')[1] || '',
          email: adminData.email || '',
          role: adminData.role || 'admin'
        }));
      } catch (error: any) {
        console.error('Error fetching admin profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (section: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, any>),
        [field]: !(prev[section as keyof typeof prev] as Record<string, any>)[field]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Update admin profile
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      };
      
      await api.put('/admin/profile', updateData);
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      toast.info('Creating backup...');
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Backup created successfully!');
    } catch (error) {
      toast.error('Backup failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your admin panel configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50" onClick={handleBackup}>
            <Cloud className="h-4 w-4 mr-2" />
            Backup Settings
          </Button>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-100 bg-gray-50/50">
          <nav className="flex flex-wrap -mb-px">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'account', label: 'Account', icon: CreditCard },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'site', label: 'Site Settings', icon: Globe },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'integration', label: 'Integration', icon: Zap },
              { id: 'advanced', label: 'Advanced', icon: Server }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center space-x-2 border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600 bg-white shadow-sm'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50 hover:border-gray-200'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <CardHeader className="bg-white pt-6">
          <CardTitle className="text-gray-900 text-xl font-bold">
            {activeTab === 'profile' && 'Profile Settings'}
            {activeTab === 'account' && 'Account Settings'}
            {activeTab === 'security' && 'Security Settings'}
            {activeTab === 'notifications' && 'Notification Preferences'}
            {activeTab === 'site' && 'Site Configuration'}
            {activeTab === 'appearance' && 'Appearance Settings'}
            {activeTab === 'integration' && 'Integration Settings'}
            {activeTab === 'advanced' && 'Advanced Configuration'}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {activeTab === 'profile' && 'Manage your personal profile information'}
            {activeTab === 'account' && 'Configure your account settings and preferences'}
            {activeTab === 'security' && 'Enhance your account security'}
            {activeTab === 'notifications' && 'Customize your notification preferences'}
            {activeTab === 'site' && 'Configure site-wide settings and preferences'}
            {activeTab === 'appearance' && 'Customize the admin panel appearance'}
            {activeTab === 'integration' && 'Manage third-party integrations'}
            {activeTab === 'advanced' && 'Advanced system configuration'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <Label className="text-gray-700 font-medium">Profile Picture</Label>
                  <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </div>
                    <Button type="button" variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Image
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-gray-700 font-medium">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-700 font-medium">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleSelectChange('language', value)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-gray-700 font-medium">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange('currency', value)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => handleSelectChange('timezone', value)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="UTC-5">Eastern Time (ET)</SelectItem>
                        <SelectItem value="UTC-8">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC+0">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-gray-700 font-medium">Site Description</Label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Lock className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-900">Security Alert</h3>
                      <p className="text-sm text-red-700 mt-1">Please ensure your password is strong and enable two-factor authentication for better security.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="pl-10 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Enable 2FA</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Enable Now
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Current Session</p>
                          <p className="text-sm text-green-700">Chrome on Windows • Active now</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Mobile App</p>
                          <p className="text-sm text-gray-500">iPhone iOS • 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-blue-900">Email Notifications</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Order Updates</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.email}
                            onChange={() => handleCheckboxChange('notifications', 'email')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Newsletter</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.newsletter}
                            onChange={() => handleCheckboxChange('notifications', 'newsletter')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Smartphone className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-purple-900">Push Notifications</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-800">Instant Alerts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.push}
                            onChange={() => handleCheckboxChange('notifications', 'push')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Order Confirmations', description: 'When orders are placed' },
                      { label: 'Payment Success', description: 'When payments are processed' },
                      { label: 'Low Inventory', description: 'When stock runs low' },
                      { label: 'New Reviews', description: 'When customers leave reviews' },
                      { label: 'System Updates', description: 'Platform maintenance notices' },
                      { label: 'Security Alerts', description: 'Login attempts and security events' }
                    ].map((item, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 text-sm">{item.label}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        <div className="mt-3 flex justify-end">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={index % 2 === 0} />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integration' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'googleAnalytics', label: 'Google Analytics', icon: BarChart3, description: 'Track website performance and user behavior', color: 'blue' },
                    { id: 'facebookPixel', label: 'Facebook Pixel', icon: Activity, description: 'Track conversions and optimize ads', color: 'blue' },
                    { id: 'mailchimp', label: 'Mailchimp', icon: Mail, description: 'Email marketing and newsletter management', color: 'red' },
                    { id: 'stripe', label: 'Stripe', icon: CreditCard, description: 'Payment processing and subscriptions', color: 'blue' }
                  ].map((integration) => {
                    const Icon = integration.icon;
                    return (
                      <div key={integration.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`bg-${integration.color}-100 p-2 rounded-lg`}>
                              <Icon className={`h-5 w-5 text-${integration.color}-600`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{integration.label}</h4>
                              <p className="text-sm text-gray-500">{integration.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.integrations[integration.id as keyof typeof formData.integrations]}
                              onChange={() => handleCheckboxChange('integrations', integration.id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-sm">
                            Configure
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Main API Key</h4>
                        <p className="text-sm text-gray-500">Used for primary application integrations</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">sk_••••••••••••••••••••</div>
                          <Button variant="outline" size="sm">Copy</Button>
                        </div>
                      </div>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-gray-200">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        Database
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Storage Used</span>
                          <span className="text-sm font-medium text-gray-900">2.3 GB of 5 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '46%' }}></div>
                        </div>
                        <Button variant="outline" className="w-full">
                          <HardDrive className="h-4 w-4 mr-2" />
                          Optimize Database
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <Server className="h-5 w-5 text-green-600" />
                        System Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Version</span>
                          <span className="text-sm font-medium text-gray-900">v2.1.4</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Uptime</span>
                          <span className="text-sm font-medium text-gray-900">14 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Backup</span>
                          <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Cloud className="h-5 w-5" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Database className="h-5 w-5" />
                      Backup Now
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                      <Activity className="h-5 w-5" />
                      System Check
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-gray-100 flex justify-end gap-3">
              <Button type="button" variant="outline" className="text-gray-700 border-gray-200 hover:bg-gray-50">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;