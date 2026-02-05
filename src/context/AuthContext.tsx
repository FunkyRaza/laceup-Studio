import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser, findUserByEmail, createUser } from '@/lib/storage';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, firstName: string, lastName: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = findUserByEmail(email);
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      toast.success(`Welcome back, ${foundUser.firstName}!`);
      return true;
    }
    toast.error('Invalid email or password');
    return false;
  };

  const signup = (email: string, password: string, firstName: string, lastName: string): boolean => {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      toast.error('An account with this email already exists');
      return false;
    }

    const newUser = createUser({
      email,
      password,
      firstName,
      lastName,
      role: 'customer',
    });

    setUser(newUser);
    setCurrentUser(newUser);
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    toast.success('You have been logged out');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      toast.success('Profile updated successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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
