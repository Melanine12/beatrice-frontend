/**
 * Rôles exploitation — contrôle / vérification dossiers FERI.
 * - Contrôleur Sygram (accent ô) → renommé en Verificateur Sygrem en base
 * - Controlleur Sygram (sans accent) → rôle distinct conservé
 */
export const ROLE_VERIFICATEUR_SYGREM = 'Verificateur Sygrem';
export const ROLE_CONTROLLEUR_SYGRAM = 'Controlleur Sygram';

/** Ancien libellé avec accent (sessions JWT ou données non migrées). */
const LEGACY_CONTROLEUR_ACCENT = 'Contrôleur Sygram';

export function isRoleVerificateurSygrem(role) {
  if (!role) return false;
  if (role === ROLE_VERIFICATEUR_SYGREM) return true;
  if (role === LEGACY_CONTROLEUR_ACCENT) return true;
  const n = normalizeRoleKey(role);
  return n === 'verificateur sygrem';
}

export function isRoleControlleurSygram(role) {
  if (!role) return false;
  if (role === ROLE_CONTROLLEUR_SYGRAM) return true;
  const n = normalizeRoleKey(role);
  return n === 'controlleur sygram';
}

/** Accès menu Contrôle de dossiers + actions FERI (les deux rôles). */
export function isRoleExploitationControleDossiers(role) {
  return isRoleVerificateurSygrem(role) || isRoleControlleurSygram(role);
}

function normalizeRoleKey(role) {
  return String(role)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/** @deprecated Utiliser isRoleVerificateurSygrem ou isRoleExploitationControleDossiers */
export const isRoleControleurSygram = isRoleExploitationControleDossiers;

/** Correspondance rôle utilisateur / rôle cible d'assignation. */
export function assigneeMatchesRoleCible(assigneeRole, roleCible) {
  if (!assigneeRole || !roleCible) return false;
  if (roleCible === ROLE_VERIFICATEUR_SYGREM) {
    return isRoleVerificateurSygrem(assigneeRole) || isRoleControlleurSygram(assigneeRole);
  }
  return assigneeRole === roleCible;
}
