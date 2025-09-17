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
  CubeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import BonsMenage from './BonsMenage';

const Spaces = () => {
  const { user, hasPermission } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('spaces');
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [viewingSpace, setViewingSpace] = useState(null);
  const [viewingArticles, setViewingArticles] = useState(null);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesData, setArticlesData] = useState(null);
  const [filters, setFilters] = useState({
    statut: '',
    type: '',
    etage: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const spaceTypes = ['Chambre', 'Bureau administratif', 'Salle de fête', 'Salle de réunion', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Parking', 'Piscine', 'Jardin', 'Terrasse', 'Cuisine', 'Entrepôt', 'Autre'];
  const spaceStatuses = ['Libre', 'Occupé', 'En nettoyage', 'En maintenance', 'Réservé', 'Fermé'];

  useEffect(() => {
    if (activeTab === 'spaces') {
      fetchSpaces();
    }
  }, [filters, pagination.page, pagination.limit, activeTab]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.type) params.append('type', filters.type);
      if (filters.etage) params.append('etage', filters.etage);
      if (filters.search) params.append('search', filters.search);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/chambres?${params}`);
      const data = response.data;
      
      setSpaces(data.chambres || data.rooms || data);
      
      // Update pagination info from response
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total || data.total || 0,
          totalPages: data.pagination.pages || Math.ceil((data.total || 0) / pagination.limit)
        }));
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
      toast.error('Erreur lors du chargement des espaces');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Debug logging
      console.log('Frontend - Data being sent:', JSON.stringify(formData, null, 2));
      
      if (editingSpace) {
        await api.put(`/chambres/${editingSpace.id}`, formData);
        toast.success('Espace mis à jour avec succès');
        
        // Notification pour la modification
        addNotification({
          title: 'Espace modifié',
          message: `L'espace ${formData.numero} (${formData.type}) a été modifié par ${user?.prenom} ${user?.nom}`,
          type: 'info',
          link: '/spaces'
        });
      } else {
        await api.post('/chambres', formData);
        toast.success('Espace créé avec succès');
        
        // Notification pour la création
        addNotification({
          title: 'Nouvel espace créé',
          message: `Un nouvel espace ${formData.numero} (${formData.type}) a été créé par ${user?.prenom} ${user?.nom}`,
          type: 'success',
          link: '/spaces'
        });
      }
      setShowModal(false);
      setEditingSpace(null);
      fetchSpaces();
    } catch (error) {
      console.error('Error saving space:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(message);
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur espace',
        message: `Erreur lors de la sauvegarde de l'espace: ${message}`,
        type: 'error',
        link: '/spaces'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet espace ?')) {
      return;
    }

    try {
      // Récupérer les informations de l'espace avant suppression pour la notification
      const spaceToDelete = spaces.find(space => space.id === id);
      
      await api.delete(`/chambres/${id}`);
      toast.success('Espace supprimé avec succès');
      
      // Notification pour la suppression
      addNotification({
        title: 'Espace supprimé',
        message: `L'espace ${spaceToDelete?.numero || 'inconnu'} (${spaceToDelete?.type || 'type inconnu'}) a été supprimé par ${user?.prenom} ${user?.nom}`,
        type: 'warning',
        link: '/spaces'
      });
      
      fetchSpaces();
    } catch (error) {
      console.error('Error deleting space:', error);
      toast.error('Erreur lors de la suppression');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur suppression espace',
        message: `Erreur lors de la suppression de l'espace: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/spaces'
      });
    }
  };

  const handleViewArticles = async (space) => {
    try {
      setViewingArticles(space);
      setArticlesLoading(true);
      setArticlesData(null);

      const response = await api.get(`/chambres/${space.id}/articles`);
      setArticlesData(response.data);
    } catch (error) {
      console.error('Error fetching space articles:', error);
      toast.error('Erreur lors du chargement des articles');
      
      // Notification d'erreur pour le chargement des articles
      addNotification({
        title: 'Erreur chargement articles',
        message: `Erreur lors du chargement des articles de l'espace ${space.numero}: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/spaces'
      });
    } finally {
      setArticlesLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Libre': 'bg-green-100 text-green-800',
      'Occupé': 'bg-red-100 text-red-800',
      'En nettoyage': 'bg-yellow-100 text-yellow-800',
      'En maintenance': 'bg-orange-100 text-orange-800',
      'Réservé': 'bg-blue-100 text-blue-800',
      'Fermé': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Chambre': 'bg-blue-100 text-blue-800',
      'Bureau administratif': 'bg-purple-100 text-purple-800',
      'Salle de fête': 'bg-pink-100 text-pink-800',
      'Salle de réunion': 'bg-indigo-100 text-indigo-800',
      'Restaurant': 'bg-orange-100 text-orange-800',
      'Bar': 'bg-amber-100 text-amber-800',
      'Spa': 'bg-teal-100 text-teal-800',
      'Gym': 'bg-emerald-100 text-emerald-800',
      'Parking': 'bg-slate-100 text-slate-800',
      'Piscine': 'bg-cyan-100 text-cyan-800',
      'Jardin': 'bg-lime-100 text-lime-800',
      'Terrasse': 'bg-rose-100 text-rose-800',
      'Cuisine': 'bg-red-100 text-red-800',
      'Entrepôt': 'bg-stone-100 text-stone-800',
      'Autre': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit, 
      page: 1 // Reset to first page when changing limit
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  // Fonction pour afficher des valeurs spécifiques au type dans le tableau
  const renderTypeSpecificValue = (space) => {
    switch (space.type) {
      case 'Chambre':
        return space.prix_nuit ? `${space.prix_nuit}$` : 'N/A';
      case 'Salle de fête':
      case 'Salle de réunion':
        return space.surface ? `${space.surface} m²` : 'N/A';
      case 'Restaurant':
      case 'Bar':
        return space.cuisine_equipee ? 'Cuisine équipée' : 'Standard';
      case 'Spa':
      case 'Gym':
        return space.douches ? `${space.douches} douches` : 'N/A';
      case 'Parking':
        return space.places ? `${space.places} places` : 'N/A';
      case 'Piscine':
        return space.profondeur_max ? `${space.profondeur_max}m` : 'N/A';
      case 'Jardin':
        return space.superficie ? `${space.superficie} m²` : 'N/A';
      case 'Entrepôt':
        return space.hauteur_plafond ? `${space.hauteur_plafond}m` : 'N/A';
      default:
        return 'N/A';
    }
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
            Espaces & Locaux
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les espaces et leur disponibilité
          </p>
        </div>
        {activeTab === 'spaces' && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter un espace
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('spaces')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'spaces'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
            Espaces
          </button>
          <button
            onClick={() => setActiveTab('bons-menage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bons-menage'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <ClipboardDocumentListIcon className="w-5 h-5 inline mr-2" />
            Bons de ménage
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'spaces' ? (
        <>
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
                      placeholder="Numéro d'espace..."
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
                    {spaceStatuses.map(status => (
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
                    {spaceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Étage
                  </label>
                  <input
                    type="number"
                    placeholder="Étage..."
                    value={filters.etage}
                    onChange={(e) => handleFilterChange({ ...filters, etage: e.target.value })}
                    className="input"
                    min="0"
                    max="50"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => handleFilterChange({ statut: '', type: '', etage: '', search: '' })}
                    className="btn-outline w-full"
                  >
                    <FunnelIcon className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>

      {/* Spaces List */}
      <div className="card">
        <div className="card-body">
          {spaces.length === 0 ? (
            <div className="text-center py-8">
              <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun espace trouvé
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Commencez par ajouter des espaces
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Espace
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Capacité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Caractéristiques
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {spaces.map((space) => (
                    <tr key={space.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {space.type === 'Chambre' ? `Chambre ${space.numero}` : space.numero}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Étage {space.etage}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(space.type)}`}>
                          {space.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(space.statut)}`}>
                          {space.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {space.capacite} personne(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {renderTypeSpecificValue(space)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewingSpace(space)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Voir les détails"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {/* Temporarily allow all users to edit spaces for testing */}
                          {/* {hasPermission('Superviseur') && ( */}
                            <button
                              onClick={() => {
                                setEditingSpace(space);
                                setShowModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                              title="Modifier"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          {/* )} */}
                          {/* Temporarily allow all users to delete spaces for testing */}
                          {/* {hasPermission('Administrateur') && ( */}
                            <button
                              onClick={() => handleDelete(space.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          {/* )} */}
                          <button
                            onClick={() => handleViewArticles(space)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Voir les articles"
                          >
                            <CubeIcon className="w-4 h-4" />
                          </button>
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
            <SpaceModal
              space={editingSpace}
              onClose={() => {
                setShowModal(false);
                setEditingSpace(null);
              }}
              onSubmit={handleSubmit}
            />
          )}

          {/* Modal for View Details */}
          {viewingSpace && (
            <SpaceDetailsModal
              space={viewingSpace}
              onClose={() => setViewingSpace(null)}
            />
          )}

          {/* Modal for View Articles */}
          {viewingArticles && (
            <ArticlesModal
              space={viewingArticles}
              articles={articlesData}
              loading={articlesLoading}
              onClose={() => setViewingArticles(null)}
            />
          )}
        </>
      ) : (
        <BonsMenage />
      )}
    </div>
  );
};

// Modal Component for Add/Edit
const SpaceModal = ({ space, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    numero: space?.numero || '',
    type: space?.type || 'Chambre',
    statut: space?.statut || 'Libre',
    capacite: space?.capacite || 1,
    prix_nuit: space?.prix_nuit || '',
    etage: space?.etage || '',
    description: space?.description || '',
    notes: space?.notes || '',
    // Champs spécifiques aux chambres
    categorie: space?.categorie || 'Standard',
    // Champs spécifiques aux salles
    surface: space?.surface || '',
    acoustique: space?.acoustique || false,
    // Champs spécifiques aux restaurants/bars
    cuisine_equipee: space?.cuisine_equipee || false,
    terrasse: space?.terrasse || false,
    // Champs spécifiques aux spas/gyms
    douches: space?.douches || 0,
    vestiaires: space?.vestiaires || 0,
    // Champs spécifiques aux parkings
    places: space?.places || 0,
    couvert: space?.couvert || false,
    // Champs spécifiques aux piscines
    profondeur_max: space?.profondeur_max || '',
    chauffage: space?.chauffage || false,
    // Champs spécifiques aux jardins
    superficie: space?.superficie || '',
    arrosage_automatique: space?.arrosage_automatique || false,
    // Champs spécifiques aux entrepôts
    hauteur_plafond: space?.hauteur_plafond || '',
    quai_chargement: space?.quai_chargement || false
  });

  const spaceTypes = ['Chambre', 'Bureau administratif', 'Salle de fête', 'Salle de réunion', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Parking', 'Piscine', 'Jardin', 'Terrasse', 'Cuisine', 'Entrepôt', 'Autre'];
  const spaceStatuses = ['Libre', 'Occupé', 'En nettoyage', 'En maintenance', 'Réservé', 'Fermé'];
  
  // Catégories spécifiques aux chambres
  const roomCategories = ['Standard', 'Confort', 'Premium', 'Suite', 'Familiale', 'Accessible'];
  
  // Statuts spécifiques selon le type
  const getStatusOptions = (type) => {
    const baseStatuses = ['Libre', 'Occupé', 'En maintenance', 'Fermé'];
    
    switch (type) {
      case 'Chambre':
        return [...baseStatuses, 'En nettoyage', 'Réservé'];
      case 'Salle de fête':
      case 'Salle de réunion':
        return [...baseStatuses, 'Réservé'];
      case 'Restaurant':
      case 'Bar':
        return [...baseStatuses, 'Service en cours'];
      case 'Spa':
      case 'Gym':
        return [...baseStatuses, 'En cours d\'utilisation'];
      case 'Parking':
        return [...baseStatuses, 'Plein'];
      case 'Piscine':
        return [...baseStatuses, 'En nettoyage', 'Fermeture saisonnière'];
      case 'Jardin':
      case 'Terrasse':
        return [...baseStatuses, 'En entretien'];
      case 'Cuisine':
      case 'Entrepôt':
        return [...baseStatuses, 'En inventaire'];
      default:
        return baseStatuses;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Debug logging - before parsing
    console.log('Modal - Raw form data:', formData);
    
    const data = {
      ...formData,
      prix_nuit: formData.prix_nuit && formData.prix_nuit !== '' ? parseFloat(formData.prix_nuit) : null,
      capacite: formData.capacite && formData.capacite !== '' ? parseInt(formData.capacite) : 1,
      etage: formData.etage && formData.etage !== '' ? parseInt(formData.etage) : null,
      surface: formData.surface && formData.surface !== '' ? parseFloat(formData.surface) : null,
      douches: formData.douches && formData.douches !== '' ? parseInt(formData.douches) : null,
      vestiaires: formData.vestiaires && formData.vestiaires !== '' ? parseInt(formData.vestiaires) : null,
      places: formData.places && formData.places !== '' ? parseInt(formData.places) : null,
      profondeur_max: formData.profondeur_max && formData.profondeur_max !== '' ? parseFloat(formData.profondeur_max) : null,
      superficie: formData.superficie && formData.superficie !== '' ? parseFloat(formData.superficie) : null,
      hauteur_plafond: formData.hauteur_plafond && formData.hauteur_plafond !== '' ? parseFloat(formData.hauteur_plafond) : null
    };
    
    // Debug logging - after parsing
    console.log('Modal - Parsed data:', data);
    
    onSubmit(data);
  };

  // Rendu conditionnel des champs selon le type
  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'Chambre':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie
                </label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="input"
                >
                  {roomCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tarif/Nuit ($)
                </label>
                <input
                  type="number"
                  name="prix_nuit"
                  value={formData.prix_nuit}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                  placeholder="150.00"
                />
              </div>
            </div>
          </>
        );

      case 'Salle de fête':
      case 'Salle de réunion':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Surface (m²)
                </label>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                  placeholder="100.0"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="acoustique"
                  checked={formData.acoustique}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Acoustique optimisée
                </label>
              </div>
            </div>
          </>
        );

      case 'Restaurant':
      case 'Bar':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="cuisine_equipee"
                  checked={formData.cuisine_equipee}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Cuisine équipée
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="terrasse"
                  checked={formData.terrasse}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Terrasse
                </label>
              </div>
            </div>
          </>
        );

      case 'Spa':
      case 'Gym':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de douches
                </label>
                <input
                  type="number"
                  name="douches"
                  value={formData.douches}
                  onChange={handleChange}
                  min="0"
                  className="input"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de vestiaires
                </label>
                <input
                  type="number"
                  name="vestiaires"
                  value={formData.vestiaires}
                  onChange={handleChange}
                  min="0"
                  className="input"
                  placeholder="8"
                />
              </div>
            </div>
          </>
        );

      case 'Parking':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de places
                </label>
                <input
                  type="number"
                  name="places"
                  value={formData.places}
                  onChange={handleChange}
                  min="1"
                  className="input"
                  placeholder="50"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="couvert"
                  checked={formData.couvert}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Parking couvert
                </label>
              </div>
            </div>
          </>
        );

      case 'Piscine':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profondeur max (m)
                </label>
                <input
                  type="number"
                  name="profondeur_max"
                  value={formData.profondeur_max}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                  placeholder="2.5"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="chauffage"
                  checked={formData.chauffage}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Piscine chauffée
                </label>
              </div>
            </div>
          </>
        );

      case 'Jardin':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Superficie (m²)
                </label>
                <input
                  type="number"
                  name="superficie"
                  value={formData.superficie}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                  placeholder="500.0"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="arrosage_automatique"
                  checked={formData.arrosage_automatique}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Arrosage automatique
                </label>
              </div>
            </div>
          </>
        );

      case 'Entrepôt':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hauteur plafond (m)
                </label>
                <input
                  type="number"
                  name="hauteur_plafond"
                  value={formData.hauteur_plafond}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input"
                  placeholder="4.5"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="quai_chargement"
                  checked={formData.quai_chargement}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Quai de chargement
                </label>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {space ? 'Modifier l\'espace' : 'Ajouter un espace'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champs de base */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Numéro/Identifiant *
                </label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                  className="input"
                  maxLength="20"
                  placeholder={formData.type === 'Chambre' ? 'Numéro de chambre' : 'Identifiant de l\'espace'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {spaceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Champs spécifiques au type */}
            {renderTypeSpecificFields()}

            <div className="grid grid-cols-2 gap-4">
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
                  {getStatusOptions(formData.type).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacité *
                </label>
                <input
                  type="number"
                  name="capacite"
                  value={formData.capacite}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  required
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Étage *
              </label>
              <input
                type="number"
                name="etage"
                value={formData.etage}
                onChange={handleChange}
                min="0"
                max="50"
                required
                className="input"
              />
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
                placeholder="Description de l'espace..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="input"
                maxLength="1000"
                placeholder="Notes spéciales, restrictions..."
              />
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
                {space ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modal Component for View Details
const SpaceDetailsModal = ({ space, onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Libre': 'bg-gradient-to-r from-green-400 to-green-600 text-white',
      'Occupé': 'bg-gradient-to-r from-red-400 to-red-600 text-white',
      'En nettoyage': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      'En maintenance': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
      'Réservé': 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
      'Fermé': 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Chambre': 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
      'Bureau administratif': 'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
      'Salle de fête': 'bg-gradient-to-r from-pink-400 to-pink-600 text-white',
      'Salle de réunion': 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white',
      'Restaurant': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
      'Bar': 'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
      'Spa': 'bg-gradient-to-r from-teal-400 to-teal-600 text-white',
      'Gym': 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white',
      'Parking': 'bg-gradient-to-r from-slate-400 to-slate-600 text-white',
      'Piscine': 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white',
      'Jardin': 'bg-gradient-to-r from-lime-400 to-lime-600 text-white',
      'Terrasse': 'bg-gradient-to-r from-rose-400 to-rose-600 text-white',
      'Cuisine': 'bg-gradient-to-r from-red-400 to-red-600 text-white',
      'Entrepôt': 'bg-gradient-to-r from-stone-400 to-stone-600 text-white',
      'Autre': 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
    };
    return colors[type] || 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Libre': '🟢',
      'Occupé': '🔴',
      'En nettoyage': '🟡',
      'En maintenance': '🟠',
      'Réservé': '🔵',
      'Fermé': '⚫'
    };
    return icons[status] || '⚪';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Chambre': '🏠',
      'Bureau administratif': '🏢',
      'Salle de fête': '🎉',
      'Salle de réunion': '👥',
      'Restaurant': '🍽️',
      'Bar': '🍸',
      'Spa': '💆',
      'Gym': '💪',
      'Parking': '🚗',
      'Piscine': '🏊',
      'Jardin': '🌺',
      'Terrasse': '☕',
      'Cuisine': '👨‍🍳',
      'Entrepôt': '📦',
      'Autre': '🏠'
    };
    return icons[type] || '🏠';
  };

  const renderTypeSpecificDetails = (space) => {
    switch (space.type) {
      case 'Chambre':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">Catégorie</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{space.categorie}</p>
          </div>
        );
      case 'Salle de fête':
      case 'Salle de réunion':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-purple-700 dark:text-purple-300">Surface</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{space.surface} m²</p>
          </div>
        );
      case 'Restaurant':
      case 'Bar':
        return (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-orange-700 dark:text-orange-300">Cuisine équipée</h4>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{space.cuisine_equipee ? 'Oui' : 'Non'}</p>
          </div>
        );
      case 'Spa':
      case 'Gym':
        return (
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-teal-700 dark:text-teal-300">Douches</h4>
            </div>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{space.douches}</p>
          </div>
        );
      case 'Parking':
        return (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">Places</h4>
            </div>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{space.places}</p>
          </div>
        );
      case 'Piscine':
        return (
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900 dark:to-cyan-800 rounded-xl p-4 border border-cyan-200 dark:border-cyan-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-cyan-700 dark:text-cyan-300">Profondeur max</h4>
            </div>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{space.profondeur_max} m</p>
          </div>
        );
      case 'Jardin':
        return (
          <div className="bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900 dark:to-lime-800 rounded-xl p-4 border border-lime-200 dark:border-lime-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-lime-700 dark:text-lime-300">Superficie</h4>
            </div>
            <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">{space.superficie} m²</p>
          </div>
        );
      case 'Entrepôt':
        return (
          <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-stone-600 dark:text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-stone-700 dark:text-stone-300">Hauteur plafond</h4>
            </div>
            <p className="text-2xl font-bold text-stone-600 dark:text-stone-400">{space.hauteur_plafond} m</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Modal Container with Animation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out scale-100 opacity-100">
          {/* Header with Gradient */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getTypeIcon(space.type)}</div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {space.type === 'Chambre' ? `Chambre ${space.numero}` : space.numero}
                    </h3>
                    <p className="text-primary-100">Étage {space.etage}</p>
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
            {/* Status and Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getStatusIcon(space.statut)}</span>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Statut</h4>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(space.statut)} shadow-lg`}>
                  {space.statut}
                </span>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getTypeIcon(space.type)}</span>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Type</h4>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(space.type)} shadow-lg`}>
                  {space.type}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">Capacité</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{space.capacite}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">personne(s)</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h4 className="font-semibold text-green-700 dark:text-green-300">Tarif</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {space.prix_nuit ? `${space.prix_nuit}$` : 'N/A'}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {space.prix_nuit ? 'par nuit' : 'non défini'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300">Étage</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{space.etage}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">niveau</p>
              </div>
            </div>

            {/* Champs spécifiques au type */}
            {renderTypeSpecificDetails(space)}

            {/* Description Section */}
            {space.description && (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">Description</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{space.description}</p>
              </div>
            )}

            {/* Notes Section */}
            {space.notes && (
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800 rounded-xl p-4 border border-pink-200 dark:border-pink-700">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h4 className="font-semibold text-pink-700 dark:text-pink-300">Notes</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{space.notes}</p>
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

// Modal Component for View Articles
const ArticlesModal = ({ space, articles, loading, onClose }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div className="mt-3 flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!articles || !articles.articles || articles.articles.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div className="mt-3 text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun article trouvé pour cet espace
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aucun article n'est actuellement affecté à cet espace.
            </p>
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
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Articles affectés à {space.type === 'Chambre' ? `la chambre ${space.numero}` : `l'espace ${space.numero}`} - Étage {space.etage}
          </h3>
          
          {/* Summary */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Total d'articles :</span>
                <span className="ml-2 text-blue-600 dark:text-blue-400">{articles.total_articles}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Quantité totale approuvée :</span>
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  {articles.articles.reduce((total, article) => total + (article.quantite_approvee || 0), 0)} unités
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Valeur totale :</span>
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  {articles.articles.reduce((total, article) => {
                    return total + (article.prix_unitaire ? (article.prix_unitaire * Math.max(0, article.quantite_actuelle)) : 0);
                  }, 0).toFixed(2)}$
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Articles affectés :</span>
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  {articles.articles.filter(article => article.quantite_actuelle > 0).length} / {articles.total_articles}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Catégorie
                  </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Quantité approuvée
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Quantité affectée
                              </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valeur totale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {articles.articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {article.nom}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {article.code_produit}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {article.categorie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {article.quantite_approvee || 0} {article.unite || 'unités'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {article.quantite_actuelle} {article.unite || 'unités'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {article.prix_unitaire ? `${article.prix_unitaire}$` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {article.prix_unitaire ? `${(article.prix_unitaire * article.quantite_actuelle).toFixed(2)}$` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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
  );
};

export default Spaces;
