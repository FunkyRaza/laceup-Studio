import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X, Camera, ShieldCheck, CreditCard, ShoppingBag } from 'lucide-react';
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
    avatar: user?.avatar || '',
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
      avatar: formData.avatar,
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container-custom py-12 md:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

            {/* Sidebar / Profile Card */}
            <div className="md:w-1/3 space-y-6">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-[2rem] bg-blue-600 overflow-hidden shadow-2xl shadow-blue-200 flex items-center justify-center text-4xl font-black text-white">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg cursor-pointer hover:bg-black transition-colors">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-1">{user.firstName} {user.lastName}</h2>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-6">{user.role} Member</p>

                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all border border-red-100/50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Quick Links / Stats */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/10">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold opacity-80">Payment Methods</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold opacity-80">Order History</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Info Area */}
            <div className="md:w-2/3">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/40">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Information</h1>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-black rounded-2xl hover:bg-blue-100 transition-all border border-blue-100"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-10">
                  {/* Personal Section */}
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <User className="w-4 h-4" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.lastName}</p>
                        )}
                      </div>
                      {isEditing && (
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Avatar Image URL</label>
                          <input
                            type="text"
                            value={formData.avatar}
                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Contact Section */}
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Contact & Communication
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-400">{user.email}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                            placeholder="Not set"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.phone || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Address Section */}
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Billing & Shipping
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Street Address</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.address?.street || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.address?.city || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">State / Province</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.address?.state || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Country</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.address?.country || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Postal Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500/50 transition-all font-bold text-slate-900"
                          />
                        ) : (
                          <p className="px-5 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-900">{user.address?.zipCode || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
