import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PermissionSidebar from './PermissionSidebar';
import Header from './Header';
import LiveChat from '../Chat/LiveChat';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, hasPermission } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-redirect guichetiers to their specific space
  useEffect(() => {
    if (user?.role === 'Guichetier' && location.pathname !== '/espace-guichetier') {
      navigate('/espace-guichetier');
    }
  }, [user, location.pathname, navigate]);


  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <PermissionSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="lg:pl-72">
        <Header
          user={user}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Live Chat System */}
      <LiveChat />
    </div>
  );
};

export default Layout; 