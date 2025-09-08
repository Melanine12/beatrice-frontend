import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../contexts/PermissionContext';
import { useAuth } from '../../contexts/AuthContext';

const PermissionRoute = ({ 
  children, 
  permission, 
  permissions = [], 
  role, 
  roles = [],
  fallback = '/unauthorized',
  requireAll = false 
}) => {
  const { isAuthenticated } = useAuth();
  const { 
    checkPermission, 
    checkRole, 
    checkAnyPermission, 
    checkAllPermissions 
  } = usePermissions();

  // Vérifier l'authentification
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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

  if (!hasAccess) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default PermissionRoute;
