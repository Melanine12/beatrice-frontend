import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
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
  CalendarIcon
} from '@heroicons/react/24/outline';

const Departements = () => {
  const { user, hasPermission } = useAuth();
  const { addNotification } = useNotifications();
  const [departements, setDepartements] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartement, setEditingDepartement] = useState(null);
  const [viewingDepartement, setViewingDepartement] = useState(null);
  const [filters, setFilters] = useState({
    statut: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const departementStatuses = ['Actif', 'Inactif', 'En restructuration'];

  useEffect(() => {
    fetchDepartements();
    fetchUsers();
  }, [filters, pagination.page, pagination.limit]);

  const fetchDepartements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.search) params.append('search', filters.search);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/departements?${params}`);
      const data = response.data;
      
      setDepartements(data.departements || data);
      
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total || data.total || 0,
          totalPages: data.pagination.pages || Math.ceil((data.total || 0) / pagination.limit)
        }));
      }
    } catch (error) {
      console.error('Error fetching departements:', error);
      toast.error('Erreur lors du chargement des départements');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingDepartement) {
        await api.put(`/departements/${editingDepartement.id}`, formData);
        toast.success('Département mis à jour avec succès');
        
        // Notification pour la modification
        addNotification({
          title: 'Département modifié',
          message: `Le département "${formData.nom}" a été modifié par ${user?.prenom} ${user?.nom}`,
          type: 'info',
          link: '/departements'
        });
      } else {
        await api.post('/departements', formData);
        toast.success('Département créé avec succès');
        
        // Notification pour la création
        addNotification({
          title: 'Nouveau département créé',
          message: `Un nouveau département "${formData.nom}" a été créé par ${user?.prenom} ${user?.nom}`,
          type: 'success',
          link: '/departements'
        });
      }
      setShowModal(false);
      setEditingDepartement(null);
      fetchDepartements();
    } catch (error) {
      console.error('Error saving departement:', error);
      const message = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(message);
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur département',
        message: `Erreur lors de la sauvegarde du département: ${message}`,
        type: 'error',
        link: '/departements'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      return;
    }

    try {
      // Récupérer les informations du département avant suppression pour la notification
      const departementToDelete = departements.find(dept => dept.id === id);
      
      await api.delete(`/departements/${id}`);
      toast.success('Département supprimé avec succès');
      
      // Notification pour la suppression
      addNotification({
        title: 'Département supprimé',
        message: `Le département "${departementToDelete?.nom || 'inconnu'}" a été supprimé par ${user?.prenom} ${user?.nom}`,
        type: 'warning',
        link: '/departements'
      });
      
      fetchDepartements();
    } catch (error) {
      console.error('Error deleting departement:', error);
      toast.error('Erreur lors de la suppression');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur suppression département',
        message: `Erreur lors de la suppression du département: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/departements'
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-100 text-green-800',
      'Inactif': 'bg-red-100 text-red-800',
      'En restructuration': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit, 
      page: 1
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Départements
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les départements et leur organisation
          </p>
        </div>
        {hasPermission('Administrateur') && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter un département
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recherche
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom ou code du département..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange({ ...filters, statut: e.target.value })}
                className="input"
              >
                <option value="">Tous les statuts</option>
                {departementStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => handleFilterChange({ statut: '', search: '' })}
                className="btn-outline w-full"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Departements List */}
      <div className="card">
        <div className="card-body">
          {departements.length === 0 ? (
            <div className="text-center py-8">
              <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun département trouvé
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Commencez par ajouter des départements
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Département
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {departements.map((departement) => (
                    <tr key={departement.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {departement.nom}
                          </div>
                          {departement.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {departement.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900">
                          {departement.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {departement.Responsable ? (
                          <div className="flex items-center">
                            <UsersIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {departement.Responsable.prenom} {departement.Responsable.nom}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Non assigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(departement.statut)}`}>
                          {departement.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {departement.budget_annuel ? (
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="w-4 h-4 text-green-500 mr-1" />
                            {parseFloat(departement.budget_annuel).toLocaleString('fr-FR')} €
                          </div>
                        ) : (
                          <span className="text-gray-500">Non défini</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewingDepartement(departement)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Voir les détails"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {hasPermission('Administrateur') && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingDepartement(departement);
                                  setShowModal(true);
                                }}
                                className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                title="Modifier"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(departement.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Supprimer"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <div className="card">
          <div className="card-body">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <DepartementModal
          departement={editingDepartement}
          users={users}
          onClose={() => {
            setShowModal(false);
            setEditingDepartement(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Modal for View Details */}
      {viewingDepartement && (
        <DepartementDetailsModal
          departement={viewingDepartement}
          onClose={() => setViewingDepartement(null)}
        />
      )}
    </div>
  );
};

// Modal Component for Add/Edit
const DepartementModal = ({ departement, users, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: departement?.nom || '',
    code: departement?.code || '',
    description: departement?.description || '',
    responsable_id: departement?.responsable_id || '',
    budget_annuel: departement?.budget_annuel || '',
    statut: departement?.statut || 'Actif',
    couleur: departement?.couleur || '#3B82F6'
  });

  const departementStatuses = ['Actif', 'Inactif', 'En restructuration'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      budget_annuel: formData.budget_annuel ? parseFloat(formData.budget_annuel) : null,
      responsable_id: formData.responsable_id ? parseInt(formData.responsable_id) : null
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {departement ? 'Modifier le département' : 'Ajouter un département'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="input"
                  maxLength="100"
                  placeholder="Nom du département"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="input"
                  maxLength="10"
                  placeholder="DEPT001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input"
                maxLength="1000"
                placeholder="Description du département..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Responsable
                </label>
                <select
                  name="responsable_id"
                  value={formData.responsable_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Sélectionner un responsable</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.prenom} {user.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut *
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {departementStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget annuel (€)
                </label>
                <input
                  type="number"
                  name="budget_annuel"
                  value={formData.budget_annuel}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                  placeholder="50000.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Couleur
                </label>
                <input
                  type="color"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleChange}
                  className="input h-10 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {departement ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modal Component for View Details
const DepartementDetailsModal = ({ departement, onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-gradient-to-r from-green-400 to-green-600 text-white',
      'Inactif': 'bg-gradient-to-r from-red-400 to-red-600 text-white',
      'En restructuration': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Actif': '🟢',
      'Inactif': '🔴',
      'En restructuration': '🟠'
    };
    return icons[status] || '⚪';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out scale-100 opacity-100">
          {/* Header */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: departement.couleur || '#3B82F6' }}
                  >
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{departement.nom}</h3>
                    <p className="text-primary-100">Code: {departement.code}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-primary-200 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status and Code Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getStatusIcon(departement.statut)}</span>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Statut</h4>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(departement.statut)} shadow-lg`}>
                  {departement.statut}
                </span>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-3 mb-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">Code</h4>
                </div>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900 shadow-lg">
                  {departement.code}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departement.Responsable && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <UsersIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">Responsable</h4>
                  </div>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {departement.Responsable.prenom} {departement.Responsable.nom}
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {departement.Responsable.email}
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2 mb-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-green-700 dark:text-green-300">Budget annuel</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {departement.budget_annuel ? `${parseFloat(departement.budget_annuel).toLocaleString('fr-FR')} €` : 'N/A'}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {departement.budget_annuel ? 'budget annuel' : 'non défini'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <h4 className="font-semibold text-orange-700 dark:text-orange-300">Date création</h4>
                </div>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {new Date(departement.date_creation).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400">créé le</p>
              </div>
            </div>

            {/* Description Section */}
            {departement.description && (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">Description</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{departement.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departements;
