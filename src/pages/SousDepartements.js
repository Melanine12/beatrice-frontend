import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';
import { 
  BuildingOfficeIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  EyeIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const SousDepartements = () => {
  const { user, hasPermission } = useAuth();
  const [sousDepartements, setSousDepartements] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSousDepartement, setEditingSousDepartement] = useState(null);
  const [viewingSousDepartement, setViewingSousDepartement] = useState(null);
  const [filters, setFilters] = useState({ 
    departement_id: '', 
    statut: '', 
    niveau_hierarchie: '',
    search: '',
    responsable_id: null
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [expandedDepartements, setExpandedDepartements] = useState(new Set());

  const sousDepartementStatuses = ['Actif', 'Inactif', 'En développement'];
  const niveauHierarchieOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchSousDepartements();
    fetchDepartements();
    fetchUsers();
  }, [filters, pagination.page, pagination.limit]);

  const fetchSousDepartements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.departement_id) params.append('departement_id', filters.departement_id);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.niveau_hierarchie) params.append('niveau_hierarchie', filters.niveau_hierarchie);
      if (filters.responsable_id !== null) params.append('responsable_id', filters.responsable_id);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/sous-departements?${params}`);
      setSousDepartements(response.data.sousDepartements);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching sous-departements:', error);
      toast.error('Erreur lors de la récupération des sous-départements');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartements = async () => {
    try {
      const response = await api.get('/departements');
      setDepartements(response.data.departements);
    } catch (error) {
      console.error('Error fetching departements:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingSousDepartement) {
        await api.put(`/sous-departements/${editingSousDepartement.id}`, formData);
        toast.success('Sous-département mis à jour avec succès');
      } else {
        await api.post('/sous-departements', formData);
        toast.success('Sous-département créé avec succès');
      }
      
      setShowModal(false);
      setEditingSousDepartement(null);
      fetchSousDepartements();
    } catch (error) {
      console.error('Error saving sous-departement:', error);
      const message = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce sous-département ?')) {
      return;
    }

    try {
      await api.delete(`/sous-departements/${id}`);
      toast.success('Sous-département supprimé avec succès');
      fetchSousDepartements();
    } catch (error) {
      console.error('Error deleting sous-departement:', error);
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-100 text-green-800',
      'Inactif': 'bg-red-100 text-red-800',
      'En développement': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNiveauColor = (niveau) => {
    const colors = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-purple-100 text-purple-800',
      3: 'bg-indigo-100 text-indigo-800',
      4: 'bg-pink-100 text-pink-800',
      5: 'bg-yellow-100 text-yellow-800'
    };
    return colors[niveau] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleDepartementExpansion = (departementId) => {
    setExpandedDepartements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departementId)) {
        newSet.delete(departementId);
      } else {
        newSet.add(departementId);
      }
      return newSet;
    });
  };

  const getSousDepartementsByDepartement = (departementId) => {
    return sousDepartements.filter(sd => sd.departement_id === departementId);
  };

  if (loading && sousDepartements.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Sous-départements</h1>
          <p className="text-gray-600 mt-2">Organisez la structure hiérarchique de votre hôtel</p>
        </div>
        {hasPermission('Administrateur') && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Ajouter un sous-département
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Département
            </label>
            <select
              value={filters.departement_id}
              onChange={(e) => handleFilterChange({ ...filters, departement_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les départements</option>
              {departements.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filters.statut}
              onChange={(e) => handleFilterChange({ ...filters, statut: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              {sousDepartementStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau hiérarchique
            </label>
            <select
              value={filters.niveau_hierarchie}
              onChange={(e) => handleFilterChange({ ...filters, niveau_hierarchie: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les niveaux</option>
              {niveauHierarchieOptions.map(niveau => (
                <option key={niveau} value={niveau}>Niveau {niveau}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <select
              value={filters.responsable_id || ''}
              onChange={(e) => handleFilterChange({ ...filters, responsable_id: e.target.value || null })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les responsables</option>
              <option value="null">Aucun responsable</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.prenom} {user.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleFilterChange({ 
              departement_id: '', 
              statut: '', 
              niveau_hierarchie: '', 
              responsable_id: null,
              search: '' 
            })}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Sous-départements grouped by department */}
      <div className="space-y-4">
        {departements.map(departement => {
          const departementSousDepartements = getSousDepartementsByDepartement(departement.id);
          const isExpanded = expandedDepartements.has(departement.id);
          
          return (
            <div key={departement.id} className="bg-white rounded-lg shadow">
              {/* Department header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                onClick={() => toggleDepartementExpansion(departement.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: departement.couleur }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900">{departement.nom}</h3>
                    <span className="text-sm text-gray-500">({departement.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {departementSousDepartements.length} sous-département(s)
                    </span>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Sous-départements list */}
              {isExpanded && (
                <div className="p-4">
                  {departementSousDepartements.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Aucun sous-département dans ce département
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {departementSousDepartements.map(sousDepartement => (
                        <div key={sousDepartement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNiveauColor(sousDepartement.niveau_hierarchie)}`}>
                                N{sousDepartement.niveau_hierarchie}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sousDepartement.statut)}`}>
                                {sousDepartement.statut}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{sousDepartement.nom}</h4>
                              <p className="text-sm text-gray-500">{sousDepartement.code}</p>
                              {sousDepartement.Responsable ? (
                                <p className="text-xs text-blue-600 mt-1">
                                  👤 {sousDepartement.Responsable.prenom} {sousDepartement.Responsable.nom}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-400 mt-1">
                                  👤 Aucun responsable assigné
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {sousDepartement.budget_annuel && (
                              <span className="text-sm text-gray-600">
                                {parseFloat(sousDepartement.budget_annuel).toLocaleString('fr-FR')} €
                              </span>
                            )}
                            {sousDepartement.capacite_equipe && (
                              <span className="text-sm text-gray-600">
                                👥 {sousDepartement.capacite_equipe} pers.
                              </span>
                            )}
                            <button
                              onClick={() => setViewingSousDepartement(sousDepartement)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {hasPermission('Administrateur') && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingSousDepartement(sousDepartement);
                                    setShowModal(true);
                                  }}
                                  className="p-1 text-blue-400 hover:text-blue-600"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(sousDepartement.id)}
                                  className="p-1 text-red-400 hover:text-red-600"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={pagination.limit}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={pagination.total}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <SousDepartementModal
          sousDepartement={editingSousDepartement}
          departements={departements}
          users={users}
          onClose={() => {
            setShowModal(false);
            setEditingSousDepartement(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* View Modal */}
      {viewingSousDepartement && (
        <SousDepartementDetailsModal
          sousDepartement={viewingSousDepartement}
          onClose={() => setViewingSousDepartement(null)}
        />
      )}
    </div>
  );
};

const SousDepartementModal = ({ sousDepartement, departements, users, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: sousDepartement?.nom || '',
    code: sousDepartement?.code || '',
    description: sousDepartement?.description || '',
    departement_id: sousDepartement?.departement_id || '',
    responsable_id: sousDepartement?.responsable_id || '',
    budget_annuel: sousDepartement?.budget_annuel || '',
    statut: sousDepartement?.statut || 'Actif',
    niveau_hierarchie: sousDepartement?.niveau_hierarchie || 1,
    couleur: sousDepartement?.couleur || '#3B82F6',
    capacite_equipe: sousDepartement?.capacite_equipe || '',
    localisation: sousDepartement?.localisation || ''
  });

  const sousDepartementStatuses = ['Actif', 'Inactif', 'En développement'];
  const niveauHierarchieOptions = [1, 2, 3, 4, 5];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      budget_annuel: formData.budget_annuel ? parseFloat(formData.budget_annuel) : null,
      responsable_id: formData.responsable_id ? parseInt(formData.responsable_id) : null,
      capacite_equipe: formData.capacite_equipe ? parseInt(formData.capacite_equipe) : null
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {sousDepartement ? 'Modifier le sous-département' : 'Ajouter un sous-département'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                maxLength={15}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Département *
              </label>
              <select
                name="departement_id"
                value={formData.departement_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un département</option>
                {departements.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nom} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable
              </label>
              <select
                name="responsable_id"
                value={formData.responsable_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Aucun responsable</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nom} {user.prenom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget annuel (€)
              </label>
              <input
                type="number"
                name="budget_annuel"
                value={formData.budget_annuel}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité équipe
              </label>
              <input
                type="number"
                name="capacite_equipe"
                value={formData.capacite_equipe}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut *
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sousDepartementStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau hiérarchique *
              </label>
              <select
                name="niveau_hierarchie"
                value={formData.niveau_hierarchie}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {niveauHierarchieOptions.map(niveau => (
                  <option key={niveau} value={niveau}>Niveau {niveau}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <input
                type="color"
                name="couleur"
                value={formData.couleur}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                type="text"
                name="localisation"
                value={formData.localisation}
                onChange={handleChange}
                maxLength={100}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {sousDepartement ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SousDepartementDetailsModal = ({ sousDepartement, onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-100 text-green-800',
      'Inactif': 'bg-red-100 text-red-800',
      'En développement': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNiveauColor = (niveau) => {
    const colors = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-purple-100 text-purple-800',
      3: 'bg-indigo-100 text-indigo-800',
      4: 'bg-pink-100 text-pink-800',
      5: 'bg-yellow-100 text-yellow-800'
    };
    return colors[niveau] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Détails du sous-département</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Header with color */}
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: `${sousDepartement.couleur}20` }}>
            <div 
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: sousDepartement.couleur }}
            ></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{sousDepartement.nom}</h3>
              <p className="text-sm text-gray-600">{sousDepartement.code}</p>
            </div>
          </div>

          {/* Status and hierarchy */}
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(sousDepartement.statut)}`}>
              {sousDepartement.statut}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getNiveauColor(sousDepartement.niveau_hierarchie)}`}>
              Niveau {sousDepartement.niveau_hierarchie}
            </span>
          </div>

          {/* Department info */}
          {sousDepartement.Departement && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Département parent</h4>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: sousDepartement.Departement.couleur }}
                ></div>
                <span>{sousDepartement.Departement.nom} ({sousDepartement.Departement.code})</span>
              </div>
            </div>
          )}

          {/* Responsible */}
          {sousDepartement.Responsable && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Responsable</h4>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-gray-500" />
                <span>{sousDepartement.Responsable.nom} {sousDepartement.Responsable.prenom}</span>
              </div>
            </div>
          )}

          {/* Budget */}
          {sousDepartement.budget_annuel && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Budget annuel</h4>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                <span className="text-lg font-semibold text-green-600">
                  {parseFloat(sousDepartement.budget_annuel).toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          )}

          {/* Team capacity */}
          {sousDepartement.capacite_equipe && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Capacité équipe</h4>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-gray-500" />
                <span>{sousDepartement.capacite_equipe} personnes</span>
              </div>
            </div>
          )}

          {/* Location */}
          {sousDepartement.localisation && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Localisation</h4>
              <span>{sousDepartement.localisation}</span>
            </div>
          )}

          {/* Creation date */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Date de création</h4>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span>{new Date(sousDepartement.date_creation).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Description */}
          {sousDepartement.description && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Description</h4>
              <p className="text-gray-700">{sousDepartement.description}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SousDepartements;
