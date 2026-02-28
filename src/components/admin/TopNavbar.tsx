import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

import { useAuth } from '@/context/AuthContext';

interface TopNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            className="mr-4 text-gray-500 hover:text-gray-900 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* <h1 className="text-xl font-semibold text-white capitalize hidden md:block">
            {window.location.pathname.split('/').pop() || 'dashboard'}
          </h1> */}
        </div>

        <div className="flex items-center space-x-6 w-full justify-end">
          {/* Search */}
          <div className="relative hidden md:block w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </Button>

            {/* Back to Website Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden md:flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Website
            </Button>

            <div className="relative group">
              <Button
                variant="ghost"
                className="flex items-center space-x-3 p-1 pl-2 pr-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <span className="hidden md:inline text-gray-700 font-medium text-sm">
                  {user ? 
                    (user.firstName && user.lastName ? 
                      `${user.firstName} ${user.lastName}` : 
                      user.name || 'Admin User') 
                    : 'Admin User'}
                </span>
                <ChevronDown className="h-3 w-3 hidden md:inline" />
              </Button>

              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right">
                <div className="p-1">
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center w-full p-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors mb-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Website
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;