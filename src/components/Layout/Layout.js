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

  // Auto-redirect users to their appropriate space based on role
  useEffect(() => {
    if (user?.role === 'Guichetier') {
      // Define allowed paths for Guichetier role
      const allowedPaths = ['/espace-guichetier', '/issues', '/tasks', '/notifications'];
      if (!allowedPaths.includes(location.pathname)) {
      navigate('/espace-guichetier');
      }
    } else if (user?.role === 'Agent') {
      // Define allowed paths for Agent role
      const allowedPaths = ['/dashboard', '/issues', '/tasks', '/fiches-execution', '/notifications'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Agent Chambre') {
      // Define allowed paths for Agent Chambre role
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/fiches-execution', '/notifications'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Web Master') {
      // Define allowed paths for Web Master role
      const allowedPaths = ['/dashboard', '/issues', '/tasks', '/notifications', '/suivi-documentation'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Superviseur Stock') {
      // Define allowed paths for Superviseur Stock role
      const allowedPaths = ['/spaces', '/issues', '/tasks', '/inventory', '/buanderie', '/demandes-affectation', '/cycle-vie-articles', '/demandes-fonds', '/notifications'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/spaces');
      }
    } else if (user?.role === 'Superviseur Housing') {
      // Define allowed paths for Superviseur Housing role
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/fiches-execution', '/demandes-fonds', '/demandes-affectation', '/notifications'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Superviseur Finance') {
      // Define allowed paths for Superviseur Finance role
      const allowedPaths = ['/dashboard', '/issues', '/tasks', '/expenses', '/my-payments', '/cash-registers', '/banks', '/pos', '/financial-reports', '/espace-guichetier', '/validation-demandes', '/demandes-fonds', '/demandes-affectation', '/notifications'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Superviseur RH') {
      // Define allowed paths for Superviseur RH role
      const allowedPaths = [
        '/dashboard', '/issues', '/tasks', '/departements', '/sous-departements', 
        '/demandes-fonds', '/demandes-affectation', '/users', '/notifications',
        // Chemins RH
        '/rh', '/rh/gestion-employes', '/rh/recrutement-integration', '/rh/temps-presences',
        '/rh/paie-avantages', '/rh/performance-formation', '/rh/communication-rh'
      ];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
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
      { 
        name: 'Ressources Humaines', 
        icon: 'UsersIcon',
        submenu: [
          { name: 'Gestion des Employés', href: '/rh/gestion-employes' },
          { name: 'Recrutement & Intégration', href: '/rh/recrutement-integration' },
          { name: 'Temps & Présences', href: '/rh/temps-presences' },
          { name: 'Paie & Avantages', href: '/rh/paie-avantages' },
          { name: 'Performance & Formation', href: '/rh/performance-formation' },
          { name: 'Communication RH', href: '/rh/communication-rh' }
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
    { name: "Fiches d'intervention", href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
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
      },
      { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Agent') {
    // Special case for Agent role - they only see specific menus
    filteredNavigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: 'HomeIcon' },
      { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: "Fiches d'intervention", href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Agent Chambre') {
    // Special case for Agent Chambre role - they only see specific menus
    filteredNavigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: 'HomeIcon' },
      { name: 'Espaces & Locaux', href: '/spaces', icon: 'BuildingOfficeIcon' },
      { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: "Fiches d'intervention", href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Web Master') {
    // Special case for Web Master role - they only see specific menus
    filteredNavigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: 'HomeIcon' },
      { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' },
      { name: 'Suivi et Documentation', href: '/suivi-documentation', icon: 'DocumentTextIcon' }
    ];
  } else if (user?.role === 'Superviseur Stock') {
    // Special case for Superviseur Stock role - they only see specific menus
    filteredNavigation = [
      { name: 'Espaces & Locaux', href: '/spaces', icon: 'BuildingOfficeIcon' },
      { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { 
        name: 'Inventaire', 
        icon: 'CubeIcon',
        submenu: [
          { name: 'Gestion des stocks', href: '/inventory' },
          { name: 'Buanderie', href: '/buanderie' }
        ]
      },
      { name: "Bons de prelevement", href: '/demandes-affectation', icon: 'ClipboardDocumentListIcon' },
      { name: "Cycle de Vie des Articles", href: '/cycle-vie-articles', icon: 'ArrowPathIcon' },
      { name: "Demandes de fonds", href: '/demandes-fonds', icon: 'BanknotesIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur Housing') {
    // Special case for Superviseur Housing role - they only see specific menus
    filteredNavigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: 'HomeIcon' },
      { name: 'Espaces & Locaux', href: '/spaces', icon: 'BuildingOfficeIcon' },
      { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: "Fiches d'intervention", href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
      { name: "Demandes de fonds", href: '/demandes-fonds', icon: 'BanknotesIcon' },
      { name: "Bons de prelevement", href: '/demandes-affectation', icon: 'ClipboardDocumentListIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur Finance') {
    // Special case for Superviseur Finance role - they only see specific menus
    filteredNavigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: 'HomeIcon' },
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
      { name: "Demandes de fonds", href: '/demandes-fonds', icon: 'BanknotesIcon' },
      { name: "Bons de prelevement", href: '/demandes-affectation', icon: 'ClipboardDocumentListIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur RH') {
    // Special case for Superviseur RH role - they only see specific menus
    filteredNavigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: 'HomeIcon' },
      { name: 'Problèmes', href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: 'Tâches', href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      {
        name: 'Départements',
        href: '/departements',
        icon: 'BuildingOfficeIcon',
        submenu: [
          { name: 'Départements', href: '/departements' },
          { name: 'Sous-départements', href: '/sous-departements' }
        ]
      },
      { 
        name: 'Ressources Humaines', 
        icon: 'UsersIcon',
        submenu: [
          { name: 'Gestion des Employés', href: '/rh/gestion-employes' },
          { name: 'Recrutement & Intégration', href: '/rh/recrutement-integration' },
          { name: 'Temps & Présences', href: '/rh/temps-presences' },
          { name: 'Paie & Avantages', href: '/rh/paie-avantages' },
          { name: 'Performance & Formation', href: '/rh/performance-formation' },
          { name: 'Communication RH', href: '/rh/communication-rh' }
        ]
      },
      { name: "Demandes de fonds", href: '/demandes-fonds', icon: 'BanknotesIcon' },
      { name: "Bons de prelevement", href: '/demandes-affectation', icon: 'ClipboardDocumentListIcon' },
      { name: 'Utilisateurs', href: '/users', icon: 'UsersIcon' },
      { name: 'Notifications', href: '/notifications', icon: 'BellIcon' }
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
        isAgent={user?.role === 'Agent'}
        isWebMaster={user?.role === 'Web Master'}
        isSuperviseurStock={user?.role === 'Superviseur Stock'}
        isSuperviseurHousing={user?.role === 'Superviseur Housing'}
        isSuperviseurFinance={user?.role === 'Superviseur Finance'}
        isSuperviseurRH={user?.role === 'Superviseur RH'}
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