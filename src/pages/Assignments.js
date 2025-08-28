import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';
import Select from 'react-select';
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Assignments = () => {
  const { user, hasPermission } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [filters, setFilters] = useState({
    statut: '',
    type: '',
    utilisateur: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const assignmentTypes = ['Nettoyage', 'Maintenance', 'Surveillance', 'Réception', 'Service'];
  const assignmentStatuses = ['En attente', 'En cours', 'Terminé', 'Annulé'];

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
    fetchRooms();
  }, [filters, pagination.page, pagination.limit]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.utilisateur_id) params.append('utilisateur_id', filters.utilisateur_id);
      if (filters.chambre_id) params.append('chambre_id', filters.chambre_id);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/affectations?${params}`);
      const data = response.data;
      
      setAssignments(data.affectations || []);
      
      // Update pagination info from response
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total || 0,
          totalPages: data.pagination.pages || Math.ceil((data.pagination.total || 0) / pagination.limit)
        }));
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Erreur lors du chargement des affectations');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get('/users?limit=100');
      const data = response.data;
      
      const userOptions = (data.users || []).map(user => ({
        value: user.id,
        label: `${user.prenom} ${user.nom}`,
        user: user
      }));
      
      setUsers(userOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const response = await api.get('/chambres?limit=100');
      const data = response.data;
      
      const roomOptions = (data.chambres || []).map(room => ({
        value: room.id,
        label: `Chambre ${room.numero} - ${room.type}`,
        room: room
      }));
      
      setRooms(roomOptions);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Erreur lors du chargement des chambres');
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingAssignment) {
        await api.put(`/affectations/${editingAssignment.id}`, formData);
        toast.success('Affectation mise à jour avec succès');
      } else {
        await api.post('/affectations', formData);
        toast.success('Affectation créée avec succès');
      }
      setShowModal(false);
      setEditingAssignment(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      const message = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) {
      return;
    }

    try {
      await api.delete(`/affectations/${id}`);
      toast.success('Affectation supprimée avec succès');
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'En cours': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Terminé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Annulé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Nettoyage': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Surveillance': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'Réception': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'Service': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'text-red-600 dark:text-red-400';
      case 'Moyenne': return 'text-yellow-600 dark:text-yellow-400';
      case 'Basse': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Affectations
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les affectations de tâches et responsabilités
          </p>
        </div>
        {hasPermission('Superviseur') && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouvelle affectation
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recherche
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Titre ou description..."
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
                {assignmentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ ...filters, type: e.target.value })}
                className="input"
              >
                <option value="">Tous les types</option>
                {assignmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Utilisateur
              </label>
              <input
                type="text"
                placeholder="Nom de l'utilisateur..."
                value={filters.utilisateur}
                onChange={(e) => handleFilterChange({ ...filters, utilisateur: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => handleFilterChange({ statut: '', type: '', utilisateur: '', search: '' })}
                className="btn-outline w-full"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="card">
        <div className="card-body">
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune affectation</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Commencez par créer une nouvelle affectation.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="text-left">Chambre</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Statut</th>
                    <th className="text-left">Utilisateur</th>
                    <th className="text-left">Numéro</th>
                    <th className="text-left">Date affectation</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Chambre {assignment.chambre?.numero || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {assignment.remarque || 'Aucune remarque'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(assignment.chambre?.type || 'Simple')}`}>
                          {assignment.chambre?.type || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.chambre?.statut || 'Libre')}`}>
                          {assignment.chambre?.statut || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className="avatar placeholder">
                            <div className="bg-primary-100 text-primary-800 rounded-full w-8 h-8">
                              <span className="text-xs font-medium">
                                {assignment.utilisateur?.nom_complet?.split(' ').map(n => n[0]).join('') || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {assignment.utilisateur?.nom_complet || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {assignment.chambre?.numero || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(assignment.date_affectation).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setViewingAssignment(assignment)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Voir les détails"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {hasPermission('Superviseur') && (
                            <button
                              onClick={() => {
                                setEditingAssignment(assignment);
                                setShowModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                              title="Modifier"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('Administrateur') && (
                            <button
                              onClick={() => handleDelete(assignment.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
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
        <AssignmentModal
          assignment={editingAssignment}
          onClose={() => {
            setShowModal(false);
            setEditingAssignment(null);
          }}
          onSubmit={handleSubmit}
          users={users}
          rooms={rooms}
          loadingUsers={loadingUsers}
          loadingRooms={loadingRooms}
        />
      )}

      {/* Modal for View Details */}
      {viewingAssignment && (
        <AssignmentDetailsModal
          assignment={viewingAssignment}
          onClose={() => setViewingAssignment(null)}
        />
      )}
    </div>
  );
};

// Modal Component for Add/Edit
const AssignmentModal = ({ assignment, onClose, onSubmit, users, rooms, loadingUsers, loadingRooms }) => {
  const [formData, setFormData] = useState({
    utilisateur_id: assignment?.utilisateur_id || '',
    chambre_id: assignment?.chambre_id || '',
    date_affectation: assignment?.date_affectation ? new Date(assignment.date_affectation).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    remarque: assignment?.remarque || ''
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Set initial values when assignment changes
  useEffect(() => {
    if (assignment) {
      const userOption = users.find(u => u.value === assignment.utilisateur_id);
      const roomOption = rooms.find(r => r.value === assignment.chambre_id);
      setSelectedUser(userOption || null);
      setSelectedRoom(roomOption || null);
    } else {
      setSelectedUser(null);
      setSelectedRoom(null);
    }
  }, [assignment, users, rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate selections
    if (!selectedUser || !selectedRoom) {
      toast.error('Veuillez sélectionner un utilisateur et une chambre');
      return;
    }

    const submitData = {
      ...formData,
      utilisateur_id: selectedUser.value,
      chambre_id: selectedRoom.value
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {assignment ? 'Modifier l\'affectation' : 'Nouvelle affectation'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Utilisateur</label>
                      <Select
                        value={selectedUser}
                        onChange={(option) => setSelectedUser(option)}
                        options={users}
                        isLoading={loadingUsers}
                        placeholder="Sélectionner un utilisateur..."
                        noOptionsMessage={() => "Aucun utilisateur trouvé"}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isClearable
                        isSearchable
                      />
                    </div>
                    <div>
                      <label className="form-label">Chambre</label>
                      <Select
                        value={selectedRoom}
                        onChange={(option) => setSelectedRoom(option)}
                        options={rooms}
                        isLoading={loadingRooms}
                        placeholder="Sélectionner une chambre..."
                        noOptionsMessage={() => "Aucune chambre trouvée"}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isClearable
                        isSearchable
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Date d'affectation</label>
                    <input
                      type="date"
                      name="date_affectation"
                      value={formData.date_affectation}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Remarque</label>
                    <textarea
                      name="remarque"
                      value={formData.remarque}
                      onChange={handleChange}
                      className="form-input"
                      rows="3"
                      placeholder="Remarques sur l'affectation..."
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button type="submit" className="btn-primary sm:ml-3 sm:w-auto">
                      {assignment ? 'Modifier' : 'Créer'}
                    </button>
                    <button type="button" onClick={onClose} className="btn-outline sm:mt-0 sm:w-auto">
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Component for View Details
const AssignmentDetailsModal = ({ assignment, onClose }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'En cours': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Terminé': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Annulé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Nettoyage': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Surveillance': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'Réception': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'Service': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Détails de l'affectation
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Affectation Chambre {assignment.chambre?.numero || 'N/A'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {assignment.remarque || 'Aucune remarque'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type de chambre</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(assignment.chambre?.type || 'Simple')}`}>
                          {assignment.chambre?.type || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut de la chambre</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.chambre?.statut || 'Libre')}`}>
                          {assignment.chambre?.statut || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilisateur</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {assignment.utilisateur?.nom_complet || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Numéro de chambre</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {assignment.chambre?.numero || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date d'affectation</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {new Date(assignment.date_affectation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {assignment.remarque && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Remarque</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{assignment.remarque}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button onClick={onClose} className="btn-outline sm:w-auto">
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments; 