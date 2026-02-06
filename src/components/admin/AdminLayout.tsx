import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface AdminLayoutProps { }

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 relative overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 pb-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;