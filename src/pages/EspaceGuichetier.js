import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Select from 'react-select';
import {
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const EspaceGuichetier = () => {
  const { user } = useAuth();
  const [paiements, setPaiements] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('paiements'); // 'paiements' ou 'demandes'
  const [showModal, setShowModal] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState(null);

  // Options pour les devises
  const deviseOptions = [
    { value: 'FC', label: 'FC (Francs Congolais)', symbol: 'FC' },
    { value: 'EUR', label: 'EUR (€)', symbol: '€' },
    { value: 'USD', label: 'USD ($)', symbol: '$' },
    { value: 'GBP', label: 'GBP (£)', symbol: '£' },
    { value: 'JPY', label: 'JPY (¥)', symbol: '¥' }
  ];

  const [formData, setFormData] = useState({
    reference: '',
    montant: '',
    devise: 'FC',
    type_paiement: 'Espèces',
    statut: 'En attente',
    date_paiement: new Date().toISOString().split('T')[0],
    description: '',
    motif: '',
    beneficiaire: '',
    utilisateur_id: user?.id || '',
    caisse_id: '',
    chambre_id: '',
    depense_id: '',
    numero_cheque: '',
    priorite: 'normale',
    categorie: ''
  });

  const [caisses, setCaisses] = useState([]);

  useEffect(() => {
    if (user?.role === 'Guichetier') {
      fetchPaiements();
      fetchDemandes();
      fetchCaisses();
    }
  }, [user]);

  // Debug: vérifier l'état de paiements
  useEffect(() => {
    console.log('État paiements:', paiements, 'Type:', typeof paiements, 'Array?', Array.isArray(paiements));
  }, [paiements]);

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/paiements');
      console.log('Réponse API paiements:', response);
      // S'assurer que paiements est toujours un tableau
      const data = response.data;
      if (Array.isArray(data)) {
        setPaiements(data);
      } else if (data && Array.isArray(data.paiements)) {
        setPaiements(data.paiements);
      } else if (data && Array.isArray(data.data)) {
        setPaiements(data.data);
      } else {
        console.warn('Format de réponse inattendu:', data);
        setPaiements([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      toast.error('Erreur lors de la récupération des paiements');
      setPaiements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDemandes = async () => {
    try {
      const response = await api.get('/demandes');
      console.log('Réponse API demandes:', response);
      const data = response.data;
      if (data && data.success && Array.isArray(data.data)) {
        setDemandes(data.data);
      } else if (Array.isArray(data)) {
        setDemandes(data.data);
      } else if (data && Array.isArray(data.demandes)) {
        setDemandes(data.demandes);
      } else {
        console.warn('Format de réponse inattendu pour les demandes:', data);
        setDemandes([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      toast.error('Erreur lors de la récupération des demandes');
      setDemandes([]);
    }
  };

  const fetchCaisses = async () => {
    try {
      const response = await api.get('/caisses');
      console.log('Réponse API caisses:', response);
      const data = response.data;
      if (Array.isArray(data)) {
        setCaisses(data);
      } else if (data && Array.isArray(data.data)) {
        setCaisses(data.data);
      } else if (data && Array.isArray(data.caisses)) {
        setCaisses(data.caisses);
      } else {
        console.warn('Format de réponse inattendu pour les caisses:', data);
        setCaisses([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des caisses:', error);
      toast.error('Erreur lors de la récupération des caisses');
      setCaisses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'paiements') {
        const paiementData = {
          ...formData,
          utilisateur_id: user.id,
          user_guichet_id: user.id,
          montant: parseFloat(formData.montant)
        };

        if (editingPaiement) {
          await api.put(`/paiements/${editingPaiement.id}`, paiementData);
          toast.success('Paiement modifié avec succès');
        } else {
          await api.post('/paiements', paiementData);
          toast.success('Paiement enregistré avec succès');
        }
        
        setShowModal(false);
        setEditingPaiement(null);
        resetForm();
        fetchPaiements();
      } else {
        // Gestion des demandes de décaissement
        const demandeData = {
          motif: formData.motif,
          description: formData.description,
          montant: parseFloat(formData.montant),
          devise: formData.devise,
          priorite: formData.priorite || 'normale',
          categorie: formData.categorie || 'Général',
          guichetier_id: user.id,
          // Le statut est forcé à "en_attente" pour les nouvelles demandes des guichetiers
          statut: editingPaiement ? formData.statut : 'en_attente'
        };

        if (editingPaiement) {
          // Vérifier si l'utilisateur peut modifier le statut
          if (user?.role === 'Guichetier' && demandeData.statut !== 'en_attente') {
            toast.error('Les guichetiers ne peuvent pas modifier le statut des demandes');
            return;
          }
          await api.put(`/demandes/${editingPaiement.id}`, demandeData);
          toast.success('Demande modifiée avec succès');
        } else {
          await api.post('/demandes', demandeData);
          toast.success('Demande de décaissement envoyée avec succès');
        }
        
        setShowModal(false);
        setEditingPaiement(null);
        resetForm();
        fetchDemandes();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (paiement) => {
    setEditingPaiement(paiement);
    setFormData({
      reference: paiement.reference || '',
      montant: paiement.montant || '',
      devise: paiement.devise || 'FC',
      type_paiement: paiement.type_paiement || 'Espèces',
      statut: paiement.statut || 'En attente',
      date_paiement: paiement.date_paiement ? new Date(paiement.date_paiement).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: paiement.description || '',
      beneficiaire: paiement.beneficiaire || '',
      utilisateur_id: paiement.utilisateur_id || '',
      caisse_id: paiement.caisse_id || '',
      chambre_id: paiement.chambre_id || '',
      depense_id: paiement.depense_id || '',
      numero_cheque: paiement.numero_cheque || '',
      priorite: 'normale',
      categorie: ''
    });
    setShowModal(true);
  };

  const handleEditDemande = (demande) => {
    setEditingPaiement(demande);
    setFormData({
      reference: '',
      montant: demande.montant || '',
      devise: demande.devise || 'FC',
      type_paiement: 'Espèces',
      statut: demande.statut || 'en_attente',
      date_paiement: demande.date_demande ? new Date(demande.date_demande).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: demande.description || '',
      motif: demande.motif || '',
      beneficiaire: '',
      utilisateur_id: '',
      caisse_id: '',
      chambre_id: '',
      depense_id: '',
      numero_cheque: '',
      priorite: demande.priorite || 'normale',
      categorie: demande.categorie || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      try {
        await api.delete(`/paiements/${id}`);
        toast.success('Paiement supprimé avec succès');
        fetchPaiements();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du paiement');
      }
    }
  };

  const handleDeleteDemande = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      try {
        await api.delete(`/demandes/${id}`);
        toast.success('Demande supprimée avec succès');
        fetchDemandes();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la demande');
      }
    }
  };

  const handleViewDetails = (paiement) => {
    setSelectedPaiement(paiement);
    setShowDetailsModal(true);
  };

  const handleViewDetailsDemande = (demande) => {
    setSelectedPaiement(demande);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      reference: '',
      montant: '',
      devise: 'FC',
      type_paiement: 'Espèces',
      statut: 'En attente',
      date_paiement: new Date().toISOString().split('T')[0],
      description: '',
      motif: '',
      beneficiaire: '',
      utilisateur_id: user?.id || '',
      caisse_id: '',
      chambre_id: '',
      depense_id: '',
      numero_cheque: '',
      priorite: 'normale',
      categorie: ''
    });
  };

  const openNewModal = () => {
    setEditingPaiement(null);
    resetForm();
    setShowModal(true);
  };

  const getStatusBadge = (statut) => {
    // Mapper les statuts de la base vers l'affichage
    const statusMapping = {
      'en_attente': 'En attente',
      'approuvee': 'Approuvée',
      'rejetee': 'Rejetée',
      'annulee': 'Annulée',
      'En attente': 'En attente',
      'Validé': 'Validé',
      'Approuvée': 'Approuvée',
      'Rejeté': 'Rejeté',
      'Rejetée': 'Rejetée',
      'Annulé': 'Annulé',
      'Annulée': 'Annulée'
    };

    const displayStatus = statusMapping[statut] || 'En attente';
    
    const statusConfig = {
      'En attente': { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      'Approuvée': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      'Validé': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      'Rejetée': { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      'Rejeté': { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      'Annulée': { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon },
      'Annulé': { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon }
    };

    const config = statusConfig[displayStatus] || statusConfig['En attente'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {displayStatus}
      </span>
    );
  };

  const getTypePaiementBadge = (type) => {
    const typeConfig = {
      'Espèces': 'bg-green-100 text-green-800',
      'Carte bancaire': 'bg-blue-100 text-blue-800',
      'Chèque': 'bg-purple-100 text-purple-800',
      'Virement': 'bg-indigo-100 text-indigo-800',
      'Autre': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig[type] || typeConfig['Autre']}`}>
        {type}
      </span>
    );
  };

  // Filter paiements based on search term
  const filteredPaiements = Array.isArray(paiements) ? paiements.filter(paiement =>
    paiement.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.beneficiaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.montant?.toString().includes(searchTerm)
  ) : [];

  // Filter demandes based on search term
  const filteredDemandes = Array.isArray(demandes) ? demandes.filter(demande =>
    demande.motif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.montant?.toString().includes(searchTerm)
  ) : [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPaiements = filteredPaiements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPaiements.length / itemsPerPage);

  if (user?.role !== 'Guichetier') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Cette page est réservée aux guichetiers uniquement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Encaissements
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestion complète des paiements et des demandes de décaissement
            </p>
          </div>
          <button
            onClick={openNewModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {activeTab === 'paiements' ? 'Nouvel Encaissement' : 'Nouvelle Demande'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('paiements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'paiements'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Paiements
            </button>
            <button
              onClick={() => setActiveTab('demandes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'demandes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Demandes de Décaissement
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  activeTab === 'paiements' 
                    ? "Rechercher par référence, description, bénéficiaire ou montant..."
                    : "Rechercher par motif, description ou montant..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {activeTab === 'paiements' 
              ? `${filteredPaiements.length} paiement(s) trouvé(s)`
              : `${filteredDemandes.length} demande(s) trouvée(s)`
            }
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {activeTab === 'paiements' ? 'Liste des Paiements' : 'Liste des Demandes de Décaissement'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Chargement...</div>
          ) : (
            <>
              {activeTab === 'paiements' ? (
                // Tableau des Paiements
                !Array.isArray(paiements) ? (
                  <div className="p-6 text-center text-red-500">
                    Erreur: Format de données invalide
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Référence
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Bénéficiaire
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {currentPaiements.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                            Aucun paiement trouvé
                          </td>
                        </tr>
                      ) : (
                        currentPaiements.map((paiement) => (
                          <tr key={paiement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {paiement.reference}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {parseFloat(paiement.montant).toLocaleString('fr-FR')} {paiement.devise}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getTypePaiementBadge(paiement.type_paiement)}
                              {paiement.numero_cheque && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Chèque: {paiement.numero_cheque}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(paiement.statut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {paiement.beneficiaire || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {paiement.date_paiement ? new Date(paiement.date_paiement).toLocaleString('fr-FR', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewDetails(paiement)}
                                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                  title="Voir les détails"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(paiement)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Modifier"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(paiement.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Supprimer"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )
              ) : (
                // Tableau des Demandes de Décaissement
                !Array.isArray(demandes) ? (
                  <div className="p-6 text-center text-red-500">
                    Erreur: Format de données invalide
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Motif
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Devise
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date Demande
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredDemandes.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                            Aucune demande trouvée
                          </td>
                        </tr>
                      ) : (
                        filteredDemandes.map((demande) => (
                          <tr key={demande.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {demande.motif || demande.description || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {parseFloat(demande.montant).toLocaleString('fr-FR')} {demande.devise || 'FC'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {demande.devise || 'FC'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                                {demande.description || demande.motif || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(demande.statut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {demande.date_demande ? new Date(demande.date_demande).toLocaleString('fr-FR', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewDetailsDemande(demande)}
                                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                  title="Voir les détails"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEditDemande(demande)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Modifier"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDemande(demande.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Supprimer"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {activeTab === 'paiements' && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPaiement ? 
                  (activeTab === 'paiements' ? 'Modifier le Paiement' : 'Modifier la Demande') : 
                  (activeTab === 'paiements' ? 'Nouveau Paiement' : 'Nouvelle Demande de Décaissement')
                }
              </h3>
                              <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === 'paiements' ? (
                    // Formulaire pour les paiements
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Référence *</label>
                          <input
                            type="text"
                            required
                            value={formData.reference}
                            onChange={(e) => setFormData({...formData, reference: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Montant *</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.montant}
                            onChange={(e) => setFormData({...formData, montant: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Devise *</label>
                          <select
                            value={formData.devise}
                            onChange={(e) => setFormData({...formData, devise: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="FC">FC</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type de paiement *</label>
                          <select
                            value={formData.type_paiement}
                            onChange={(e) => setFormData({...formData, type_paiement: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="Espèces">Espèces</option>
                            <option value="Carte bancaire">Carte bancaire</option>
                            <option value="Chèque">Chèque</option>
                            <option value="Virement">Virement</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Statut *</label>
                          <select
                            value={formData.statut}
                            onChange={(e) => setFormData({...formData, statut: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="En attente">En attente</option>
                            <option value="Validé">Validé</option>
                            <option value="Rejeté">Rejeté</option>
                            <option value="Annulé">Annulé</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date de paiement *</label>
                          <input
                            type="date"
                            required
                            value={formData.date_paiement}
                            onChange={(e) => setFormData({...formData, date_paiement: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Bénéficiaire</label>
                          <input
                            type="text"
                            value={formData.beneficiaire}
                            onChange={(e) => setFormData({...formData, beneficiaire: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Numéro de chèque</label>
                          <input
                            type="text"
                            value={formData.numero_cheque}
                            onChange={(e) => setFormData({...formData, numero_cheque: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Si type = Chèque"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ID Utilisateur</label>
                          <input
                            type="number"
                            value={formData.utilisateur_id}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            title="ID de l'utilisateur connecté (lecture seule)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ID Caisse</label>
                          <input
                            type="number"
                            value={formData.caisse_id}
                            onChange={(e) => setFormData({...formData, caisse_id: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ID Chambre</label>
                          <input
                            type="number"
                            value={formData.chambre_id}
                            onChange={(e) => setFormData({...formData, chambre_id: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ID Dépense</label>
                          <input
                            type="number"
                            value={formData.depense_id}
                            onChange={(e) => setFormData({...formData, depense_id: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Caisse</label>
                          <Select
                            value={caisses.find(caisse => caisse.id === parseInt(formData.caisse_id)) || null}
                            onChange={(selectedOption) => setFormData({...formData, caisse_id: selectedOption ? selectedOption.id : ''})}
                            options={caisses.map(caisse => ({
                              value: caisse.id,
                              label: `${caisse.nom || caisse.code || 'Caisse ' + caisse.id}`,
                              id: caisse.id
                            }))}
                            placeholder="Sélectionner une caisse"
                            className="mt-1"
                            classNamePrefix="react-select"
                            isClearable
                            isSearchable
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Guichetier</label>
                          <input
                            type="text"
                            value={`${user?.nom || ''} ${user?.prenom || ''} (ID: ${user?.id || ''})`}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            title="Utilisateur guichetier connecté (lecture seule)"
                          />
                        </div>
                        <div>
                          {/* Espace libre pour équilibrer la grille */}
                        </div>
                      </div>
                    </>
                  ) : (
                    // Formulaire pour les demandes de décaissement
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Montant *</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.montant}
                            onChange={(e) => setFormData({...formData, montant: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Devise *</label>
                          <Select
                            value={deviseOptions.find(option => option.value === formData.devise)}
                            onChange={(selectedOption) => setFormData({...formData, devise: selectedOption.value})}
                            options={deviseOptions}
                            placeholder="Sélectionner une devise"
                            className="mt-1"
                            classNamePrefix="react-select"
                            isSearchable={false}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Priorité</label>
                          <select
                            value={formData.priorite || 'normale'}
                            onChange={(e) => setFormData({...formData, priorite: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="basse">Basse</option>
                            <option value="normale">Normale</option>
                            <option value="haute">Haute</option>
                            <option value="urgente">Urgente</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                          <input
                            type="text"
                            value={formData.categorie || ''}
                            onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="ex: Fournitures, Maintenance, Transport"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Statut</label>
                          <select
                            value={formData.statut || 'en_attente'}
                            onChange={(e) => setFormData({...formData, statut: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            disabled={user?.role === 'Guichetier'}
                          >
                            {user?.role === 'Guichetier' ? (
                              // Guichetier : seulement "En attente" (champ désactivé)
                              <option value="en_attente">En attente</option>
                            ) : (
                              // Superviseur/Admin : toutes les options
                              <>
                                <option value="en_attente">En attente</option>
                                <option value="approuvee">Approuvée</option>
                                <option value="rejetee">Rejetée</option>
                                <option value="annulee">Annulée</option>
                              </>
                            )}
                          </select>
                          {user?.role === 'Guichetier' && (
                            <p className="mt-1 text-xs text-gray-500">
                              Seul le superviseur peut modifier le statut
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ID Guichetier</label>
                          <input
                            type="number"
                            value={user?.id || ''}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            title="ID de l'utilisateur guichetier connecté (lecture seule)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rôle Utilisateur</label>
                          <input
                            type="text"
                            value={user?.role || ''}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            title="Rôle de l'utilisateur connecté (lecture seule)"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Motif *</label>
                        <input
                          type="text"
                          required
                          value={formData.motif}
                          onChange={(e) => setFormData({...formData, motif: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Motif de la demande de décaissement"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description détaillée</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Description détaillée de la demande"
                        />
                      </div>
                    </>
                  )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {editingPaiement ? 'Modifier' : 'Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailsModal && selectedPaiement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Détails du Paiement</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Référence</label>
                  <p className="text-sm text-gray-900">{selectedPaiement.reference}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {parseFloat(selectedPaiement.montant).toLocaleString('fr-FR')} {selectedPaiement.devise}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de paiement</label>
                  <p className="text-sm text-gray-900">{selectedPaiement.type_paiement}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <div className="mt-1">{getStatusBadge(selectedPaiement.statut)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de paiement</label>
                  <p className="text-sm text-gray-900">
                    {selectedPaiement.date_paiement ? new Date(selectedPaiement.date_paiement).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedPaiement.description || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bénéficiaire</label>
                  <p className="text-sm text-gray-900">{selectedPaiement.beneficiaire || '-'}</p>
                </div>
                {selectedPaiement.numero_cheque && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro de chèque</label>
                    <p className="text-sm text-gray-900">{selectedPaiement.numero_cheque}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de création</label>
                  <p className="text-sm text-gray-900">
                    {selectedPaiement.created_at ? new Date(selectedPaiement.created_at).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dernière modification</label>
                  <p className="text-sm text-gray-900">
                    {selectedPaiement.updated_at ? new Date(selectedPaiement.updated_at).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(selectedPaiement)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
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

export default EspaceGuichetier;
