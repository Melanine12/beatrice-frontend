import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';
import {
  PlusIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Investors = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    investment_type: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    adresse: '',
    type_investissement: '',
    montant_investi: '',
    date_investissement: '',
    statut: 'actif',
    notes: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchInvestors();
    }
  }, [isAuthenticated, filters, pagination.currentPage]);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      // Simuler des données d'investisseurs pour l'instant
      // TODO: Remplacer par un vrai appel API
      const mockInvestors = [
        {
          id: 1,
          nom_complet: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          telephone: '+33 1 23 45 67 89',
          adresse: '123 Rue de la Paix, 75001 Paris',
          type_investissement: 'Immobilier',
          montant_investi: 500000,
          date_investissement: '2023-01-15',
          statut: 'actif',
          notes: 'Investisseur principal, très impliqué dans le projet'
        },
        {
          id: 2,
          nom_complet: 'Marie Martin',
          email: 'marie.martin@email.com',
          telephone: '+33 1 98 76 54 32',
          adresse: '456 Avenue des Champs, 75008 Paris',
          type_investissement: 'Équipement',
          montant_investi: 250000,
          date_investissement: '2023-03-20',
          statut: 'actif',
          notes: 'Spécialisée dans l\'équipement hôtelier'
        },
        {
          id: 3,
          nom_complet: 'Pierre Durand',
          email: 'pierre.durand@email.com',
          telephone: '+33 1 11 22 33 44',
          adresse: '789 Boulevard Saint-Germain, 75006 Paris',
          type_investissement: 'Marketing',
          montant_investi: 100000,
          date_investissement: '2023-02-10',
          statut: 'inactif',
          notes: 'Ancien investisseur, retiré du projet'
        }
      ];
      
      setInvestors(mockInvestors);
      setPagination(prev => ({
        ...prev,
        totalItems: mockInvestors.length,
        totalPages: Math.ceil(mockInvestors.length / prev.itemsPerPage)
      }));
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast.error('Erreur lors du chargement des investisseurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (selectedInvestor) {
        // Update existing investor
        // TODO: Appel API pour mettre à jour
        toast.success('Investisseur mis à jour avec succès');
      } else {
        // Create new investor
        // TODO: Appel API pour créer
        toast.success('Investisseur enregistré avec succès');
      }
      
      setShowModal(false);
      setSelectedInvestor(null);
      resetForm();
      fetchInvestors();
    } catch (error) {
      console.error('Error saving investor:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'investisseur');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet investisseur ?')) {
      try {
        setLoading(true);
        // TODO: Appel API pour supprimer
        toast.success('Investisseur supprimé avec succès');
        fetchInvestors();
      } catch (error) {
        console.error('Error deleting investor:', error);
        toast.error('Erreur lors de la suppression de l\'investisseur');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (investor) => {
    setSelectedInvestor(investor);
    setFormData({
      nom_complet: investor.nom_complet,
      email: investor.email,
      telephone: investor.telephone,
      adresse: investor.adresse,
      type_investissement: investor.type_investissement,
      montant_investi: investor.montant_investi.toString(),
      date_investissement: investor.date_investissement,
      statut: investor.statut,
      notes: investor.notes
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nom_complet: '',
      email: '',
      telephone: '',
      adresse: '',
      type_investissement: '',
      montant_investi: '',
      date_investissement: '',
      statut: 'actif',
      notes: ''
    });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vous devez être connecté pour accéder à la gestion des investisseurs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Investisseurs
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enregistrez et gérez les investisseurs de l'hôtel
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedInvestor(null);
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Enregistrer un Investisseur
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Recherche</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="form-input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="form-select"
            >
              <option value="">Tous</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          <div>
            <label className="form-label">Type d'investissement</label>
            <select
              value={filters.investment_type}
              onChange={(e) => setFilters(prev => ({ ...prev, investment_type: e.target.value }))}
              className="form-select"
            >
              <option value="">Tous</option>
              <option value="Immobilier">Immobilier</option>
              <option value="Équipement">Équipement</option>
              <option value="Marketing">Marketing</option>
              <option value="Technologie">Technologie</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ search: '', status: '', investment_type: '' })}
              className="btn-secondary w-full"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Investors Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="table-header">Investisseur</th>
                    <th className="table-header">Contact</th>
                    <th className="table-header">Type d'investissement</th>
                    <th className="table-header">Montant</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Statut</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {investors.map((investor) => (
                    <tr key={investor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {investor.nom_complet}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {investor.adresse}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {investor.email}
                          </div>
                          <div className="flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {investor.telephone}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {investor.type_investissement}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {investor.montant_investi.toLocaleString()} €
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(investor.date_investissement).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          investor.statut === 'actif' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {investor.statut === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(investor)}
                            className="btn-icon btn-icon-primary"
                            title="Modifier"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(investor.id)}
                            className="btn-icon btn-icon-danger"
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
            
            {investors.length === 0 && (
              <div className="text-center py-12">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Aucun investisseur
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Commencez par enregistrer votre premier investisseur.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {investors.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {selectedInvestor ? 'Modifier l\'investisseur' : 'Enregistrer un investisseur'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom_complet}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom_complet: e.target.value }))}
                    className="form-input"
                    placeholder="Nom et prénom"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                      className="form-input"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Adresse</label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                    className="form-textarea"
                    rows="2"
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Type d'investissement *</label>
                    <select
                      required
                      value={formData.type_investissement}
                      onChange={(e) => setFormData(prev => ({ ...prev, type_investissement: e.target.value }))}
                      className="form-select"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Immobilier">Immobilier</option>
                      <option value="Équipement">Équipement</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Technologie">Technologie</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Montant investi (€) *</label>
                    <input
                      type="number"
                      required
                      value={formData.montant_investi}
                      onChange={(e) => setFormData(prev => ({ ...prev, montant_investi: e.target.value }))}
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Date d'investissement *</label>
                    <input
                      type="date"
                      required
                      value={formData.date_investissement}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_investissement: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value }))}
                      className="form-select"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-textarea"
                    rows="3"
                    placeholder="Informations supplémentaires..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedInvestor(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Enregistrement...' : (selectedInvestor ? 'Mettre à jour' : 'Enregistrer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investors; 