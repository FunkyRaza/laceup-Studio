import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Tag,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShoppingCart, label: 'Customers Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers List', path: '/admin/customers' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-0 shadow-lg`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/assets/logo2.jpeg" alt="LacedUp" className="h-8 w-auto object-contain" />
            {/* <span className="text-xl font-bold text-gray-800 tracking-wide">LacedUp</span> */}
          </div>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 mt-4">
          <div className="text-xs font-semibold text-gray-500 mb-4 px-4 uppercase tracking-wider">Dashboard</div>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`relative flex items-center p-3 rounded-xl transition-all duration-300 group overflow-hidden ${active
                      ? 'text-white shadow-md shadow-blue-500/30'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 rounded-xl" />
                    )}
                    <div className="relative z-10 flex items-center w-full">
                      <Icon className={`h-5 w-5 mr-3 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom promo or user small card could go here */}
      </aside>

      {/* Mobile menu button */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-40 lg:hidden text-gray-800 bg-white p-2 rounded-md shadow-md border border-gray-100"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default Sidebar;