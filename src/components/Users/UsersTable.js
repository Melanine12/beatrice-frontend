import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import Select from 'react-select';
import Swal from 'sweetalert2';
import api from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import Pagination from '../UI/Pagination';
import { useAuth } from '../../contexts/AuthContext';
import './UsersTable.css';

const UsersTable = () => {
  const { user, isAuthenticated } = useAuth();
  
  console.log('🔍 UsersTable render - isAuthenticated:', isAuthenticated, 'user:', user);
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    role: '',
    actif: '',
    departement_id: '',
    sous_departement_id: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'Agent',
    telephone: '',
    departement_id: '',
    sous_departement_id: ''
  });

  const [departements, setDepartements] = useState([]);
  const [sousDepartements, setSousDepartements] = useState([]);
  const [loadingDepartements, setLoadingDepartements] = useState(false);
  const [loadingSousDepartements, setLoadingSousDepartements] = useState(false);

  console.log('🔍 Current state - departements:', departements, 'sousDepartements:', sousDepartements);

  // Fonction helper pour le filtrage sécurisé
  const safeFilterOption = (option, inputValue) => {
    const searchTerm = inputValue.toLowerCase();
    // Vérification de sécurité pour option.data
    if (!option.data) return false;
    return (
      option.data.nom?.toLowerCase().includes(searchTerm) ||
      option.data.code?.toLowerCase().includes(searchTerm)
    );
  };

  const roles = [
    { value: 'Agent', label: 'Agent' },
    { value: 'Superviseur', label: 'Superviseur' },
    { value: 'Administrateur', label: 'Administrateur' },
    { value: 'Patron', label: 'Patron' }
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (filters.role) params.append('role', filters.role);
      if (filters.actif !== '') params.append('actif', filters.actif);
      if (filters.departement_id) params.append('departement_id', filters.departement_id);
      if (filters.sous_departement_id) params.append('sous_departement_id', filters.sous_departement_id);

      console.log('Fetching users with params:', params.toString());
      const response = await api.get(`/users?${params}`);
      console.log('Users response:', response.data);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartements = async () => {
    try {
      setLoadingDepartements(true);
      console.log('🔍 Fetching departements...');
      const response = await api.get('/departements?limit=100');
      console.log('✅ Departements response:', response.data);
      setDepartements(response.data.departements || []);
      console.log('📊 Departements loaded:', response.data.departements?.length || 0);
    } catch (err) {
      console.error('❌ Error fetching departements:', err);
      console.error('❌ Error response:', err.response?.data);
    } finally {
      setLoadingDepartements(false);
    }
  };

  const fetchSousDepartements = async (departementId) => {
    if (!departementId) {
      setSousDepartements([]);
      return;
    }
    
    try {
      setLoadingSousDepartements(true);
      console.log('🔍 Fetching sous-departements for departement:', departementId);
      const response = await api.get(`/sous-departements/by-departement/${departementId}?limit=100`);
      console.log('✅ Sous-departements response:', response.data);
      setSousDepartements(response.data.sousDepartements || []);
      console.log('📊 Sous-departements loaded:', response.data.sousDepartements?.length || 0);
    } catch (err) {
      console.error('❌ Error fetching sous-departements:', err);
      console.error('❌ Error response:', err.response?.data);
      setSousDepartements([]);
    } finally {
      setLoadingSousDepartements(false);
    }
  };

  const handleDepartementChange = (departementId) => {
    setFormData(prev => ({ 
      ...prev, 
      departement_id: departementId,
      sous_departement_id: ''
    }));
    fetchSousDepartements(departementId);
  };

  useEffect(() => {
    console.log('🚀 UsersTable component mounted, isAuthenticated:', isAuthenticated);
    console.log('🔍 Token in localStorage:', localStorage.getItem('token'));
    
    // Charger les départements même si l'utilisateur n'est pas encore chargé
    if (localStorage.getItem('token')) {
      console.log('✅ Token found, fetching departements...');
      fetchDepartements();
    }
    
    if (isAuthenticated) {
      console.log('✅ User is authenticated, fetching users...');
      fetchUsers();
    } else {
      console.log('❌ User not authenticated');
      setError('Vous devez être connecté pour voir les utilisateurs');
      setLoading(false);
    }
  }, [isAuthenticated]); // Retiré pagination.page, pagination.limit, filters pour éviter les rechargements

  // useEffect séparé pour gérer les changements de pagination et filtres
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Pagination or filters changed, refetching users...');
      fetchUsers();
    }
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({ ...prev, page: 1, limit: newLimit }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Préparer les données à envoyer
      const dataToSend = { ...formData };
      
      // Si c'est une modification et que le mot de passe est vide, ne pas l'envoyer
      if (editingUser && (!dataToSend.mot_de_passe || dataToSend.mot_de_passe.trim() === '')) {
        delete dataToSend.mot_de_passe;
      }
      
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, dataToSend);
        Swal.fire(
          'Modifié !',
          'L\'utilisateur a été modifié avec succès.',
          'success'
        );
      } else {
        await api.post('/users', dataToSend);
        Swal.fire(
          'Créé !',
          'L\'utilisateur a été créé avec succès.',
          'success'
        );
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        role: 'Agent',
        telephone: '',
        departement_id: '',
        sous_departement_id: ''
      });
      fetchUsers();
    } catch (err) {
      Swal.fire(
        'Erreur !',
        err.response?.data?.message || 'Erreur lors de l\'opération',
        'error'
      );
    }
  };

  const handleEdit = (userToEdit) => {
    // Vérifier les permissions
    // Seul l'utilisateur lui-même ou un administrateur peut modifier
    if (user.id !== userToEdit.id && user.role !== 'Administrateur' && user.role !== 'Patron') {
      Swal.fire({
        icon: 'warning',
        title: 'Permissions insuffisantes',
        text: 'Vous n\'avez pas les droits nécessaires pour modifier cet utilisateur. Seuls les administrateurs et le propriétaire du compte peuvent effectuer cette action.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#3b82f6',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      return;
    }

    setEditingUser(userToEdit);
    setFormData({
      nom: userToEdit.nom,
      prenom: userToEdit.prenom,
      email: userToEdit.email,
      mot_de_passe: '',
      role: userToEdit.role,
      telephone: userToEdit.telephone || '',
      departement_id: userToEdit.departement_id || '',
      sous_departement_id: userToEdit.sous_departement_id || ''
    });
    setShowModal(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDelete = async (userId) => {
    // Vérifier les permissions
    if (user.role !== 'Administrateur' && user.role !== 'Patron') {
      Swal.fire({
        icon: 'warning',
        title: 'Permissions insuffisantes',
        text: 'Vous n\'avez pas les droits nécessaires pour supprimer des utilisateurs. Seuls les administrateurs et le patron peuvent effectuer cette action.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${userId}`);
        Swal.fire(
          'Supprimé !',
          'L\'utilisateur a été supprimé avec succès.',
          'success'
        );
        fetchUsers();
      } catch (err) {
        Swal.fire(
          'Erreur !',
          err.response?.data?.message || 'Erreur lors de la suppression',
          'error'
        );
      }
    }
  };

  const handleActivate = async (userId) => {
    // Vérifier les permissions
    if (user.role !== 'Administrateur' && user.role !== 'Patron') {
      Swal.fire({
        icon: 'warning',
        title: 'Permissions insuffisantes',
        text: 'Vous n\'avez pas les droits nécessaires pour activer des utilisateurs. Seuls les administrateurs et le patron peuvent effectuer cette action.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      await api.post(`/users/${userId}/activate`);
      Swal.fire(
        'Activé !',
        'L\'utilisateur a été activé avec succès.',
        'success'
      );
      fetchUsers();
    } catch (err) {
      Swal.fire(
        'Erreur !',
        err.response?.data?.message || 'Erreur lors de l\'activation',
        'error'
      );
    }
  };

  const handleDeactivate = async (userId) => {
    // Vérifier les permissions
    if (user.role !== 'Administrateur' && user.role !== 'Patron') {
      Swal.fire({
        icon: 'warning',
        title: 'Permissions insuffisantes',
        text: 'Vous n\'avez pas les droits nécessaires pour désactiver des utilisateurs. Seuls les administrateurs et le patron peuvent effectuer cette action.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Désactiver l\'utilisateur ?',
      text: "L'utilisateur ne pourra plus se connecter au système.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, désactiver',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/users/${userId}/deactivate`);
        Swal.fire(
          'Désactivé !',
          'L\'utilisateur a été désactivé avec succès.',
          'success'
        );
        fetchUsers();
      } catch (err) {
        Swal.fire(
          'Erreur !',
          err.response?.data?.message || 'Erreur lors de la désactivation',
          'error'
        );
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Patron': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Administrateur': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Superviseur': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Agent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Liste des Utilisateurs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez tous les utilisateurs du système
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Filters Section - First Line */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Filtres principaux
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rôle
            </label>
            <Select
              value={roles.find(role => role.value === filters.role) || null}
              onChange={(option) => handleFilterChange('role', option ? option.value : '')}
              options={[{ value: '', label: 'Tous les rôles' }, ...roles]}
              placeholder="Sélectionner un rôle"
              isClearable
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "Aucun rôle trouvé"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <Select
              value={filters.actif === '' ? null : { value: filters.actif, label: filters.actif ? 'Actif' : 'Inactif' }}
              onChange={(option) => handleFilterChange('actif', option ? option.value : '')}
              options={[
                { value: '', label: 'Tous les statuts' },
                { value: true, label: 'Actif' },
                { value: false, label: 'Inactif' }
              ]}
              placeholder="Sélectionner un statut"
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  role: '',
                  actif: '',
                  departement_id: '',
                  sous_departement_id: ''
                });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Réinitialiser les filtres
            </button>
          </div>
          <div className="flex items-end">
            <div className="w-full text-center p-2 bg-blue-50 text-blue-700 rounded-md dark:bg-blue-900/20 dark:text-blue-400">
              <span className="text-sm font-medium">
                {pagination.total} utilisateur{pagination.total !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Second Line */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Filtres d'organisation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Département
            </label>
            <Select
              value={(() => {
                if (!filters.departement_id) return null;
                const dept = departements.find(dept => dept.id === parseInt(filters.departement_id));
                console.log('🔍 Filter departement value:', filters.departement_id, 'found:', dept);
                return dept ? {
                  value: dept.id,
                  label: `${dept.nom} (${dept.code})`,
                  data: dept
                } : null;
              })()}
              onChange={(option) => {
                const departementId = option ? option.value : '';
                console.log('🎯 Filter departement selected:', option, 'ID:', departementId);
                handleFilterChange('departement_id', departementId);
                if (departementId) {
                  fetchSousDepartements(departementId);
                } else {
                  setSousDepartements([]);
                  handleFilterChange('sous_departement_id', '');
                }
              }}
              options={[{ value: '', label: 'Tous les départements' }, ...departements.map(dept => ({
                value: dept.id,
                label: `${dept.nom} (${dept.code})`,
                data: dept
              }))]}
              placeholder="Sélectionner un département"
              isClearable
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "Aucun département trouvé"}
              loadingMessage={() => "Chargement..."}
              formatOptionLabel={(option) => {
                if (!option.data) return option.label;
                return (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: option.data.couleur || '#6b7280' }}
                    ></div>
                    <span>{option.label}</span>
                  </div>
                );
              }}
            />
            {loadingDepartements && (
              <p className="text-xs text-gray-500 mt-1">Chargement...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sous-département
            </label>
            <Select
              value={(() => {
                if (!filters.sous_departement_id) return null;
                const sousDept = sousDepartements.find(sousDept => sousDept.id === parseInt(filters.sous_departement_id));
                console.log('🔍 Filter sous-departement value:', filters.sous_departement_id, 'found:', sousDept);
                return sousDept ? {
                  value: sousDept.id,
                  label: `${sousDept.nom} (${sousDept.code}) - N${sousDept.niveau_hierarchie}`,
                  data: sousDept
                } : null;
              })()}
              onChange={(option) => handleFilterChange('sous_departement_id', option ? option.value : '')}
              options={[{ value: '', label: 'Tous les sous-départements' }, ...sousDepartements.map(sousDept => ({
                value: sousDept.id,
                label: `${sousDept.nom} (${sousDept.code}) - N${sousDept.niveau_hierarchie}`,
                data: sousDept
              }))]}
              placeholder="Sélectionner un sous-département"
              isDisabled={!filters.departement_id || loadingSousDepartements}
              isClearable
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "Aucun sous-département trouvé"}
              loadingMessage={() => "Chargement..."}
              formatOptionLabel={(option) => {
                if (!option.data) return option.label;
                return (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: option.data.couleur || '#6b7280' }}
                    ></div>
                    <span>{option.label}</span>
                  </div>
                );
              }}
            />
            {loadingSousDepartements && (
              <p className="text-xs text-gray-500 mt-1">Chargement..."</p>
            )}
            {!filters.departement_id && (
              <p className="text-xs text-gray-500 mt-1">Sélectionnez d'abord un département</p>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center dark:bg-primary-900">
                          <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.nom} {user.prenom}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    {user.telephone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.telephone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.Departement ? (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: user.Departement.couleur || '#6b7280' }}
                          ></div>
                          <span>{user.Departement.nom}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </div>
                    {user.SousDepartement && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.SousDepartement.nom} (N{user.SousDepartement.niveau_hierarchie})
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.actif ? (
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`ml-2 text-sm ${user.actif ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400"
                        title="Modifier"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Voir les détails"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {user.actif ? (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Désactiver"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Activer"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    value={formData.mot_de_passe}
                    onChange={(e) => setFormData(prev => ({ ...prev, mot_de_passe: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rôle *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Département
                  </label>
                  <Select
                    value={(() => {
                      if (!formData.departement_id) return null;
                      const dept = departements.find(dept => dept.id === parseInt(formData.departement_id));
                      console.log('🔍 Form departement value:', formData.departement_id, 'found:', dept);
                      return dept ? {
                        value: dept.id,
                        label: `${dept.nom} (${dept.code})`,
                        data: dept
                      } : null;
                    })()}
                    onChange={(option) => {
                      const departementId = option ? option.value : '';
                      console.log('🎯 Form departement selected:', option, 'ID:', departementId);
                      setFormData(prev => ({ 
                        ...prev, 
                        departement_id: departementId,
                        sous_departement_id: ''
                      }));
                      if (departementId) {
                        fetchSousDepartements(departementId);
                      } else {
                        setSousDepartements([]);
                      }
                    }}
                    options={departements.map(dept => ({
                      value: dept.id,
                      label: `${dept.nom} (${dept.code})`,
                      data: dept
                    }))}
                    placeholder="Sélectionner un département"
                    isClearable
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "Aucun département trouvé"}
                    loadingMessage={() => "Chargement..."}
                    formatOptionLabel={(option) => {
                      if (!option.data) return option.label;
                      return (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: option.data.couleur || '#6b7280' }}
                          ></div>
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                  {loadingDepartements && (
                    <p className="text-xs text-gray-500 mt-1">Chargement...</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sous-département
                  </label>
                  <Select
                    value={(() => {
                      if (!formData.sous_departement_id) return null;
                      const sousDept = sousDepartements.find(sousDept => sousDept.id === parseInt(formData.sous_departement_id));
                      console.log('🔍 Form sous-departement value:', formData.sous_departement_id, 'found:', sousDept);
                      return sousDept ? {
                        value: sousDept.id,
                        label: `${sousDept.nom} (${sousDept.code}) - N${sousDept.niveau_hierarchie}`,
                        data: sousDept
                      } : null;
                    })()}
                    onChange={(option) => setFormData(prev => ({ 
                      ...prev, 
                      sous_departement_id: option ? option.value : '' 
                    }))}
                    options={sousDepartements.map(sousDept => ({
                      value: sousDept.id,
                      label: `${sousDept.nom} (${sousDept.code}) - N${sousDept.niveau_hierarchie}`,
                      data: sousDept
                    }))}
                    placeholder="Sélectionner un sous-département"
                    isDisabled={!formData.departement_id || loadingSousDepartements}
                    isClearable
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "Aucun sous-département trouvé"}
                    loadingMessage={() => "Chargement..."}
                    formatOptionLabel={(option) => {
                      if (!option.data) return option.label;
                      return (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: option.data.couleur || '#6b7280' }}
                          ></div>
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                  {loadingSousDepartements && (
                    <p className="text-xs text-gray-500 mt-1">Chargement...</p>
                  )}
                  {!formData.departement_id && (
                    <p className="text-xs text-gray-500 mt-1">Sélectionnez d'abord un département</p>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingUser ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    setFormData({
                      nom: '',
                      prenom: '',
                      email: '',
                      mot_de_passe: '',
                      role: 'Agent',
                      telephone: '',
                      departement_id: '',
                      sous_departement_id: ''
                    });
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détails de l'utilisateur */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Détails de l'utilisateur
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informations personnelles</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom :</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedUser.nom}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prénom :</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedUser.prenom}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email :</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Téléphone :</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedUser.telephone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informations professionnelles</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rôle :</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser.role === 'Administrateur' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        selectedUser.role === 'Patron' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        selectedUser.role === 'Superviseur' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut :</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser.actif ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {selectedUser.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Département :</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.Departement ? (
                          <span className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: selectedUser.Departement.couleur || '#6b7280' }}
                            ></div>
                            {selectedUser.Departement.nom} ({selectedUser.Departement.code})
                          </span>
                        ) : 'Non assigné'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sous-département :</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.SousDepartement ? (
                          <span className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: selectedUser.SousDepartement.couleur || '#6b7280' }}
                            ></div>
                            {selectedUser.SousDepartement.nom} ({selectedUser.SousDepartement.code}) - N{selectedUser.SousDepartement.niveau_hierarchie}
                          </span>
                        ) : 'Non assigné'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informations système</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ID :</span>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedUser.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dernière connexion :</span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.derniere_connexion ? new Date(selectedUser.derniere_connexion).toLocaleString('fr-FR') : 'Jamais connecté'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Créé le :</span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modifié le :</span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedUser.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
