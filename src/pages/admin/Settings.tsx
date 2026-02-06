import React, { useState } from 'react';
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
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Palette,
  Globe,
  Save,
  Upload
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@laceup.com',
    newPassword: '',
    confirmPassword: '',
    siteName: 'LACEUP Admin',
    siteDescription: 'Premium e-commerce platform',
    language: 'en',
    currency: 'INR',
    timezone: 'UTC-5',
    theme: 'dark'
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the settings to localStorage or a backend
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500">Manage your admin panel settings</p>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-100 bg-gray-50/50">
          <nav className="flex flex-wrap -mb-px">
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('security')}
            >
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'site'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('site')}
            >
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Site
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'appearance'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('appearance')}
            >
              <div className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </div>
            </button>
          </nav>
        </div>
        <CardHeader className="bg-white pt-6">
          <CardTitle className="text-gray-900 text-xl font-bold">
            {activeTab === 'profile' && 'Profile Settings'}
            {activeTab === 'security' && 'Security Settings'}
            {activeTab === 'site' && 'Site Settings'}
            {activeTab === 'appearance' && 'Appearance Settings'}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {activeTab === 'profile' && 'Update your personal information'}
            {activeTab === 'security' && 'Manage your security preferences'}
            {activeTab === 'site' && 'Configure your site settings'}
            {activeTab === 'appearance' && 'Customize the appearance'}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
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
                      className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 font-medium">Profile Picture</Label>
                  <div className="flex items-center gap-6">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl w-24 h-24 flex items-center justify-center text-gray-400">
                      <User className="h-8 w-8" />
                    </div>
                    <Button type="button" variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button type="button" variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'site' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-gray-700 font-medium">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-gray-700 font-medium">Site Description</Label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-gray-700 font-medium">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange('currency', value)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => handleSelectChange('timezone', value)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (ET)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PT)</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="CET">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-gray-700 font-medium">Theme</Label>
                  <Select
                    value={formData.theme}
                    onValueChange={(value) => handleSelectChange('theme', value)}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Primary Color</Label>
                  <div className="flex gap-3">
                    {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'].map((color) => (
                      <div
                        key={color}
                        className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${formData.theme === color ? 'border-gray-900 shadow-sm ring-2 ring-gray-100' : 'border-transparent'
                          }`}
                        style={{ backgroundColor: color }}
                        onClick={() => { }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Font Family</Label>
                  <Select value="inter" onValueChange={() => { }}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="satoshi">Satoshi</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6">
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