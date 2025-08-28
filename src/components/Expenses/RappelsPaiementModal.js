import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, BellIcon, CheckIcon, EyeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const RappelsPaiementModal = ({ expense, onClose, onUpdate }) => {
  const { hasExactRole } = useAuth();
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date_rappel: '',
    type_rappel: 'Email',
    message: '',
    statut: 'En attente'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typesRappel = [
    'Email',
    'SMS',
    'Appel téléphonique',
    'Notification interne',
    'Courrier'
  ];

  const statutsRappel = [
    'En attente',
    'Envoyé',
    'Lu',
    'Traité'
  ];

  useEffect(() => {
    if (expense) {
      fetchRappels();
    }
  }, [expense]);

  const fetchRappels = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/rappels-paiement/depense/${expense.id}`);
      setRappels(response.data.rappels || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des rappels:', error);
      toast.error('Erreur lors du chargement des rappels');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date_rappel) {
      newErrors.date_rappel = 'La date de rappel est requise';
    }

    if (!formData.type_rappel) {
      newErrors.type_rappel = 'Le type de rappel est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        depense_id: expense.id,
        date_rappel: formData.date_rappel
      };

      await api.post('/rappels-paiement', submitData);
      toast.success('Rappel de paiement ajouté avec succès');
      
      // Reset form and refresh data
      setFormData({
        date_rappel: '',
        type_rappel: 'Email',
        message: '',
        statut: 'En attente'
      });
      setShowAddForm(false);
      fetchRappels();
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rappel:', error);
      toast.error('Erreur lors de l\'ajout du rappel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (rappelId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) {
      return;
    }

    try {
      await api.delete(`/rappels-paiement/${rappelId}`);
      toast.success('Rappel supprimé avec succès');
      fetchRappels();
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusUpdate = async (rappelId, newStatus) => {
    try {
      let endpoint = '';
      switch (newStatus) {
        case 'Envoyé':
          endpoint = `/rappels-paiement/${rappelId}/mark-sent`;
          break;
        case 'Lu':
          endpoint = `/rappels-paiement/${rappelId}/mark-read`;
          break;
        case 'Traité':
          endpoint = `/rappels-paiement/${rappelId}/mark-processed`;
          break;
        default:
          toast.error('Statut non supporté');
          return;
      }
      
      await api.post(endpoint);
      toast.success('Statut mis à jour avec succès');
      fetchRappels();
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Envoyé':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Lu':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Traité':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Email':
        return '📧';
      case 'SMS':
        return '📱';
      case 'Appel téléphonique':
        return '📞';
      case 'Notification interne':
        return '🔔';
      case 'Courrier':
        return '📮';
      default:
        return '📋';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gestion des Rappels de Paiement
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Dépense: {expense.titre} - {expense.montant} {expense.devise}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Add Reminder Button */}
          <div className="mb-6">
            {hasExactRole('Superviseur') || hasExactRole('Administrateur') ? (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter un Rappel
              </button>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Permissions insuffisantes
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Seuls les Superviseurs et Administrateurs peuvent gérer les rappels de paiement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Reminder Form */}
          {showAddForm && (hasExactRole('Superviseur') || hasExactRole('Administrateur')) && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Nouveau Rappel de Paiement
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date de Rappel *
                    </label>
                    <input
                      type="date"
                      name="date_rappel"
                      value={formData.date_rappel}
                      onChange={handleChange}
                      className={`input ${errors.date_rappel ? 'border-red-500' : ''}`}
                    />
                    {errors.date_rappel && (
                      <p className="text-red-500 text-xs mt-1">{errors.date_rappel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type de Rappel *
                    </label>
                    <select
                      name="type_rappel"
                      value={formData.type_rappel}
                      onChange={handleChange}
                      className={`input ${errors.type_rappel ? 'border-red-500' : ''}`}
                    >
                      {typesRappel.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.type_rappel && (
                      <p className="text-red-500 text-xs mt-1">{errors.type_rappel}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    className={`input ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Message du rappel..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-outline"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Ajouter le Rappel'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reminders List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Historique des Rappels
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Chargement...</p>
              </div>
            ) : rappels.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Aucun rappel enregistré
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Message
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
                    {rappels.map((rappel) => (
                      <tr key={rappel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(rappel.date_rappel)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <span className="mr-2">{getTypeIcon(rappel.type_rappel)}</span>
                            {rappel.type_rappel}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div className="max-w-xs truncate" title={rappel.message}>
                            {rappel.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rappel.statut)}`}>
                            {rappel.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* Status Update Buttons */}
                            {rappel.statut === 'En attente' && (
                              <button
                                onClick={() => handleStatusUpdate(rappel.id, 'Envoyé')}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Marquer comme envoyé"
                              >
                                <BellIcon className="w-4 h-4" />
                              </button>
                            )}
                            
                            {rappel.statut === 'Envoyé' && (
                              <button
                                onClick={() => handleStatusUpdate(rappel.id, 'Lu')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Marquer comme lu"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            )}
                            
                            {rappel.statut === 'Lu' && (
                              <button
                                onClick={() => handleStatusUpdate(rappel.id, 'Traité')}
                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                title="Marquer comme traité"
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(rappel.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <TrashIcon className="w-4 h-4" />
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

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="btn-outline"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RappelsPaiementModal;
