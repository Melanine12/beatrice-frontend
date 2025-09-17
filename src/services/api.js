import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request - Token:', token ? 'Present' : 'Missing');
    console.log('API Request - URL:', config.url);
    console.log('API Request - Method:', config.method);
    
    // Si on envoie des FormData (fichiers), supprimer le Content-Type
    // pour que le navigateur puisse définir automatiquement la boundary
    if (config.data instanceof FormData) {
      console.log('📁 FormData détecté, suppression du Content-Type');
      delete config.headers['Content-Type'];
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request - Authorization header set');
    } else {
      console.log('API Request - No token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions for employees
export const employeeAPI = {
  // Récupérer tous les employés
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.departement) params.append('departement', filters.departement);
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.search) params.append('search', filters.search);
    
    return api.get(`/employees?${params.toString()}`);
  },

  // Récupérer un employé par ID
  getById: (id) => api.get(`/employees/${id}`),

  // Récupérer les statistiques des employés
  getStats: () => api.get('/employees/stats'),

  // Créer un nouvel employé
  create: (employeeData) => api.post('/employees', employeeData),

  // Mettre à jour un employé
  update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),

  // Supprimer un employé
  delete: (id) => api.delete(`/employees/${id}`)
};

// API functions for departments
export const departementAPI = {
  // Récupérer tous les départements
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    return api.get(`/departements?${params.toString()}`);
  },

  // Récupérer un département par ID
  getById: (id) => api.get(`/departements/${id}`),

  // Récupérer les statistiques des départements
  getStats: () => api.get('/departements/stats/overview'),

  // Créer un nouveau département
  create: (departementData) => api.post('/departements', departementData),

  // Mettre à jour un département
  update: (id, departementData) => api.put(`/departements/${id}`, departementData),

  // Supprimer un département
  delete: (id) => api.delete(`/departements/${id}`)
};

// API functions for sub-departments
export const sousDepartementAPI = {
  // Récupérer tous les sous-départements
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.departement_id) params.append('departement_id', filters.departement_id);
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    return api.get(`/sous-departements?${params.toString()}`);
  },

  // Récupérer les sous-départements par département
  getByDepartement: (departementId) => api.get(`/sous-departements/by-departement/${departementId}`),

  // Récupérer un sous-département par ID
  getById: (id) => api.get(`/sous-departements/${id}`),

  // Créer un nouveau sous-département
  create: (sousDepartementData) => api.post('/sous-departements', sousDepartementData),

  // Mettre à jour un sous-département
  update: (id, sousDepartementData) => api.put(`/sous-departements/${id}`, sousDepartementData),

  // Supprimer un sous-département
  delete: (id) => api.delete(`/sous-departements/${id}`)
};

// API pour l'organigramme
export const organigrammeAPI = {
  // Récupérer l'organigramme complet
  getOrganigramme: () => api.get('/organigramme'),

  // Récupérer les employés disponibles
  getEmployesDisponibles: () => api.get('/organigramme/employes-disponibles'),

  // Récupérer un poste par ID
  getPoste: (id) => api.get(`/organigramme/poste/${id}`),

  // Assigner un employé à un poste
  assignerEmploye: (posteId, employeId) => api.post('/organigramme/assigner', { posteId, employeId }),

  // Désassigner un employé d'un poste
  desassignerEmploye: (posteId) => api.delete(`/organigramme/desassigner/${posteId}`),

  // Mettre à jour un poste
  updatePoste: (id, data) => api.put(`/organigramme/poste/${id}`, data)
};

// API functions for bons de ménage
export const bonsMenageAPI = {
  // Récupérer tous les bons de ménage
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.utilisateur_id) params.append('utilisateur_id', filters.utilisateur_id);
    if (filters.numero_chambre_espace) params.append('numero_chambre_espace', filters.numero_chambre_espace);
    if (filters.etat_matin) params.append('etat_matin', filters.etat_matin);
    if (filters.etat_chambre_apres_entretien) params.append('etat_chambre_apres_entretien', filters.etat_chambre_apres_entretien);
    if (filters.shift) params.append('shift', filters.shift);
    if (filters.date_debut) params.append('date_debut', filters.date_debut);
    if (filters.date_fin) params.append('date_fin', filters.date_fin);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    return api.get(`/bons-menage?${params.toString()}`);
  },

  // Récupérer un bon de ménage par ID
  getById: (id) => api.get(`/bons-menage/${id}`),

  // Récupérer les statistiques des bons de ménage
  getStats: () => api.get('/bons-menage/stats/overview'),

  // Récupérer les options pour les formulaires
  getOptions: {
    users: () => api.get('/bons-menage/options/users'),
    spaces: () => api.get('/bons-menage/options/spaces')
  },

  // Créer un nouveau bon de ménage
  create: (bonData) => api.post('/bons-menage', bonData),

  // Mettre à jour un bon de ménage
  update: (id, bonData) => api.put(`/bons-menage/${id}`, bonData),

  // Supprimer un bon de ménage
  delete: (id) => api.delete(`/bons-menage/${id}`)
};

export default api; 