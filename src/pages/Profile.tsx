import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-custom py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-secondary/50 p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-muted-foreground capitalize">{user.role} Account</p>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <p className="font-medium">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <p className="font-medium">{user.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="font-medium">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </h3>
                {isEditing ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-1">Street</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="ZIP Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="font-medium">
                    {user.address
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}, ${user.address.country}`
                      : 'No address saved'}
                  </p>
                )}
              </div>
            </div>

            {/* Logout */}
            <div className="border-t border-border p-6">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
