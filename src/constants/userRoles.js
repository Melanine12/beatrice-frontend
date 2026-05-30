/**
 * Rôles `tbl_utilisateurs.role` — alignés backend (Sequelize ENUM + validation routes/users).
 */
export const USER_ROLE_OPTIONS = [
  { value: 'Superviseur Finance', label: 'Superviseur Finance' },
  { value: 'Superviseur Stock', label: 'Superviseur Stock' },
  { value: 'Agent', label: 'Agent' },
  { value: 'Superviseur Technique', label: 'Superviseur Technique' },
  { value: 'Guichetier', label: 'Guichetier' },
  { value: 'Web Master', label: 'Web Master' },
  { value: 'Superviseur Housing', label: 'Superviseur Housing' },
  { value: 'Superviseur Resto', label: 'Superviseur Resto' },
  { value: 'Superviseur Comptable', label: 'Superviseur Comptable' },
  { value: 'Superviseur RH', label: 'Superviseur RH' },
  { value: 'Agent Exterieur', label: 'Agent Exterieur' },
  { value: 'Agent Gouvernant', label: 'Agent Gouvernant' },
  { value: 'Agent Chambre', label: 'Agent Chambre' },
  { value: 'Booker', label: 'Booker' },
  { value: 'call_center', label: 'Call center' },
  { value: 'Auditeur', label: 'Auditeur' },
  { value: 'Saisisseur', label: 'Saisisseur' },
  { value: 'Verificateur Sygrem', label: 'Verificateur Sygrem' },
  { value: 'Controlleur Sygram', label: 'Controlleur Sygram' },
  { value: 'Gestionnaire des Plaintes', label: 'Gestionnaire des Plaintes' },
  { value: 'Directeur Opérations', label: 'Directeur Opérations' },
  { value: 'Directeur Operations', label: 'Directeur Operations' }
];
