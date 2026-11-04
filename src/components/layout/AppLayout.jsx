import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export const AppLayout = () => {
  // Default open on desktop (>= 1024px), closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f1f4f9] dark:bg-[#070b14] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <div className="flex-1 flex">
        {/* Dynamic Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
          }`}
        >
          <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} isSidebarOpen={sidebarOpen} />

          <main className="flex-1 p-3 sm:p-4 lg:p-5 w-full mx-auto max-w-[1750px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
