import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

const PermissionGate = ({ 
  children, 
  permission, 
  permissions = [], 
  role, 
  roles = [],
  requireAll = false,
  fallback = null,
  show = true 
}) => {
  const { 
    checkPermission, 
    checkRole, 
    checkAnyPermission, 
    checkAllPermissions 
  } = usePermissions();

  if (!show) {
    return fallback;
  }

  let hasAccess = false;

  // Vérifier les permissions
  if (permission) {
    hasAccess = checkPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? checkAllPermissions(permissions)
      : checkAnyPermission(permissions);
  }

  // Vérifier les rôles
  if (role) {
    hasAccess = hasAccess && checkRole([role]);
  } else if (roles.length > 0) {
    hasAccess = hasAccess && checkRole(roles);
  }

  // Si aucune permission ou rôle spécifié, autoriser l'accès
  if (!permission && permissions.length === 0 && !role && roles.length === 0) {
    hasAccess = true;
  }

  return hasAccess ? children : fallback;
};

export default PermissionGate;
