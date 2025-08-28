import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
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

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'Espaces & Locaux', href: '/spaces', icon: 'BuildingOfficeIcon' },
    {
      name: 'Départements',
      href: '/departements',
      icon: 'BuildingOfficeIcon',
      submenu: [
        { name: 'Départements', href: '/departements' },
        { name: 'Sous-départements', href: '/sous-departements' }
      ]
    },
    { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
    { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
    { 
      name: 'Finances', 
      icon: 'BanknotesIcon',
      submenu: [
        { name: 'Decaissements', href: '/expenses' },
        { name: 'Encaissements', href: '/my-payments' },
        { name: 'Caisses', href: '/cash-registers' },
        { name: 'Banques', href: '/banks' },
        { name: 'Point de Vente', href: '/pos' },
        { name: 'États financiers', href: '/financial-reports' },
        { name: 'Espace Guichetier', href: '/espace-guichetier' },
        { name: 'Validation Demandes', href: '/validation-demandes' }
      ]
    },
    { 
      name: 'Inventaire', 
      icon: 'CubeIcon',
      submenu: [
        { name: 'Gestion des stocks', href: '/inventory' },
        { name: 'Buanderie', href: '/buanderie' }
      ]
    },
    { name: "Bons de prelevement", href: '/demandes-affectation', icon: 'ClipboardDocumentListIcon' },
    { name: "Demandes de fonds", href: '/demandes-fonds', icon: 'BanknotesIcon' },
    { name: "Fiches d'exécution", href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
    { name: "Cycle de Vie des Articles", href: '/cycle-vie-articles', icon: 'ArrowPathIcon' },
    { name: 'Utilisateurs', href: '/users', icon: 'UsersIcon' },
    { name: 'Notifications', href: '/notifications', icon: 'BellIcon' },
    { name: 'Suivi et Documentation', href: '/suivi-documentation', icon: 'DocumentTextIcon' },
    /* { name: 'Investisseurs', href: '/investors', icon: 'UserGroupIcon' }, */
  ];

  // Filter navigation based on user role
  let filteredNavigation;
  
  // Special case for Guichetier role - they only see their specific space
  if (user?.role === 'Guichetier') {
    filteredNavigation = [
      { 
        name: 'Espace Guichetier', 
        href: '/espace-guichetier', 
        icon: 'BanknotesIcon' 
      }
    ];
  } else {
    // For other roles, apply normal filtering
    filteredNavigation = navigation.map(item => {
      if (item.submenu) {
        // Filter submenu items based on permissions
        const filteredSubmenu = item.submenu.filter(subItem => {
          // Only Patron can access Financial Reports
          if (subItem.href === '/financial-reports' && !hasPermission('Patron')) {
            return false;
          }
          // Only Guichetier can access Espace Guichetier
          if (subItem.href === '/espace-guichetier' && user?.role !== 'Guichetier') {
            return false;
          }
          // Only Superviseur and above can access Validation Demandes
          if (subItem.href === '/validation-demandes' && !hasPermission('Superviseur')) {
            return false;
          }
          return true;
        });
        
        return {
          ...item,
          submenu: filteredSubmenu
        };
      } else {
        // Only Administrateur can access Users, Inventory, Tasks, and Departements
        if ((item.href === '/users' || item.href === '/inventory' || item.href === '/tasks' || item.href === '/departements') && !hasPermission('Administrateur')) {
          return null;
        }
        return item;
      }
    }).filter(Boolean); // Remove null items
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        navigation={filteredNavigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isGuichetier={user?.role === 'Guichetier'}
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