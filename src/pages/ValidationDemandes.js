import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ValidationDemandes = () => {
  const { user, hasPermission } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [commentaire, setCommentaire] = useState('');

  useEffect(() => {
    if (hasPermission('Superviseur')) {
      fetchDemandes();
    }
  }, [hasPermission]);

  const fetchDemandes = async () => {
    try {
      const response = await api.get('/demandes/en-attente');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setDemandes(response.data.data);
      } else {
        setDemandes([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      toast.error('Erreur lors de la récupération des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (demandeId, statut) => {
    try {
      if (statut === 'approuvee') {
        await api.post(`/demandes/${demandeId}/approuver`, {
          commentaire_superviseur: commentaire
        });
      } else {
        await api.post(`/demandes/${demandeId}/rejeter`, {
          commentaire_superviseur: commentaire
        });
      }
      
      toast.success(`Demande ${statut === 'approuvee' ? 'approuvée' : 'rejetée'} avec succès`);
      setCommentaire('');
      setShowDetailsModal(false);
      fetchDemandes();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error('Erreur lors de la validation de la demande');
    }
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      'approuvee': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      'rejetee': { color: 'bg-red-100 text-red-800', icon: XCircleIcon }
    };

    const config = statusConfig[statut] || statusConfig['en_attente'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {statut === 'en_attente' ? 'En attente' : 
         statut === 'approuvee' ? 'Approuvée' : 'Rejetée'}
      </span>
    );
  };

  const openDetailsModal = (demande) => {
    setSelectedDemande(demande);
    setShowDetailsModal(true);
  };

  if (!hasPermission('Superviseur')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous devez être superviseur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Validation des Demandes de Décaissement
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Validez ou rejetez les demandes de décaissement des guichetiers
          </p>
        </div>
      </div>

      {/* Demandes Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Demandes en attente de validation
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Guichetier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date Demande
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : demandes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Aucune demande en attente de validation
                  </td>
                </tr>
              ) : (
                demandes.map((demande) => (
                  <tr key={demande.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {demande.guichetier?.prenom} {demande.guichetier?.nom}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {demande.guichetier?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {demande.motif}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {demande.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {parseFloat(demande.montant).toLocaleString('fr-FR')} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(demande.date_demande).toLocaleTimeString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(demande.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openDetailsModal(demande)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {demande.statut === 'en_attente' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openDetailsModal(demande)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDetailsModal(demande)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails et Validation */}
      {showDetailsModal && selectedDemande && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Détails de la demande</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guichetier</label>
                  <p className="text-sm text-gray-900">
                    {selectedDemande.guichetier?.prenom} {selectedDemande.guichetier?.nom}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motif</label>
                  <p className="text-sm text-gray-900">{selectedDemande.motif}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedDemande.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {parseFloat(selectedDemande.montant).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de demande</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedDemande.date_demande).toLocaleDateString('fr-FR')} à {new Date(selectedDemande.date_demande).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>

              {selectedDemande.statut === 'en_attente' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
                    <textarea
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ajoutez un commentaire sur votre décision..."
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleValidation(selectedDemande.id, 'approuvee')}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleValidation(selectedDemande.id, 'rejetee')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Rejeter
                    </button>
                  </div>
                </>
              )}
              
              <div className="mt-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
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

export default ValidationDemandes;
