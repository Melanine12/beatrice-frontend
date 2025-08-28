import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';
import { getImageUrl, getThumbnailUrl, getFormattedImageSize, getImageDimensions } from '../utils/imageUtils';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import ImageUploader from '../components/Problematiques/ImageUploader';
import Select from 'react-select';

// Styles personnalisés pour react-select (maintenant gérés par CSS)

const Problematiques = () => {
  const { user, hasPermission } = useAuth();
  const [problematiques, setProblematiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [viewingIssue, setViewingIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [sousDepartements, setSousDepartements] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingDepartements, setLoadingDepartements] = useState(false);
  const [loadingSousDepartements, setLoadingSousDepartements] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    statut: '',
    priorite: '',
    type: '',
    chambre_id: '',
    assigne_id: '',
    search: ''
  });

  // Fonction pour mettre à jour les filtres et réinitialiser la pagination
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Retourner à la première page
  };

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'Autre',
    priorite: 'Normale',
    statut: 'Ouverte',
    chambre_id: '',
    departement_id: '',
    sous_departement_id: '',
    assigne_id: '',
    date_limite: '',
    tags: '',
    commentaires: ''
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchIssues();
    fetchUsers();
    fetchRooms();
    fetchDepartements();
    fetchSousDepartements();
  }, [currentPage, filters, itemsPerPage]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...filters
      });

      const response = await api.get(`/problematiques?${params}`);
      setProblematiques(response.data.problematiques);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Erreur lors du chargement des problématiques');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      // Récupérer TOUS les espaces avec la limite maximale autorisée (100)
      const response = await api.get('/chambres?limit=100');
      console.log('🏢 Espaces récupérés:', response.data.chambres);
      console.log('📊 Types d\'espaces disponibles:', [...new Set(response.data.chambres.map(room => room.type))]);
      console.log('🔍 Nombre total d\'espaces:', response.data.chambres.length);
      
      // Log des options pour le react-select
      const options = response.data.chambres.map(room => ({
        value: room.id,
        label: `${room.numero} - ${room.type}`,
        numero: room.numero,
        type: room.type
      }));
      console.log('🎯 Options pour react-select:', options);
      
      setRooms(response.data.chambres);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchDepartements = async () => {
    try {
      setLoadingDepartements(true);
      const response = await api.get('/departements');
      setDepartements(response.data.departements || []);
    } catch (error) {
      console.error('Error fetching departements:', error);
      setDepartements([]);
    } finally {
      setLoadingDepartements(false);
    }
  };

  const fetchSousDepartements = async () => {
    try {
      setLoadingSousDepartements(true);
      const response = await api.get('/sous-departements');
      setSousDepartements(response.data.sousDepartements || []);
    } catch (error) {
      console.error('Error fetching sous-departements:', error);
      setSousDepartements([]);
    } finally {
      setLoadingSousDepartements(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.departement_id) {
      toast.error('Veuillez sélectionner un département');
      return;
    }
    
    // Validation du statut pour les nouvelles problématiques
    if (!editingIssue && formData.statut !== 'Ouverte') {
      toast.error('Le statut doit être "Ouverte" pour une nouvelle problématique');
      return;
    }
    
    try {
      console.log('🖼️ Images à envoyer:', images);
      
      // Créer un FormData pour l'envoi des fichiers
      const submitData = new FormData();
      
      // Ajouter les données du formulaire
      Object.keys(formData).forEach(key => {
        if (key === 'statut' && !editingIssue) {
          // Forcer le statut à "Ouverte" pour les nouvelles problématiques
          submitData.append(key, 'Ouverte');
        } else {
          submitData.append(key, formData[key]);
        }
      });
      
      // Ajouter les images
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          if (image.file) {
            console.log(`📁 Ajout de l'image ${index}:`, image.file.name, image.file.size);
            submitData.append('fichiers', image.file);
          }
        });
      }
      
      // Ajouter les autres données
      submitData.append('rapporteur_id', user.id);
      
      if (editingIssue) {
        // Mode édition : seuls les champs modifiables
        if (formData.statut) submitData.append('statut', formData.statut);
        if (formData.assigne_id) submitData.append('assigne_id', formData.assigne_id);
        if (formData.date_limite) submitData.append('date_limite', formData.date_limite);
        if (formData.tags) submitData.append('tags', formData.tags);
        if (formData.commentaires) submitData.append('commentaires', formData.commentaires);
      } else {
        // Mode création : tous les champs
        if (formData.chambre_id) submitData.append('chambre_id', formData.chambre_id);
        if (formData.departement_id) submitData.append('departement_id', formData.departement_id);
        if (formData.sous_departement_id) submitData.append('sous_departement_id', formData.sous_departement_id);
        if (formData.assigne_id) submitData.append('assigne_id', formData.assigne_id);
        if (formData.date_limite) submitData.append('date_limite', formData.date_limite);
        if (formData.tags) submitData.append('tags', formData.tags);
        if (formData.commentaires) submitData.append('commentaires', formData.commentaires);
      }

      console.log('📋 FormData créé avec succès');
      console.log('📊 Nombre d\'images:', images ? images.length : 0);
      
      // Log détaillé du FormData
      console.log('🔍 Contenu du FormData:');
      for (let [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type
          });
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      if (editingIssue) {
        // Mode édition : envoyer du JSON (pas de FormData sauf si images)
        let updateData = {};
        
        // Construire l'objet de mise à jour
        if (formData.statut) updateData.statut = formData.statut;
        if (formData.assigne_id) updateData.assigne_id = formData.assigne_id;
        if (formData.date_limite) updateData.date_limite = formData.date_limite;
        if (formData.tags) updateData.tags = formData.tags;
        if (formData.commentaires) updateData.commentaires = formData.commentaires;
        
        // Si des images sont ajoutées, utiliser FormData
        if (images && images.length > 0 && images.some(img => img.file)) {
          const imageFormData = new FormData();
          Object.keys(updateData).forEach(key => {
            imageFormData.append(key, updateData[key]);
          });
          
          // Ajouter les nouvelles images
          images.forEach((image, index) => {
            if (image.file) {
              imageFormData.append('fichiers', image.file);
            }
          });
          
          const response = await api.put(`/problematiques/${editingIssue.id}`, imageFormData);
          toast.success('Problématique mise à jour avec succès');
        } else {
          // Pas d'images : envoyer du JSON
          const response = await api.put(`/problematiques/${editingIssue.id}`, updateData);
          toast.success('Problématique mise à jour avec succès');
        }
        
        // Vérifier si le statut a changé à "En cours" pour informer de la création de tâche
        if (formData.statut === 'En cours' && editingIssue.statut !== 'En cours') {
          toast.success('✅ Tâche créée automatiquement ! Une nouvelle tâche a été générée pour cette problématique.', {
            duration: 5000,
            icon: '🎯'
          });
        }
        
        console.log('✅ Problématique mise à jour avec succès');
        console.log('📊 Données envoyées:', updateData);
      } else {
        await api.post('/problematiques', submitData);
        toast.success('Problématique créée avec succès');
      }

      setShowModal(false);
      setEditingIssue(null);
      resetForm();
      setImages([]);
      fetchIssues();
    } catch (error) {
      console.error('Error saving issue:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette problématique ?')) {
      return;
    }

    try {
      await api.delete(`/problematiques/${id}`);
      toast.success('Problématique supprimée avec succès');
      fetchIssues();
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (id, newStatus, oldStatus) => {
    try {
      await api.put(`/problematiques/${id}`, { statut: newStatus });
      toast.success('Statut mis à jour avec succès');
      
      // Informer de la création automatique de tâche si le statut passe à "En cours"
      if (newStatus === 'En cours' && oldStatus !== 'En cours') {
        toast.success('✅ Tâche créée automatiquement ! Une nouvelle tâche a été générée pour cette problématique.', {
          duration: 5000,
          icon: '🎯'
        });
      }
      
      fetchIssues();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      type: 'Autre',
      priorite: 'Normale',
      statut: 'Ouverte', // Toujours "Ouverte" pour les nouvelles problématiques
      chambre_id: '',
      departement_id: '',
      sous_departement_id: '',
      assigne_id: '',
      date_limite: '',
      tags: '',
      commentaires: ''
    });
    setImages([]);
  };

  // Fonction pour gérer les changements d'images
  const handleImagesChange = (newImages) => {
    console.log('🖼️ Images mises à jour:', newImages);
    setImages(newImages);
  };

  const openEditModal = (issue) => {
    setEditingIssue(issue);
    setFormData({
      titre: issue.titre,
      description: issue.description,
      type: issue.type,
      priorite: issue.priorite,
      statut: issue.statut || 'Ouverte', // Garder le statut existant ou "Ouverte" par défaut
      chambre_id: issue.chambre_id || '',
      departement_id: issue.departement_id || '',
      sous_departement_id: issue.sous_departement_id || '',
      assigne_id: issue.assigne_id || '',
      date_limite: issue.date_limite ? new Date(issue.date_limite).toISOString().split('T')[0] : '',
      tags: issue.tags || '',
      commentaires: issue.commentaires || ''
    });
    
    // Charger les images existantes si disponibles
    if (issue.fichiers) {
      try {
        const fichiers = JSON.parse(issue.fichiers);
        setImages(fichiers.map(fichier => ({
          id: fichier.id || Date.now() + Math.random(),
          nom: fichier.originalname || fichier.filename,
          url: `/uploads/problematiques/${fichier.filename}`,
          path: fichier.path,
          taille: fichier.size ? `${(fichier.size / 1024).toFixed(1)} KB` : 'N/A',
          type: fichier.mimetype || 'image/jpeg',
          date_upload: fichier.date_upload || new Date().toISOString(),
          status: 'success',
          source: 'existing'
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
        setImages([]);
      }
    } else {
      setImages([]);
    }
    
    setShowModal(true);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Basse': 'bg-green-100 text-green-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Haute': 'bg-orange-100 text-orange-800',
      'Urgente': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Ouverte': 'bg-red-100 text-red-800',
      'En cours': 'bg-yellow-100 text-yellow-800',
      'En attente': 'bg-orange-100 text-orange-800',
      'Résolue': 'bg-green-100 text-green-800',
      'Fermée': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Ouverte': ExclamationTriangleIcon,
      'En cours': ClockIcon,
      'En attente': ClockIcon,
      'Résolue': CheckCircleIcon,
      'Fermée': XCircleIcon
    };
    return icons[status] || ExclamationTriangleIcon;
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
            Gestion des Problématiques
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les problèmes et incidents de l'hôtel
          </p>
        </div>
        <button
          onClick={() => {
            setEditingIssue(null);
            resetForm();
            // S'assurer que le statut est "Ouverte" pour les nouvelles problématiques
            setFormData(prev => ({ ...prev, statut: 'Ouverte' }));
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nouvelle Problématique
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Filtres
          </h3>
        </div>
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtres actifs
              {Object.values(filters).filter(value => value !== '').length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  {Object.values(filters).filter(value => value !== '').length}
                </span>
              )}
            </h4>
            <button
              onClick={() => updateFilters({
                statut: '',
                priorite: '',
                type: '',
                chambre_id: '',
                assigne_id: '',
                search: ''
              })}
              className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Recherche
              </label>
                              <input
                  type="text"
                  placeholder="Titre ou description..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                  className="form-input"
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Statut
              </label>
                                <select
                    value={filters.statut}
                    onChange={(e) => updateFilters({ ...filters, statut: e.target.value })}
                    className="form-select"
                  >
                <option value="">Tous</option>
                <option value="Ouverte">Ouverte</option>
                <option value="En cours">En cours</option>
                <option value="En attente">En attente</option>
                <option value="Résolue">Résolue</option>
                <option value="Fermée">Fermée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priorité
              </label>
                                <select
                    value={filters.priorite}
                    onChange={(e) => updateFilters({ ...filters, priorite: e.target.value })}
                    className="form-select"
                  >
                <option value="">Toutes</option>
                <option value="Basse">Basse</option>
                <option value="Normale">Normale</option>
                <option value="Haute">Haute</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
                                <select
                    value={filters.type}
                    onChange={(e) => updateFilters({ ...filters, type: e.target.value })}
                    className="form-select"
                  >
                <option value="">Tous</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Nettoyage">Nettoyage</option>
                <option value="Sécurité">Sécurité</option>
                <option value="Technique">Technique</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Banquets">Banquets</option>
                <option value="Reception">Reception</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Chambre
              </label>
                                <select
                    value={filters.chambre_id}
                    onChange={(e) => updateFilters({ ...filters, chambre_id: e.target.value })}
                    className="form-select"
                  >
                <option value="">Toutes</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.numero}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assigné à
              </label>
                                <select
                    value={filters.assigne_id}
                    onChange={(e) => updateFilters({ ...filters, assigne_id: e.target.value })}
                    className="form-select"
                  >
                <option value="">Tous</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.prenom} {user.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Problématiques ({totalItems})
          </h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Problématique
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
                    Chambre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assigné à
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date limite
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {problematiques.map((issue) => {
                  const StatusIcon = getStatusIcon(issue.statut);
                  return (
                    <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {issue.titre}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {issue.description.substring(0, 50)}...
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Rapporté par {issue.rapporteur?.prenom} {issue.rapporteur?.nom}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {issue.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(issue.priorite)}`}>
                          {issue.priorite}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className="w-4 h-4 mr-2" />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.statut)}`}>
                            {issue.statut}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {issue.chambre?.numero || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {issue.assigne ? `${issue.assigne.prenom} ${issue.assigne.nom}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {issue.date_limite ? new Date(issue.date_limite).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Indicateur de tâche créée automatiquement */}
                          {issue.statut === 'En cours' && (
                            <span 
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                              title="Tâche créée automatiquement"
                            >
                              🎯 Tâche
                            </span>
                          )}
                          
                          <button
                            onClick={() => setViewingIssue(issue)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            title="Voir"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {(hasPermission('Superviseur') || issue.rapporteur_id === user.id) && (
                            <button
                              onClick={() => openEditModal(issue)}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                              title="Modifier"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('Administrateur') && (
                            <button
                              onClick={() => handleDelete(issue.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {problematiques.length === 0 && (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Aucune problématique trouvée
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Commencez par créer une nouvelle problématique.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newLimit) => {
            setItemsPerPage(newLimit);
            setCurrentPage(1);
            // Les filtres et la pagination se mettront à jour automatiquement via useEffect
          }}
        />
      )}

      {/* Issue Modal - Intégré directement */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 animate-fadeIn">
          <div className="relative top-10 mx-auto p-8 border-0 w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-2xl rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-sm max-h-[90vh] overflow-y-auto animate-slideIn">
                          <div className="mt-3">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editingIssue ? 'Modifier la Problématique' : 'Nouvelle Problématique'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {editingIssue ? 'Modifiez les informations de la problématique' : 'Créez une nouvelle problématique pour l\'hôtel'}
                    </p>
                    {!editingIssue && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          💡 <strong>Circuit de création :</strong> Tous les utilisateurs peuvent créer une problématique. 
                          {hasPermission('Superviseur') ? ' Vous avez accès à tous les champs avancés.' : ' Les superviseurs peuvent compléter les informations avancées.'}
                        </p>
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                          <p className="text-xs text-green-700 dark:text-green-300">
                            ✅ <strong>Statut automatique :</strong> Toutes les nouvelles problématiques sont créées avec le statut "Ouverte". 
                            Seuls les superviseurs peuvent modifier ce statut ultérieurement.
                          </p>
                        </div>
                        {!hasPermission('Superviseur') && (
                          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                            <p className="text-xs text-yellow-700 dark:text-yellow-300">
                              📋 <strong>Votre rôle :</strong> Créez la problématique avec les informations de base. 
                              Un superviseur pourra ensuite l'enrichir et modifier le statut selon l'avancement.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingIssue(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <XCircleIcon className="w-8 h-8" />
                  </button>
                </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Entrez le titre de la problématique..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type *
                    </label>
                    <Select
                      placeholder="Sélectionner le type de problématique"
                      value={{ value: formData.type, label: formData.type }}
                      onChange={(option) => setFormData({ ...formData, type: option.value })}
                      options={[
                        { value: 'Maintenance', label: 'Maintenance' },
                        { value: 'Nettoyage', label: 'Nettoyage' },
                        { value: 'Sécurité', label: 'Sécurité' },
                        { value: 'Technique', label: 'Technique' },
                        { value: 'Restaurant', label: 'Restaurant' },
                        { value: 'Banquets', label: 'Banquets' },
                        { value: 'Reception', label: 'Reception' },
                        { value: 'Autre', label: 'Autre' }
                      ]}
                      isSearchable
                      
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
                    placeholder="Décrivez en détail le problème rencontré..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Priorité *
                    </label>
                    <Select
                      placeholder="Sélectionner la priorité"
                      value={{ value: formData.priorite, label: formData.priorite }}
                      onChange={(option) => setFormData({ ...formData, priorite: option.value })}
                      options={[
                        { value: 'Basse', label: 'Basse' },
                        { value: 'Normale', label: 'Normale' },
                        { value: 'Haute', label: 'Haute' },
                        { value: 'Urgente', label: 'Urgente' }
                      ]}
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Statut <span className="text-red-500">*</span>
                      {!editingIssue && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                          (automatiquement "Ouverte" pour les nouvelles problématiques)
                        </span>
                      )}
                    </label>
                    {!editingIssue ? (
                      // Pour la création : champ en lecture seule avec "Ouverte"
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Ouverte
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            (statut par défaut pour les nouvelles problématiques)
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Pour l'édition : champ modifiable pour les superviseurs
                      hasPermission('Superviseur') ? (
                        <Select
                          placeholder="Sélectionner le statut"
                          value={{ value: formData.statut, label: formData.statut }}
                          onChange={(option) => setFormData({ ...formData, statut: option.value })}
                          options={[
                            { value: 'Ouverte', label: 'Ouverte' },
                            { value: 'En cours', label: 'En cours' },
                            { value: 'En attente', label: 'En attente' },
                            { value: 'Résolue', label: 'Résolue' },
                            { value: 'Fermée', label: 'Fermée' }
                          ]}
                          isSearchable
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      ) : (
                        // Pour l'édition : champ en lecture seule pour les non-superviseurs
                        <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            formData.statut === 'Ouverte' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            formData.statut === 'En cours' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            formData.statut === 'En attente' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            formData.statut === 'Résolue' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {formData.statut}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Département <span className="text-red-500">*</span>
                    </label>
                    <Select
                      placeholder="Sélectionner le département"
                      value={departements.find(dept => dept.id === parseInt(formData.departement_id)) ? {
                        value: formData.departement_id,
                        label: departements.find(dept => dept.id === parseInt(formData.departement_id))?.nom
                      } : null}
                      onChange={(option) => {
                        const newDepartementId = option ? option.value : '';
                        setFormData({ 
                          ...formData, 
                          departement_id: newDepartementId,
                          sous_departement_id: '' // Réinitialiser le sous-département
                        });
                      }}
                      options={departements.map(dept => ({
                        value: dept.id,
                        label: dept.nom
                      }))}
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Chambre/Espace <span className="text-gray-400 font-normal">(optionnel)</span>
                    </label>
                    <Select
                      placeholder="Sélectionner une chambre ou un espace"
                      value={rooms.find(room => room.id === parseInt(formData.chambre_id)) ? {
                        value: parseInt(formData.chambre_id),
                        label: `${rooms.find(room => room.id === parseInt(formData.chambre_id))?.numero} - ${rooms.find(room => room.id === parseInt(formData.chambre_id))?.type}`,
                        numero: rooms.find(room => room.id === parseInt(formData.chambre_id))?.numero,
                        type: rooms.find(room => room.id === parseInt(formData.chambre_id))?.type
                      } : null}
                      onChange={(option) => {
                        console.log('🎯 Espace sélectionné:', option);
                        const newChambreId = option ? option.value : '';
                        console.log('🔍 Nouveau chambre_id:', newChambreId);
                        setFormData({ ...formData, chambre_id: newChambreId });
                      }}
                      options={rooms.map(room => ({
                        value: room.id,
                        label: `${room.numero} - ${room.type}`,
                        numero: room.numero,
                        type: room.type
                      }))}
                      formatOptionLabel={(option) => (
                        <div className="flex items-center">
                          <span className="mr-2">
                            {option.type === 'Chambre' && '🏠'}
                            {option.type === 'Restaurant' && '🍽️'}
                            {option.type === 'Bar' && '🍷'}
                            {option.type === 'Salle de réunion' && '💼'}
                            {option.type === 'Salle de fête' && '🎉'}
                            {option.type === 'Spa' && '💆'}
                            {option.type === 'Gym' && '💪'}
                            {option.type === 'Piscine' && '🏊'}
                            {option.type === 'Jardin' && '🌳'}
                            {option.type === 'Parking' && '🚗'}
                            {option.type === 'Bureau administratif' && '🏢'}
                            {option.type === 'Cuisine' && '👨‍🍳'}
                            {option.type === 'Entrepôt' && '📦'}
                            {option.type === 'Autre' && '📍'}
                          </span>
                          <span className="font-medium">{option.numero}</span>
                          <span className="text-gray-500 ml-2">- {option.type}</span>
                        </div>
                      )}
                      isClearable
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Sous-département <span className="text-gray-400 font-normal">(optionnel)</span>
                    </label>
                    <Select
                      placeholder="Sélectionner un sous-département"
                      value={sousDepartements.find(sd => sd.id === parseInt(formData.sous_departement_id)) ? {
                        value: formData.sous_departement_id,
                        label: sousDepartements.find(sd => sd.id === parseInt(formData.sous_departement_id))?.nom
                      } : null}
                      onChange={(option) => setFormData({ ...formData, sous_departement_id: option ? option.value : '' })}
                      options={sousDepartements
                        .filter(sd => !formData.departement_id || sd.departement_id === parseInt(formData.departement_id))
                        .map(sd => ({
                          value: sd.id,
                          label: sd.nom
                        }))}
                      isClearable
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>

                {/* Champs réservés aux superviseurs */}
                {hasPermission('Superviseur') && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <span className="mr-2">🔧</span>
                          Champs modifiables (Superviseur)
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ces champs peuvent être modifiés après la création de la problématique
                        </p>
                        {editingIssue && (
                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              💡 <strong>Création automatique de tâche :</strong> Lorsque vous changez le statut à "En cours", 
                              une tâche sera automatiquement créée avec le statut "À faire" pour faciliter le suivi de la résolution.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Statut <span className="text-gray-400 font-normal">(modifiable)</span>
                          </label>
                          <Select
                            placeholder="Sélectionner le statut"
                            value={{ value: formData.statut, label: formData.statut }}
                            onChange={(option) => setFormData({ ...formData, statut: option.value })}
                            options={[
                              { value: 'Ouverte', label: 'Ouverte' },
                              { value: 'En cours', label: 'En cours' },
                              { value: 'En attente', label: 'En attente' },
                              { value: 'Résolue', label: 'Résolue' },
                              { value: 'Fermée', label: 'Fermée' }
                            ]}
                            isSearchable
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Date limite <span className="text-gray-400 font-normal">(optionnel)</span>
                          </label>
                          <input
                            type="date"
                            value={formData.date_limite}
                            onChange={(e) => setFormData({ ...formData, date_limite: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Assigné à <span className="text-gray-400 font-normal">(optionnel)</span>
                          </label>
                          <Select
                            placeholder="Sélectionner un utilisateur"
                            value={users.find(user => user.id === parseInt(formData.assigne_id)) ? {
                              value: formData.assigne_id,
                              label: `${users.find(user => user.id === parseInt(formData.assigne_id))?.prenom} ${users.find(user => user.id === parseInt(formData.assigne_id))?.nom}`
                            } : null}
                            onChange={(option) => setFormData({ ...formData, assigne_id: option ? option.value : '' })}
                            options={users.map(user => ({
                              value: user.id,
                              label: `${user.prenom} ${user.nom}`
                            }))}
                            isClearable
                            isSearchable
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Tags <span className="text-gray-400 font-normal">(optionnel)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="tag1, tag2, tag3..."
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Champs réservés aux superviseurs */}
                {hasPermission('Superviseur') && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Commentaires <span className="text-gray-400 font-normal">(optionnel)</span>
                      </label>
                      <textarea
                        rows={5}
                        value={formData.commentaires}
                        onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
                        placeholder="Ajoutez des commentaires ou notes supplémentaires..."
                      />
                    </div>
                  </>
                )}

                {/* Nouveau champ pour les images */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Images du problème
                  </label>
                  <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">
                    <ImageUploader
                      onImagesChange={handleImagesChange}
                      maxImages={5}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingIssue(null);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {editingIssue ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Issue Modal */}
      {viewingIssue && (
        <ViewIssueModal
          issue={viewingIssue}
          onClose={() => setViewingIssue(null)}
          onStatusChange={handleStatusChange}
          hasPermission={hasPermission}
        />
      )}
    </div>
  );
};


// View Issue Modal Component
const ViewIssueModal = ({ issue, onClose, onStatusChange, hasPermission }) => {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Récupérer les images de la problématique
  useEffect(() => {
    const fetchImages = async () => {
      if (!issue.id) return;
      
      try {
        setLoadingImages(true);
        const response = await api.get(`/problematiques/${issue.id}/images`);
        setImages(response.data.images || []);
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
        setImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, [issue.id]);

  const getPriorityColor = (priority) => {
    const colors = {
      'Basse': 'bg-green-100 text-green-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Haute': 'bg-orange-100 text-orange-800',
      'Urgente': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Ouverte': 'bg-red-100 text-red-800',
      'En cours': 'bg-yellow-100 text-yellow-800',
      'En attente': 'bg-orange-100 text-orange-800',
      'Résolue': 'bg-green-100 text-green-800',
      'Fermée': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Fonction pour ouvrir la modal d'image
  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  // Fonction pour fermer la modal d'image
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Détails de la Problématique
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {issue.titre}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {issue.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {issue.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priorité
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(issue.priorite)}`}>
                  {issue.priorite}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statut
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.statut)}`}>
                    {issue.statut}
                  </span>
                  {hasPermission('Superviseur') && (
                    <select
                      value={issue.statut}
                      onChange={(e) => onStatusChange(issue.id, e.target.value, issue.statut)}
                      className="form-select text-xs"
                    >
                      <option value="Ouverte">Ouverte</option>
                      <option value="En cours">En cours</option>
                      <option value="En attente">En attente</option>
                      <option value="Résolue">Résolue</option>
                      <option value="Fermée">Fermée</option>
                    </select>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chambre
                </label>
                <span className="text-gray-900 dark:text-white">
                  {issue.chambre?.numero || '-'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Département
                </label>
                <span className="text-gray-900 dark:text-white">
                  {issue.departement?.nom || '-'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sous-département
                </label>
                <span className="text-gray-900 dark:text-white">
                  {issue.sous_departement?.nom || '-'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rapporté par
                </label>
                <span className="text-gray-900 dark:text-white">
                  {issue.rapporteur?.prenom} {issue.rapporteur?.nom}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assigné à
                </label>
                <span className="text-gray-900 dark:text-white">
                  {issue.assigne ? `${issue.assigne.prenom} ${issue.assigne.nom}` : '-'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date de création
                </label>
                <span className="text-gray-900 dark:text-white">
                  {new Date(issue.date_creation).toLocaleDateString()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date limite
                </label>
                <span className="text-gray-900 dark:text-white">
                  {issue.date_limite ? new Date(issue.date_limite).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>

            {issue.date_resolution && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date de résolution
                </label>
                <span className="text-gray-900 dark:text-white">
                  {new Date(issue.date_resolution).toLocaleDateString()}
                </span>
              </div>
            )}

            {issue.tags && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {issue.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {issue.commentaires && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Commentaires
                </label>
                <p className="text-gray-900 dark:text-white">
                  {issue.commentaires}
                </p>
              </div>
            )}

            {/* Affichage des images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images du problème
              </label>
              {loadingImages ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement des images...</p>
                </div>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={image.id || index} className="relative group">
                      <img
                        src={getImageUrl(image)}
                        alt={image.nom_original || image.nom_fichier}
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openImageModal(image)}
                        onError={(e) => {
                          console.error('Erreur de chargement de l\'image:', getImageUrl(image));
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded">
                          {image.nom_original || image.nom_fichier}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucune image associée à cette problématique
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* Modal de visualisation d'image en grand */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 overflow-y-auto h-full w-full z-[60] flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full mx-auto p-4">
            {/* Bouton fermer */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <XCircleIcon className="w-8 h-8" />
            </button>

            {/* Image en grand */}
            <div className="flex items-center justify-center">
              <img
                src={getImageUrl(selectedImage)}
                alt={selectedImage.nom_original || selectedImage.nom_fichier}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  console.error('Erreur de chargement de l\'image en grand:', getImageUrl(selectedImage));
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Informations de l'image */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {selectedImage.nom_original || selectedImage.nom_fichier}
                </h3>
                <div className="flex justify-center space-x-4 text-sm text-gray-300">
                  <span>Taille: {getFormattedImageSize(selectedImage)}</span>
                  <span>Type: {selectedImage.type_mime || 'N/A'}</span>
                  <span>Upload: {selectedImage.date_upload ? new Date(selectedImage.date_upload).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Navigation entre images (si plusieurs) */}
            {images.length > 1 && (
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <button
                  onClick={() => {
                    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                    setSelectedImage(images[prevIndex]);
                  }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
                  disabled={images.length <= 1}
                >
                  ←
                </button>
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <button
                  onClick={() => {
                    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
                    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                    setSelectedImage(images[nextIndex]);
                  }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
                  disabled={images.length <= 1}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Problematiques; 