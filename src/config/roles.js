// Configuration des rôles et permissions
export const ROLES = {
  PATRON: 'patron',
  ADMINISTRATEUR: 'administrateur',
  WEB_MASTER: 'web_master',
  SUPERVISEUR: 'superviseur',
  SUPERVISEUR_STOCK: 'superviseur_stock',
  SUPERVISEUR_COMPTABLE: 'superviseur_comptable',
  SUPERVISEUR_RH: 'superviseur_rh',
  AGENT: 'agent',
  GUICHETIER: 'guichetier'
};

// Définition des permissions
export const PERMISSIONS = {
  // Tableau de bord
  DASHBOARD: 'dashboard',
  
  // Espaces & Locaux
  ESPACES_LOCAUX: 'espaces_locaux',
  
  // Départements
  DEPARTEMENTS: 'departements',
  
  // Utilisateurs
  UTILISATEURS: 'utilisateurs',
  
  // Notifications
  NOTIFICATIONS: 'notifications',
  
  // Finances
  FINANCES: 'finances',
  
  // Problèmes
  PROBLEMES: 'problemes',
  
  // Tâches
  TACHES: 'taches',
  
  // Inventaire
  INVENTAIRE: 'inventaire',
  
  // Fiches d'exécution
  FICHES_EXECUTION: 'fiches_execution',
  
  // Demandes de fonds
  DEMANDES_FONDS: 'demandes_fonds',
  
  // Bons de prélèvement
  BONS_PRELEVEMENT: 'bons_prelevement',
  
  // Cycle de Vie des Articles
  CYCLE_VIE_ARTICLES: 'cycle_vie_articles',
  
  // Suivi & Documentation
  SUIVI_DOCUMENTATION: 'suivi_documentation',
  
  // Espace Guichetier
  ESPACE_GUICHETIER: 'espace_guichetier',
  
  // Tout voir (Patron)
  TOUT_VOIR: 'tout_voir'
};

// Matrice des permissions par rôle
export const ROLE_PERMISSIONS = {
  [ROLES.PATRON]: [
    PERMISSIONS.TOUT_VOIR
  ],
  
  [ROLES.ADMINISTRATEUR]: [
    PERMISSIONS.ESPACES_LOCAUX,
    PERMISSIONS.DEPARTEMENTS,
    PERMISSIONS.UTILISATEURS,
    PERMISSIONS.NOTIFICATIONS,
    PERMISSIONS.FINANCES
  ],
  
  [ROLES.WEB_MASTER]: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.NOTIFICATIONS,
    PERMISSIONS.SUIVI_DOCUMENTATION
  ],
  
  [ROLES.SUPERVISEUR]: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.PROBLEMES,
    PERMISSIONS.TACHES,
    PERMISSIONS.INVENTAIRE,
    PERMISSIONS.FICHES_EXECUTION,
    PERMISSIONS.DEMANDES_FONDS
  ],
  
  [ROLES.SUPERVISEUR_STOCK]: [
    PERMISSIONS.INVENTAIRE,
    PERMISSIONS.BONS_PRELEVEMENT,
    PERMISSIONS.CYCLE_VIE_ARTICLES,
    PERMISSIONS.DEMANDES_FONDS
  ],
  
  [ROLES.SUPERVISEUR_COMPTABLE]: [
    PERMISSIONS.FINANCES,
    PERMISSIONS.FICHES_EXECUTION,
    PERMISSIONS.DEMANDES_FONDS
  ],
  
  [ROLES.SUPERVISEUR_RH]: [
    PERMISSIONS.DEPARTEMENTS,
    PERMISSIONS.UTILISATEURS,
    PERMISSIONS.DEMANDES_FONDS
  ],
  
  [ROLES.AGENT]: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.PROBLEMES,
    PERMISSIONS.TACHES
  ],
  
  [ROLES.GUICHETIER]: [
    PERMISSIONS.ESPACE_GUICHETIER,
    PERMISSIONS.DEMANDES_FONDS,
    PERMISSIONS.FICHES_EXECUTION
  ]
};

// Labels des rôles pour l'affichage
export const ROLE_LABELS = {
  [ROLES.PATRON]: 'Patron',
  [ROLES.ADMINISTRATEUR]: 'Administrateur',
  [ROLES.WEB_MASTER]: 'Web Master',
  [ROLES.SUPERVISEUR]: 'Superviseur',
  [ROLES.SUPERVISEUR_STOCK]: 'Superviseur Stock',
  [ROLES.SUPERVISEUR_COMPTABLE]: 'Superviseur Comptable',
  [ROLES.SUPERVISEUR_RH]: 'Superviseur RH',
  [ROLES.AGENT]: 'Agent',
  [ROLES.GUICHETIER]: 'Guichetier'
};

// Labels des permissions pour l'affichage
export const PERMISSION_LABELS = {
  [PERMISSIONS.DASHBOARD]: 'Tableau de bord',
  [PERMISSIONS.ESPACES_LOCAUX]: 'Espaces & Locaux',
  [PERMISSIONS.DEPARTEMENTS]: 'Départements',
  [PERMISSIONS.UTILISATEURS]: 'Utilisateurs',
  [PERMISSIONS.NOTIFICATIONS]: 'Notifications',
  [PERMISSIONS.FINANCES]: 'Finances',
  [PERMISSIONS.PROBLEMES]: 'Problèmes',
  [PERMISSIONS.TACHES]: 'Tâches',
  [PERMISSIONS.INVENTAIRE]: 'Inventaire',
  [PERMISSIONS.FICHES_EXECUTION]: 'Fiches d\'exécution',
  [PERMISSIONS.DEMANDES_FONDS]: 'Demandes de fonds',
  [PERMISSIONS.BONS_PRELEVEMENT]: 'Bons de prélèvement',
  [PERMISSIONS.CYCLE_VIE_ARTICLES]: 'Cycle de Vie des Articles',
  [PERMISSIONS.SUIVI_DOCUMENTATION]: 'Suivi & Documentation',
  [PERMISSIONS.ESPACE_GUICHETIER]: 'Espace Guichetier',
  [PERMISSIONS.TOUT_VOIR]: 'Tout voir'
};

// Fonction utilitaire pour vérifier si un utilisateur a une permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  // Le patron a accès à tout
  if (userRole === ROLES.PATRON) return true;
  
  // Vérifier si le rôle a la permission
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

// Fonction utilitaire pour vérifier si un utilisateur a l'un des rôles
export const hasRole = (userRole, allowedRoles) => {
  if (!userRole || !allowedRoles) return false;
  
  // Le patron a accès à tout
  if (userRole === ROLES.PATRON) return true;
  
  return allowedRoles.includes(userRole);
};

// Fonction pour obtenir toutes les permissions d'un rôle
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Fonction pour obtenir le label d'un rôle
export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

// Fonction pour obtenir le label d'une permission
export const getPermissionLabel = (permission) => {
  return PERMISSION_LABELS[permission] || permission;
};
