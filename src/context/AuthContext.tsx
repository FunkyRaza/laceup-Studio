import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { User } from '@/types';


interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('laceup_current_user');
    if (storedUser) {
      let userData = JSON.parse(storedUser);
      
      // Normalize user data structure when loading from localStorage
      if (userData.role === 'admin' || userData.role === 'superadmin') {
        // For admin users, split name into firstName and lastName if they don't exist
        if (userData.name && (!userData.firstName || !userData.lastName)) {
          const nameParts = userData.name.split(' ');
          userData.firstName = nameParts[0] || '';
          userData.lastName = nameParts.slice(1).join(' ') || '';
        }
      }
      
      setUser(userData);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Normalize user data structure to ensure consistency between admin and regular users
      let normalizedUserData = { ...data };
      if (data.role === 'admin' || data.role === 'superadmin') {
        // For admin users, split name into firstName and lastName if they don't exist
        if (data.name && (!data.firstName || !data.lastName)) {
          const nameParts = data.name.split(' ');
          normalizedUserData.firstName = nameParts[0] || '';
          normalizedUserData.lastName = nameParts.slice(1).join(' ') || '';
        }
      }
      
      setUser(normalizedUserData);
      localStorage.setItem('laceup_current_user', JSON.stringify(normalizedUserData));

      const isManageable = normalizedUserData.role === 'admin' || normalizedUserData.role === 'superadmin';
      toast.success(isManageable ? 'Welcome to Admin Dashboard!' : `Welcome back, ${normalizedUserData.name}!`);
      return true;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Invalid email or password';
      toast.error(errorMsg);
      return false;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/users', { name: `${firstName} ${lastName}`, email, password });
      
      // Normalize user data structure for new signups
      let normalizedUserData = { ...data, firstName, lastName };
      
      setUser(normalizedUserData);
      localStorage.setItem('laceup_current_user', JSON.stringify(normalizedUserData));
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Account creation failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('laceup_current_user');
    toast.success('You have been logged out');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      let updatedUser = { ...user, ...updates };
      
      // Normalize user data structure when updating profile
      if (updatedUser.role === 'admin' || updatedUser.role === 'superadmin') {
        // For admin users, ensure firstName and lastName exist
        if (updatedUser.name && (!updatedUser.firstName || !updatedUser.lastName)) {
          const nameParts = updatedUser.name.split(' ');
          updatedUser.firstName = nameParts[0] || '';
          updatedUser.lastName = nameParts.slice(1).join(' ') || '';
        }
      }
      
      setUser(updatedUser);
      localStorage.setItem('laceup_current_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
