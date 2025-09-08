import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { 
  hasPermission, 
  hasRole, 
  getRolePermissions, 
  getRoleLabel, 
  getPermissionLabel,
  ROLES,
  PERMISSIONS 
} from '../config/roles';

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth();
  
  const userRole = user?.role || user?.userRole;
  const userPermissions = useMemo(() => {
    return getRolePermissions(userRole);
  }, [userRole]);

  const checkPermission = (permission) => {
    return hasPermission(userRole, permission);
  };

  const checkRole = (allowedRoles) => {
    return hasRole(userRole, allowedRoles);
  };

  const checkAnyPermission = (permissions) => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.some(permission => checkPermission(permission));
  };

  const checkAllPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.every(permission => checkPermission(permission));
  };

  const isPatron = userRole === ROLES.PATRON;
  const isAdmin = userRole === ROLES.ADMINISTRATEUR;
  const isWebMaster = userRole === ROLES.WEB_MASTER;
  const isSuperviseur = userRole === ROLES.SUPERVISEUR;
  const isSuperviseurStock = userRole === ROLES.SUPERVISEUR_STOCK;
  const isSuperviseurComptable = userRole === ROLES.SUPERVISEUR_COMPTABLE;
  const isSuperviseurRH = userRole === ROLES.SUPERVISEUR_RH;
  const isAgent = userRole === ROLES.AGENT;
  const isGuichetier = userRole === ROLES.GUICHETIER;

  // Permissions spécifiques
  const canViewDashboard = checkPermission(PERMISSIONS.DASHBOARD);
  const canViewEspacesLocaux = checkPermission(PERMISSIONS.ESPACES_LOCAUX);
  const canViewDepartements = checkPermission(PERMISSIONS.DEPARTEMENTS);
  const canViewUtilisateurs = checkPermission(PERMISSIONS.UTILISATEURS);
  const canViewNotifications = checkPermission(PERMISSIONS.NOTIFICATIONS);
  const canViewFinances = checkPermission(PERMISSIONS.FINANCES);
  const canViewProblemes = checkPermission(PERMISSIONS.PROBLEMES);
  const canViewTaches = checkPermission(PERMISSIONS.TACHES);
  const canViewInventaire = checkPermission(PERMISSIONS.INVENTAIRE);
  const canViewFichesExecution = checkPermission(PERMISSIONS.FICHES_EXECUTION);
  const canViewDemandesFonds = checkPermission(PERMISSIONS.DEMANDES_FONDS);
  const canViewBonsPrelevement = checkPermission(PERMISSIONS.BONS_PRELEVEMENT);
  const canViewCycleVieArticles = checkPermission(PERMISSIONS.CYCLE_VIE_ARTICLES);
  const canViewSuiviDocumentation = checkPermission(PERMISSIONS.SUIVI_DOCUMENTATION);
  const canViewEspaceGuichetier = checkPermission(PERMISSIONS.ESPACE_GUICHETIER);

  const value = {
    // Rôle de l'utilisateur
    userRole,
    userPermissions,
    roleLabel: getRoleLabel(userRole),
    
    // Fonctions de vérification
    checkPermission,
    checkRole,
    checkAnyPermission,
    checkAllPermissions,
    
    // Rôles spécifiques
    isPatron,
    isAdmin,
    isWebMaster,
    isSuperviseur,
    isSuperviseurStock,
    isSuperviseurComptable,
    isSuperviseurRH,
    isAgent,
    isGuichetier,
    
    // Permissions spécifiques
    canViewDashboard,
    canViewEspacesLocaux,
    canViewDepartements,
    canViewUtilisateurs,
    canViewNotifications,
    canViewFinances,
    canViewProblemes,
    canViewTaches,
    canViewInventaire,
    canViewFichesExecution,
    canViewDemandesFonds,
    canViewBonsPrelevement,
    canViewCycleVieArticles,
    canViewSuiviDocumentation,
    canViewEspaceGuichetier,
    
    // Constantes exportées
    ROLES,
    PERMISSIONS
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
