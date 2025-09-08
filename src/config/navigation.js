import {
  HomeIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ArchiveBoxIcon,
  WrenchScrewdriverIcon,
  DocumentChartBarIcon,
  UserCircleIcon,
  CogIcon,
  EyeIcon,
  ClipboardDocumentIcon,
  TruckIcon,
  BeakerIcon,
  ChartPieIcon,
  DocumentMagnifyingGlassIcon,
  HomeModernIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon as FichesIcon,
  CurrencyDollarIcon as FondsIcon,
  WrenchScrewdriverIcon as BuanderieIcon
} from '@heroicons/react/24/outline';

import { PERMISSIONS } from './roles';

// Configuration de navigation basée sur les permissions
export const navigationConfig = [
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: 'HomeIcon',
    permission: PERMISSIONS.DASHBOARD
  },
  {
    name: 'Espaces & Locaux',
    href: '/spaces',
    icon: 'BuildingOfficeIcon',
    permission: PERMISSIONS.ESPACES_LOCAUX
  },
  {
    name: 'Chambres',
    href: '/rooms-list',
    icon: 'HomeModernIcon',
    permission: PERMISSIONS.ESPACES_LOCAUX
  },
  {
    name: 'Problèmes',
    href: '/issues',
    icon: 'ExclamationTriangleIcon',
    permission: PERMISSIONS.PROBLEMES
  },
  {
    name: 'Tâches',
    href: '/tasks',
    icon: 'ClipboardDocumentListIcon',
    permission: PERMISSIONS.TACHES
  },
  {
    name: 'Dépenses',
    href: '/expenses',
    icon: 'BanknotesIcon',
    permission: PERMISSIONS.FINANCES
  },
  {
    name: 'Inventaire',
    href: '/inventory',
    icon: 'CubeIcon',
    permission: PERMISSIONS.INVENTAIRE,
    submenu: [
      {
        name: 'Stock',
        href: '/inventory',
        permission: PERMISSIONS.INVENTAIRE
      },
      {
        name: 'Bons de prélèvement',
        href: '/inventory?tab=bons',
        permission: PERMISSIONS.BONS_PRELEVEMENT
      },
      {
        name: 'Cycle de Vie des Articles',
        href: '/cycle-vie-articles',
        permission: PERMISSIONS.CYCLE_VIE_ARTICLES
      }
    ]
  },
  {
    name: 'Utilisateurs',
    href: '/users',
    icon: 'UsersIcon',
    permission: PERMISSIONS.UTILISATEURS
  },
  {
    name: 'Départements',
    href: '/departements',
    icon: 'BuildingOfficeIcon',
    permission: PERMISSIONS.DEPARTEMENTS,
    submenu: [
      {
        name: 'Départements',
        href: '/departements',
        permission: PERMISSIONS.DEPARTEMENTS
      },
      {
        name: 'Sous-départements',
        href: '/sous-departements',
        permission: PERMISSIONS.DEPARTEMENTS
      }
    ]
  },
  {
    name: 'Affectations',
    href: '/assignments',
    icon: 'UserGroupIcon',
    permission: PERMISSIONS.TACHES
  },
  {
    name: 'Rapports Financiers',
    href: '/financial-reports',
    icon: 'ChartBarIcon',
    permission: PERMISSIONS.FINANCES
  },
  {
    name: 'Mes Paiements',
    href: '/my-payments',
    icon: 'CreditCardIcon',
    permission: PERMISSIONS.FINANCES
  },
  {
    name: 'Caisses',
    href: '/cash-registers',
    icon: 'BuildingLibraryIcon',
    permission: PERMISSIONS.FINANCES
  },
  {
    name: 'Banques',
    href: '/banks',
    icon: 'BuildingLibraryIcon',
    permission: PERMISSIONS.FINANCES
  },
  {
    name: 'POS',
    href: '/pos',
    icon: 'ShoppingCartIcon',
    permission: PERMISSIONS.FINANCES
  },
  {
    name: 'Espace Guichetier',
    href: '/espace-guichetier',
    icon: 'CurrencyDollarIcon',
    permission: PERMISSIONS.ESPACE_GUICHETIER
  },
  {
    name: 'Validation Demandes',
    href: '/validation-demandes',
    icon: 'ClipboardDocumentCheckIcon',
    permission: PERMISSIONS.DEMANDES_FONDS
  },
  {
    name: 'Investisseurs',
    href: '/investors',
    icon: 'ChartPieIcon',
    permission: PERMISSIONS.FINANCES
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: 'BellIcon',
    permission: PERMISSIONS.NOTIFICATIONS
  },
  {
    name: 'Suivi & Documentation',
    href: '/suivi-documentation',
    icon: 'DocumentMagnifyingGlassIcon',
    permission: PERMISSIONS.SUIVI_DOCUMENTATION
  },
  {
    name: 'Demandes d\'Affectation',
    href: '/demandes-affectation',
    icon: 'UserGroupIcon',
    permission: PERMISSIONS.TACHES
  },
  {
    name: 'Demandes de Fonds',
    href: '/demandes-fonds',
    icon: 'FondsIcon',
    permission: PERMISSIONS.DEMANDES_FONDS
  },
  {
    name: 'Fiches d\'Exécution',
    href: '/fiches-execution',
    icon: 'FichesIcon',
    permission: PERMISSIONS.FICHES_EXECUTION
  },
  {
    name: 'Buanderie',
    href: '/buanderie',
    icon: 'BuanderieIcon',
    permission: PERMISSIONS.ESPACES_LOCAUX
  }
];

// Configuration spéciale pour les guichetiers
export const guichetierNavigation = [
  {
    name: 'Espace Guichetier',
    href: '/espace-guichetier',
    icon: 'CurrencyDollarIcon',
    permission: PERMISSIONS.ESPACE_GUICHETIER
  },
  {
    name: 'Demandes de Fonds',
    href: '/demandes-fonds',
    icon: 'FondsIcon',
    permission: PERMISSIONS.DEMANDES_FONDS
  },
  {
    name: 'Fiches d\'Exécution',
    href: '/fiches-execution',
    icon: 'FichesIcon',
    permission: PERMISSIONS.FICHES_EXECUTION
  }
];

// Icônes disponibles
export const iconMap = {
  HomeIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ArchiveBoxIcon,
  WrenchScrewdriverIcon,
  DocumentChartBarIcon,
  UserCircleIcon,
  CogIcon,
  EyeIcon,
  ClipboardDocumentIcon,
  TruckIcon,
  BeakerIcon,
  ChartPieIcon,
  DocumentMagnifyingGlassIcon,
  HomeModernIcon,
  BuildingStorefrontIcon,
  FichesIcon,
  FondsIcon,
  BuanderieIcon
};
