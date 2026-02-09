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
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('laceup_current_user', JSON.stringify(data));

      const isManageable = data.role === 'admin' || data.role === 'superadmin';
      toast.success(isManageable ? 'Welcome to Admin Dashboard!' : `Welcome back, ${data.name}!`);
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
      setUser(data);
      localStorage.setItem('laceup_current_user', JSON.stringify(data));
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
      const updatedUser = { ...user, ...updates };
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
