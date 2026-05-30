import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useParametres } from '../../contexts/ParametresContext';
import { buildLayoutNavigationParts } from '../../i18n/buildLayoutNavigationParts';
import Sidebar from './Sidebar';
import Header from './Header';
import LiveChat from '../Chat/LiveChat';
import ModuleResetToolbar from '../Admin/ModuleResetToolbar';
import { isRoleExploitationControleDossiers } from '../../utils/userRoles';

function isDirecteurOperationsRole(role) {
  if (!role) return false;
  const n = String(role)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
  return n.includes('directeur') && n.includes('operation');
}

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, hasPermission } = useAuth();
  const { isDarkMode } = useTheme();
  const { typeLogiciel, parametresLoading } = useParametres();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const nav = useMemo(() => buildLayoutNavigationParts(t), [t, i18n.language]);
  const normalizedUserRole = String(user?.role || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  // Auto-redirect users to their appropriate space based on role
  useEffect(() => {
    const normalizedRole = String(user?.role || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
    if (normalizedRole.includes('saisisseur')) {
      const allowedPaths = ['/exploitation/suivi-saisi', '/task-manager'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/exploitation/suivi-saisi');
      }
      return;
    }

    // Verificateur Sygrem / Controlleur Sygram : Contrôle de dossiers + Task manager (+ profil)
    if (isRoleExploitationControleDossiers(user?.role)) {
      const allowedPaths = ['/exploitation/controle-dossiers', '/task-manager', '/profile'];
      const pathOk = allowedPaths.some(
        (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
      );
      if (!pathOk) {
        navigate('/exploitation/controle-dossiers');
      }
      return;
    }

    if (isDirecteurOperationsRole(user?.role)) {
      if (location.pathname === '/dashboard') {
        navigate('/exploitation');
        return;
      }
      const pathOk =
        location.pathname.startsWith('/bureaux/') ||
        location.pathname.startsWith('/zones') ||
        location.pathname.startsWith('/exploitation') ||
        location.pathname.startsWith('/finances') ||
        location.pathname.startsWith('/expenses') ||
        location.pathname.startsWith('/demandes-fonds') ||
        location.pathname.startsWith('/circuits-depenses') ||
        location.pathname.startsWith('/clients') ||
        location.pathname.startsWith('/soumissions-besoins') ||
        location.pathname.startsWith('/gestion-plaintes') ||
        location.pathname.startsWith('/task-manager') ||
        location.pathname.startsWith('/profile');
      if (!pathOk) {
        navigate('/exploitation');
      }
      return;
    }

    // Jimmy with Superviseur Technique role has restricted access
    if (user?.nom === 'Jimmy' && user?.role === 'Superviseur Technique') {
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/demandes-affectation', '/demandes-fonds', '/soumissions-besoins', '/fiches-execution', '/suivis-maintenances', '/notifications', '/profile', '/rh/sanctions', '/rh/conges-absences', '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
      return;
    }
    
    // Superviseur Technique role (non-Jimmy users) has restricted access
    if (user?.role === 'Superviseur Technique') {
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/demandes-affectation', '/demandes-fonds', '/soumissions-besoins', '/fiches-execution', '/suivis-maintenances', '/notifications', '/profile', '/rh/sanctions', '/rh/conges-absences', '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
      return;
    }
    
    // Jimmy with other roles has access to all pages without redirection
    if (user?.nom === 'Jimmy') {
      return;
    }
    
    if (user?.role === 'Guichetier') {
      // Define allowed paths for Guichetier role
      const allowedPaths = ['/espace-guichetier', '/issues', '/tasks', '/notifications', '/profile'];
      if (!allowedPaths.includes(location.pathname)) {
      navigate('/espace-guichetier');
      }
    } else if (user?.role === 'Agent') {
      // Define allowed paths for Agent role
      const allowedPaths = ['/dashboard', '/issues', '/tasks', '/fiches-execution', '/notifications', '/profile'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Agent Chambre') {
      // Define allowed paths for Agent Chambre role
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/fiches-execution', '/notifications', '/profile'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Agent Exterieur') {
      // Define allowed paths for Agent Exterieur role
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/fiches-execution', '/notifications', '/profile'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Agent Gouvernant') {
      // Define allowed paths for Agent Gouvernant role
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/fiches-execution', '/notifications', '/profile'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Web Master') {
      // Define allowed paths for Web Master role
      const allowedPaths = ['/dashboard', '/issues', '/tasks', '/notifications', '/suivi-documentation', '/profile'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Superviseur Stock') {
      // Superviseur Stock en mode Gestion Hotel : menus réduits (espaces, inventaire, demandes, problèmes, plaintes, tâches)
      const allowedPaths = typeLogiciel === 'hotel'
        ? ['/spaces', '/inventory', '/demandes-fonds', '/demandes-affectation', '/soumissions-besoins', '/issues', '/gestion-plaintes', '/tasks', '/notifications', '/profile']
        : ['/spaces', '/issues', '/tasks', '/inventory', '/buanderie', '/demandes-affectation', '/cycle-vie-articles', '/demandes-fonds', '/notifications', '/profile', '/rh/sanctions', '/rh/conges-absences', '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate(typeLogiciel === 'hotel' ? '/spaces' : '/spaces');
      }
    } else if (user?.role === 'Superviseur Housing') {
      // Define allowed paths for Superviseur Housing role
      const allowedPaths = ['/dashboard', '/spaces', '/issues', '/tasks', '/fiches-execution', '/demandes-fonds', '/demandes-affectation', '/stock-housekeeping', '/notifications', '/profile', '/rh/sanctions', '/rh/conges-absences', '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Superviseur Finance' || user?.role === 'Superviseur Finances') {
      // Define allowed paths for Superviseur Finance : full accès Finances + Soumissions besoins + RH
      const allowedPaths = ['/dashboard', '/issues', '/tasks', '/expenses', '/my-payments', '/cash-registers', '/banks', '/pos', '/financial-reports', '/espace-guichetier', '/validation-demandes', '/demandes-fonds', '/demandes-affectation', '/soumissions-besoins', '/circuits-depenses', '/departements', '/sous-departements', '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance', '/notifications', '/profile', '/users', '/finances', '/finances/plan-comptable', '/finances/ecritures', '/finances/journal-compte', '/finances/tresorerie', '/finances/caisses', '/finances/cotation', '/finances/budget', '/finances/facturation', '/finances/etats-financiers', '/clients'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Superviseur RH') {
      // Define allowed paths for Superviseur RH role (full access to all RH sub-menus + Demandes de fonds, Soumissions besoins)
      const allowedPaths = [
        '/dashboard', '/issues', '/tasks', '/departements', '/sous-departements',
        '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance',
        '/demandes-fonds', '/demandes-affectation', '/soumissions-besoins', '/users', '/notifications', '/profile',
        // Tous les chemins RH
        '/rh', '/rh/gestion-employes', '/rh/recrutement-integration', '/rh/temps-presences',
        '/rh/sanctions', '/rh/conges-absences', '/rh/paie-avantages',
        '/rh/performance-formation', '/rh/communication-rh'
      ];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Superviseur Resto') {
      // Define allowed paths for Superviseur Resto role
      const allowedPaths = [
        '/dashboard', '/issues', '/tasks', '/demandes-affectation', '/demandes-fonds',
        '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance',
        '/cuisine-cost-control', '/cuisine-cost-control/dashboard', '/cuisine-cost-control/consumption',
        '/cuisine-cost-control/recipes', '/cuisine-cost-control/events', '/cuisine-cost-control/inventory',
        '/cuisine-cost-control/reports', '/cuisine-cost-control/inventory-full',
        '/notifications', '/profile', '/rh/sanctions', '/rh/conges-absences'
      ];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Booker') {
      // Define allowed paths for Booker role - only Espaces & Locaux
      const allowedPaths = ['/spaces', '/profile'];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/spaces');
      }
    } else if (user?.role === 'Commercial Booking') {
      // Define allowed paths for Commercial Booking role
      const allowedPaths = [
        '/dashboard', '/profile', '/notifications',
        '/booking/reservation', '/booking/check-in', '/booking/checkout', '/booking/cahier-reservations'
      ];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else if (user?.role === 'Auditeur') {
      // Define allowed paths for Auditeur role (demandes de fonds, soumissions-besoins, décaissements, caisses, etc.)
      const allowedPaths = [
        '/dashboard', '/reporting', '/rapports-journaliers', '/notifications', '/profile',
        '/expenses', '/my-payments', '/cash-registers', '/banks', '/pos', '/financial-reports',
        '/demandes-affectation', '/demandes-fonds', '/soumissions-besoins', '/circuits-depenses', '/issues', '/tasks', '/inventory',
        '/bureaux/directions-provinciales', '/bureaux/bureaux-internationaux', '/zones', '/exploitation', '/exploitation/traitement-dossiers', '/exploitation/controle-avance', '/exploitation/indicateurs-performance',
        '/stock-housekeeping', '/finances/caisses',
        '/cuisine-cost-control', '/cuisine-cost-control/dashboard', '/cuisine-cost-control/consumption',
        '/cuisine-cost-control/recipes', '/cuisine-cost-control/events', '/cuisine-cost-control/inventory',
        '/cuisine-cost-control/reports', '/cuisine-cost-control/inventory-full',
        '/rh/sanctions', '/rh/conges-absences'
      ];
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else {
      // Pour tous les autres rôles (Administrateur, Patron, etc.)
      // Permettre l'accès au profil et au dashboard
      if (location.pathname === '/profile' || location.pathname === '/dashboard') {
        // Allow access
      }
    }
  }, [user, location.pathname, navigate, typeLogiciel]);

  // 1) Type de logiciel (chargé depuis la BDD à la connexion) : définit l’ensemble de menus par type d’entreprise.
  const navigation = useMemo(() => {
    if (typeLogiciel === 'hotel') {
      return [...nav.baseNavWithoutInspections, ...nav.hotelOnlyNav, ...nav.navTail];
    }
    if (typeLogiciel === 'igm_erp') {
      return [...nav.baseNavWithoutInspections, nav.inspectionsNav, ...nav.navTail];
    }
    return [...nav.baseNavWithoutInspections, ...nav.navTail];
  }, [typeLogiciel, nav]);

  // 2) Rôle utilisateur : filtre les menus affichés selon les permissions.
  let filteredNavigation;
  
  // Special case for Guichetier role - they only see their specific space
  if (user?.role === 'Guichetier') {
    filteredNavigation = [
      { name: t('nav.espaceGuichetier'), href: '/espace-guichetier', icon: 'BanknotesIcon' },
      { name: t('nav.problemes'), href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: t('nav.taches'), href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Agent') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      { name: t('nav.problemes'), href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: t('nav.taches'), href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.fichesIntervention'), href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Agent Chambre') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      { name: t('nav.espacesLocaux'), href: '/spaces', icon: 'BuildingOfficeIcon' },
      { name: t('nav.problemes'), href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: t('nav.taches'), href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.fichesIntervention'), href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Agent Exterieur') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      { name: t('nav.espacesLocaux'), href: '/spaces', icon: 'BuildingOfficeIcon' },
      { name: t('nav.problemes'), href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: t('nav.taches'), href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.fichesIntervention'), href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Agent Gouvernant') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      { name: t('nav.espacesLocaux'), href: '/spaces', icon: 'BuildingOfficeIcon' },
      { name: t('nav.problemes'), href: '/issues', icon: 'ExclamationTriangleIcon' },
      { name: t('nav.taches'), href: '/tasks', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.fichesIntervention'), href: '/fiches-execution', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Web Master') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      nav.rhWebMaster,
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur Stock') {
    // Superviseur Stock : menus selon type de logiciel (éviter flash : tant que paramètres pas chargés, afficher menu hotel)
    if (parametresLoading) {
      filteredNavigation = [
        { name: t('nav.espacesLocaux'), href: '/spaces', icon: 'BuildingOfficeIcon' },
        { name: t('nav.gestionStock'), href: '/inventory', icon: 'CubeIcon' },
        { name: t('nav.demandesFonds'), href: '/demandes-fonds', icon: 'BanknotesIcon' },
        { name: t('nav.bonsPrelevements'), href: '/demandes-affectation', icon: 'DocumentTextIcon' },
        { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
        { name: t('nav.problematiques'), href: '/issues', icon: 'ExclamationTriangleIcon' },
        { name: t('nav.plaintes'), href: '/gestion-plaintes', icon: 'ExclamationTriangleIcon' },
        { name: t('nav.taches'), href: '/tasks', icon: 'ClipboardDocumentCheckIcon' },
        { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
      ];
    } else if (typeLogiciel === 'hotel') {
      filteredNavigation = [
        { name: t('nav.espacesLocaux'), href: '/spaces', icon: 'BuildingOfficeIcon' },
        { name: t('nav.gestionStock'), href: '/inventory', icon: 'CubeIcon' },
        { name: t('nav.demandesFonds'), href: '/demandes-fonds', icon: 'BanknotesIcon' },
        { name: t('nav.bonsPrelevements'), href: '/demandes-affectation', icon: 'DocumentTextIcon' },
        { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
        { name: t('nav.problematiques'), href: '/issues', icon: 'ExclamationTriangleIcon' },
        { name: t('nav.plaintes'), href: '/gestion-plaintes', icon: 'ExclamationTriangleIcon' },
        { name: t('nav.taches'), href: '/tasks', icon: 'ClipboardDocumentCheckIcon' },
        { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
      ];
    } else {
      filteredNavigation = [
        { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
        nav.deptMenu,
        nav.bureauxNav,
        nav.zonesNav,
        nav.exploitationNav,
        { name: t('nav.demandesFonds'), href: '/demandes-fonds', icon: 'BanknotesIcon' },
        { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
        nav.rhRestoAuditeur(false),
        { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
        { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
      ];
    }
  } else if (user?.role === 'Superviseur Housing') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      nav.rhRestoAuditeur(false),
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur Finance' || user?.role === 'Superviseur Finances') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.financeSuperviseur,
      { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur RH') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      { name: t('nav.demandesFonds'), href: '/demandes-fonds', icon: 'BanknotesIcon' },
      { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
      nav.rhFull,
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur Resto') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      nav.rhRestoAuditeur(false),
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Booker') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      nav.rhBooker,
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Auditeur') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.financeAuditeur,
      { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      nav.rhRestoAuditeur(false),
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (isRoleExploitationControleDossiers(user?.role)) {
    filteredNavigation = [
      { name: t('nav.controleDossiers'), href: '/exploitation/controle-dossiers', icon: 'ClipboardDocumentCheckIcon' },
      { name: t('nav.taskManager'), href: '/task-manager', icon: 'ClipboardDocumentListIcon' }
    ];
  } else if (normalizedUserRole.includes('saisisseur')) {
    filteredNavigation = [
      { name: t('nav.suiviSaisi'), href: '/exploitation/suivi-saisi', icon: 'WrenchIcon' },
      { name: t('nav.taskManager'), href: '/task-manager', icon: 'ClipboardDocumentCheckIcon' }
    ];
  } else if (isDirecteurOperationsRole(user?.role)) {
    filteredNavigation = [
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      nav.financeSuperviseur,
      { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
      { name: t('nav.gestionPlaintes'), href: '/gestion-plaintes', icon: 'ExclamationTriangleIcon' },
      { name: t('nav.taskManager'), href: '/task-manager', icon: 'ClipboardDocumentCheckIcon' }
    ];
  } else if (user?.nom === 'Jimmy' && user?.role === 'Superviseur Technique') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      { name: t('nav.demandesFonds'), href: '/demandes-fonds', icon: 'BanknotesIcon' },
      { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
      nav.rhRestoAuditeur(false),
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else if (user?.role === 'Superviseur Technique') {
    filteredNavigation = [
      { name: t('nav.tableauDeBord'), href: '/dashboard', icon: 'HomeIcon' },
      nav.deptMenu,
      nav.bureauxNav,
      nav.zonesNav,
      nav.exploitationNav,
      { name: t('nav.demandesFonds'), href: '/demandes-fonds', icon: 'BanknotesIcon' },
      { name: t('nav.soumissionsBesoins'), href: '/soumissions-besoins', icon: 'ClipboardDocumentListIcon' },
      nav.rhRestoAuditeur(false),
      { name: t('nav.utilisateurs'), href: '/users', icon: 'UsersIcon' },
      { name: t('nav.notifications'), href: '/notifications', icon: 'BellIcon' }
    ];
  } else {
    // For other roles, apply normal filtering
    filteredNavigation = navigation.map(item => {
      if (item.submenu) {
        // Booking Manager only for Commercial Booking, Administrateur, and Patron
        if (item.name === 'Booking Manager') {
          const allowedRoles = ['Commercial Booking', 'Administrateur', 'Patron'];
          if (!allowedRoles.includes(user?.role) && user?.nom !== 'Jimmy') {
            return null;
          }
        }
        // Cuisine Cost Control only for Patron, Superviseur Resto, and Auditeur
        if (item.name === 'Cuisine Cost Control') {
          const allowedRoles = ['Patron', 'Superviseur Resto', 'Auditeur'];
          if (!allowedRoles.includes(user?.role) && user?.nom !== 'Jimmy') {
            return null;
          }
        }
        // Filter submenu items based on permissions
        const filteredSubmenu = item.submenu.filter(subItem => {
          // Only Patron can access Financial Reports (except Jimmy)
          if (subItem.href === '/financial-reports' && !hasPermission('Patron') && user?.nom !== 'Jimmy') {
            return false;
          }
          // Only Guichetier can access Espace Guichetier (except Jimmy)
          if (subItem.href === '/espace-guichetier' && user?.role !== 'Guichetier' && user?.nom !== 'Jimmy') {
            return false;
          }
          // Only Superviseur and above can access Validation Demandes (except Jimmy)
          if (subItem.href === '/validation-demandes' && !hasPermission('Superviseur') && user?.nom !== 'Jimmy') {
            return false;
          }
          return true;
        });
        
        return {
          ...item,
          submenu: filteredSubmenu
        };
      } else {
        // Stock House keeping only for Patron, Administrateur, Superviseur Housing, and Auditeur
        if (item.href === '/stock-housekeeping') {
          const allowedRoles = ['Patron', 'Administrateur', 'Superviseur Housing', 'Auditeur'];
          if (!allowedRoles.includes(user?.role) && user?.nom !== 'Jimmy') {
            return null;
          }
        }
        // Paramètres système : réservé aux Administrateur et Patron
        if (item.href === '/parametres-systeme' && !hasPermission('Administrateur') && !hasPermission('Patron') && user?.nom !== 'Jimmy') {
          return null;
        }
        // Only Administrateur can access Users and Departements (except Jimmy and Auditeur for Tasks/Inventory/Issues)
        if ((item.href === '/users' || item.href === '/departements') && !hasPermission('Administrateur') && user?.nom !== 'Jimmy') {
          return null;
        }
        // Auditeur can access Issues, Tasks, and Inventory
        if ((item.href === '/issues' || item.href === '/tasks' || item.href === '/inventory') && user?.role === 'Auditeur') {
          return item;
        }
        // Only Administrateur can access Inventory and Tasks (except Jimmy and Auditeur)
        if ((item.href === '/inventory' || item.href === '/tasks') && !hasPermission('Administrateur') && user?.nom !== 'Jimmy' && user?.role !== 'Auditeur') {
          return null;
        }
        return item;
      }
    }).filter(Boolean); // Remove null items
  }

  const canSeeSuiviSaisi = normalizedUserRole.includes('saisisseur');
  filteredNavigation = (filteredNavigation || [])
    .map((item) => {
      if (!item?.submenu) return item;
      const submenu = item.submenu.filter(
        (subItem) => canSeeSuiviSaisi || subItem.href !== '/exploitation/suivi-saisi'
      );
      return { ...item, submenu };
    })
    .filter((item) => !item?.submenu || item.submenu.length > 0);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        navigation={filteredNavigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isGuichetier={user?.role === 'Guichetier'}
        isAgent={user?.role === 'Agent'}
        isAgentChambre={user?.role === 'Agent Chambre'}
        isAgentExterieur={user?.role === 'Agent Exterieur'}
        isAgentGouvernant={user?.role === 'Agent Gouvernant'}
        isWebMaster={user?.role === 'Web Master'}
        isSuperviseurStock={user?.role === 'Superviseur Stock'}
        isSuperviseurHousing={user?.role === 'Superviseur Housing'}
        isSuperviseurFinance={user?.role === 'Superviseur Finance' || user?.role === 'Superviseur Finances'}
        isSuperviseurRH={user?.role === 'Superviseur RH'}
        onCollapseChange={setSidebarCollapsed}
      />
      
      <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-80'}`}>
        <Header
          user={user}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="py-6 min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ModuleResetToolbar />
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