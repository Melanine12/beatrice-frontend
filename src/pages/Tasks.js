import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PlayIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Tasks = () => {
  const { user, hasPermission } = useAuth();
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(20);
  
  // Filter states
  const [filters, setFilters] = useState({
    statut: '',
    priorite: '',
    type: '',
    assigne_id: '',
    chambre_id: '',
    problematique_id: '',
    search: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'Autre',
    priorite: 'Normale',
    statut: 'À faire',
    assigne_id: '',
    chambre_id: '',
    problematique_id: '',
    date_limite: '',
    duree_estimee: '',
    notes: '',
    tags: ''
  });

  // Related data
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [problematiques, setProblematiques] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingProblematiques, setLoadingProblematiques] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit,
        ...filters
      });

      const response = await api.get(`/taches?${params}`);
      setTasks(response.data.taches || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalItems || 0);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const response = await api.get('/chambres');
      setRooms(response.data.chambres || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch problematiques
  const fetchProblematiques = async () => {
    try {
      setLoadingProblematiques(true);
      const response = await api.get('/problematiques');
      setProblematiques(response.data.problematiques || []);
    } catch (error) {
      console.error('Error fetching problematiques:', error);
    } finally {
      setLoadingProblematiques(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, filters]);

  useEffect(() => {
    fetchUsers();
    fetchRooms();
    fetchProblematiques();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        // Update task
        await api.put(`/taches/${selectedTask.id}`, formData);
        toast.success('Tâche mise à jour avec succès');
        
        // Notification pour la modification
        addNotification({
          title: 'Tâche modifiée',
          message: `La tâche "${formData.titre}" a été modifiée par ${user?.prenom} ${user?.nom}`,
          type: 'info',
          link: '/tasks'
        });
      } else {
        // Create task
        await api.post('/taches', formData);
        toast.success('Tâche créée avec succès');
        
        // Notification pour la création
        addNotification({
          title: 'Nouvelle tâche créée',
          message: `Une nouvelle tâche "${formData.titre}" a été créée par ${user?.prenom} ${user?.nom}`,
          type: 'success',
          link: '/tasks'
        });
      }
      setShowModal(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Erreur lors de la sauvegarde de la tâche');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur tâche',
        message: `Erreur lors de la sauvegarde de la tâche: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/tasks'
      });
    }
  };

  // Handle delete
  const handleDelete = async (taskId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      // Récupérer les informations de la tâche avant suppression pour la notification
      const taskToDelete = tasks.find(t => t.id === taskId);
      
      await api.delete(`/taches/${taskId}`);
      toast.success('Tâche supprimée avec succès');
      
      // Notification pour la suppression
      addNotification({
        title: 'Tâche supprimée',
        message: `La tâche "${taskToDelete?.titre || 'inconnue'}" a été supprimée par ${user?.prenom} ${user?.nom}`,
        type: 'warning',
        link: '/tasks'
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erreur lors de la suppression de la tâche');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur suppression tâche',
        message: `Erreur lors de la suppression de la tâche: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/tasks'
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Récupérer les informations de la tâche pour la notification
      const task = tasks.find(t => t.id === taskId);
      const oldStatus = task?.statut;
      
      await api.put(`/taches/${taskId}`, { statut: newStatus });
      toast.success('Statut de la tâche mis à jour');
      
      // Notification pour le changement de statut
      addNotification({
        title: 'Statut de tâche modifié',
        message: `Le statut de la tâche "${task?.titre || 'inconnue'}" a été changé de "${oldStatus}" à "${newStatus}" par ${user?.prenom} ${user?.nom}`,
        type: 'info',
        link: '/tasks'
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur changement de statut',
        message: `Erreur lors du changement de statut de la tâche: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/tasks'
      });
    }
  };

  // Start task
  const handleStartTask = async (taskId) => {
    try {
      // Récupérer les informations de la tâche pour la notification
      const task = tasks.find(t => t.id === taskId);
      
      await api.post(`/taches/${taskId}/start`);
      toast.success('Tâche démarrée avec succès');
      
      // Notification pour le démarrage de tâche
      addNotification({
        title: 'Tâche démarrée',
        message: `La tâche "${task?.titre || 'inconnue'}" a été démarrée par ${user?.prenom} ${user?.nom}`,
        type: 'success',
        link: '/tasks'
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Erreur lors du démarrage de la tâche');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur démarrage tâche',
        message: `Erreur lors du démarrage de la tâche: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/tasks'
      });
    }
  };

  // Complete task
  const handleCompleteTask = async (taskId) => {
    try {
      // Récupérer les informations de la tâche pour la notification
      const task = tasks.find(t => t.id === taskId);
      
      await api.post(`/taches/${taskId}/complete`);
      toast.success('Tâche terminée avec succès');
      
      // Notification pour la finalisation de tâche
      addNotification({
        title: 'Tâche terminée',
        message: `La tâche "${task?.titre || 'inconnue'}" a été terminée par ${user?.prenom} ${user?.nom}`,
        type: 'success',
        link: '/tasks'
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Erreur lors de la finalisation de la tâche');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur finalisation tâche',
        message: `Erreur lors de la finalisation de la tâche: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/tasks'
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      type: 'Autre',
      priorite: 'Normale',
      statut: 'À faire',
      assigne_id: '',
      chambre_id: '',
      problematique_id: '',
      date_limite: '',
      duree_estimee: '',
      notes: '',
      tags: ''
    });
    setSelectedTask(null);
  };

  // Open edit modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      titre: task.titre,
      description: task.description || '',
      type: task.type,
      priorite: task.priorite,
      statut: task.statut,
      assigne_id: task.assigne_id || '',
      chambre_id: task.chambre_id || '',
      problematique_id: task.problematique_id || '',
      date_limite: task.date_limite ? task.date_limite.split('T')[0] : '',
      duree_estimee: task.duree_estimee || '',
      notes: task.notes || '',
      tags: task.tags || ''
    });
    setShowModal(true);
  };

  // Open view modal
  const openViewModal = (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      'Basse': 'bg-green-100 text-green-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Haute': 'bg-orange-100 text-orange-800',
      'Urgente': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'À faire': 'bg-gray-100 text-gray-800',
      'En cours': 'bg-yellow-100 text-yellow-800',
      'En attente': 'bg-orange-100 text-orange-800',
      'Terminée': 'bg-green-100 text-green-800',
      'Annulée': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'À faire': ClockIcon,
      'En cours': PlayIcon,
      'En attente': ExclamationTriangleIcon,
      'Terminée': CheckIcon,
      'Annulée': ExclamationTriangleIcon
    };
    return icons[status] || ClockIcon;
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    if (!task.date_limite || task.statut === 'Terminée') return false;
    return new Date(task.date_limite) < new Date();
  };

  // Check if user is responsible for the task's department
  const isDepartmentManager = (task) => {
    // Check if task has a problematique with a department
    if (task.problematique && task.problematique.departement) {
      return task.problematique.departement.responsable_id === user?.id;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Tâches
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organisez et suivez les tâches de l'équipe
          </p>
        </div>
        {hasPermission('Superviseur') && (
          <button
            onClick={openAddModal}
            className="btn btn-primary"
          >
            <PlusIcon className="h-5 w-5" />
            Nouvelle Tâche
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-medium mb-4">Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                className="form-select"
              >
                <option value="">Tous les statuts</option>
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="En attente">En attente</option>
                <option value="Terminée">Terminée</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priorité
              </label>
              <select
                value={filters.priorite}
                onChange={(e) => handleFilterChange('priorite', e.target.value)}
                className="form-select"
              >
                <option value="">Toutes les priorités</option>
                <option value="Basse">Basse</option>
                <option value="Normale">Normale</option>
                <option value="Haute">Haute</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-select"
              >
                <option value="">Tous les types</option>
                <option value="Nettoyage">Nettoyage</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Réception">Réception</option>
                <option value="Administrative">Administrative</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Rechercher..."
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Chargement des tâches...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tâche
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Assigné à
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Chambre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date limite
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map((task) => {
                      const StatusIcon = getStatusIcon(task.statut);
                      return (
                        <tr key={task.id} className={isOverdue(task) ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {task.titre}
                              </div>
                              {task.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {task.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {task.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priorite)}`}>
                              {task.priorite}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <StatusIcon className="h-4 w-4 mr-2" />
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.statut)}`}>
                                {task.statut}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {task.assigne ? `${task.assigne.prenom} ${task.assigne.nom}` : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {task.chambre ? `Chambre ${task.chambre.numero}` : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {task.date_limite ? new Date(task.date_limite).toLocaleDateString() : '-'}
                              {isOverdue(task) && (
                                <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                                  En retard
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openViewModal(task)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              
                              {/* Boutons d'actions - pas visibles pour les Agents */}
                              {user?.role !== 'Agent' && (
                                <>
                                  {(isDepartmentManager(task) || 
                                    (hasPermission('Administrateur') || hasPermission('Patron'))) && (
                                    <button
                                      onClick={() => openEditModal(task)}
                                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                  )}

                                  {task.statut === 'À faire' && (
                                    <button
                                      onClick={() => handleStartTask(task.id)}
                                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                      title="Démarrer la tâche"
                                    >
                                      <PlayIcon className="h-4 w-4" />
                                    </button>
                                  )}

                                  {task.statut === 'En cours' && (
                                    <button
                                      onClick={() => handleCompleteTask(task.id)}
                                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                      title="Terminer la tâche"
                                    >
                                      <CheckIcon className="h-4 w-4" />
                                    </button>
                                  )}

                                  {hasPermission('Administrateur') && (
                                    <button
                                      onClick={() => handleDelete(task.id)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Affichage de {((currentPage - 1) * limit) + 1} à {Math.min(currentPage * limit, totalItems)} sur {totalItems} tâches
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="btn btn-sm btn-outline disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="btn btn-sm btn-outline disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="Nettoyage">Nettoyage</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Réception">Réception</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priorité *
                  </label>
                  <select
                    value={formData.priorite}
                    onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="Basse">Basse</option>
                    <option value="Normale">Normale</option>
                    <option value="Haute">Haute</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Statut *
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="À faire">À faire</option>
                    <option value="En cours">En cours</option>
                    <option value="En attente">En attente</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assigné à
                  </label>
                  <select
                    value={formData.assigne_id}
                    onChange={(e) => setFormData({ ...formData, assigne_id: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.prenom} {user.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chambre
                  </label>
                  <select
                    value={formData.chambre_id}
                    onChange={(e) => setFormData({ ...formData, chambre_id: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Sélectionner une chambre</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Chambre {room.numero} - {room.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Problématique liée
                  </label>
                  <select
                    value={formData.problematique_id}
                    onChange={(e) => setFormData({ ...formData, problematique_id: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Sélectionner une problématique</option>
                    {problematiques.map(problematique => (
                      <option key={problematique.id} value={problematique.id}>
                        {problematique.titre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date limite
                  </label>
                  <input
                    type="date"
                    value={formData.date_limite}
                    onChange={(e) => setFormData({ ...formData, date_limite: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Durée estimée (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duree_estimee}
                    onChange={(e) => setFormData({ ...formData, duree_estimee: e.target.value })}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="form-input"
                  placeholder="Séparés par des virgules"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedTask ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Task Modal */}
      {showViewModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Détails de la tâche
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {selectedTask.titre}
                </h3>
                {selectedTask.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {selectedTask.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTask.type}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priorité
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTask.priorite)}`}>
                    {selectedTask.priorite}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Statut
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTask.statut)}`}>
                    {selectedTask.statut}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assigné à
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTask.assigne ? `${selectedTask.assigne.prenom} ${selectedTask.assigne.nom}` : 'Non assigné'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chambre
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTask.chambre ? `Chambre ${selectedTask.chambre.numero}` : 'Aucune chambre'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Problématique liée
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTask.problematique ? selectedTask.problematique.titre : 'Aucune problématique'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date limite
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTask.date_limite ? new Date(selectedTask.date_limite).toLocaleDateString() : 'Aucune date limite'}
                    {isOverdue(selectedTask) && (
                      <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                        En retard
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Durée estimée
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTask.duree_estimee ? `${selectedTask.duree_estimee} minutes` : 'Non définie'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Créé par
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTask.createur ? `${selectedTask.createur.prenom} ${selectedTask.createur.nom}` : 'Inconnu'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date de création
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedTask.date_creation).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedTask.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTask.notes}</p>
                </div>
              )}

              {selectedTask.tags && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTask.tags}</p>
                </div>
              )}

              {/* Status change for department managers - pas visible pour les Agents */}
              {user?.role !== 'Agent' && (isDepartmentManager(selectedTask) || 
                (hasPermission('Administrateur') || hasPermission('Patron'))) && 
                selectedTask.statut !== 'Terminée' && selectedTask.statut !== 'Annulée' && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Changer le statut
                  </label>
                  <div className="flex space-x-2">
                    {selectedTask.statut === 'À faire' && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, 'En cours')}
                        className="btn btn-sm btn-primary"
                      >
                        Démarrer
                      </button>
                    )}
                    {selectedTask.statut === 'En cours' && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, 'Terminée')}
                        className="btn btn-sm btn-success"
                      >
                        Terminer
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(selectedTask.id, 'En attente')}
                      className="btn btn-sm btn-warning"
                    >
                      Mettre en attente
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="btn btn-outline"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks; 