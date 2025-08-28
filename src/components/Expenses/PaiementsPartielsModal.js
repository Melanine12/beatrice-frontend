import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, CalendarIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const PaiementsPartielsModal = ({ expense, onClose, onUpdate }) => {
  const { hasExactRole } = useAuth();
  const [paiementsPartiels, setPaiementsPartiels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [caisses, setCaisses] = useState([]);
  const [loadingCaisses, setLoadingCaisses] = useState(false);
  const [formData, setFormData] = useState({
    montant: '',
    date_paiement: '',
    mode_paiement: 'Espèces',
    reference_paiement: '',
    notes: '',
    type_paiement: 'immediat', // 'immediat' ou 'differe'
    caisse_id: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modesPaiement = [
    'Espèces',
    'Chèque',
    'Virement',
    'Carte bancaire',
    'Mobile Money'
  ];

  useEffect(() => {
    if (expense) {
      fetchPaiementsPartiels();
      fetchCaisses();
    }
  }, [expense]);

  const fetchPaiementsPartiels = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/paiements-partiels/depense/${expense.id}`);
      setPaiementsPartiels(response.data.paiements || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements partiels:', error);
      toast.error('Erreur lors du chargement des paiements partiels');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaisses = async () => {
    try {
      setLoadingCaisses(true);
      const response = await api.get('/caisses/all');
      // Filtrer les caisses par devise
      const caissesCompatibles = response.data.caisses.filter(
        caisse => caisse.devise === expense.devise
      );
      setCaisses(caissesCompatibles);
      
      // Sélectionner automatiquement la première caisse compatible
      if (caissesCompatibles.length > 0 && !formData.caisse_id) {
        setFormData(prev => ({ ...prev, caisse_id: caissesCompatibles[0].id }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des caisses:', error);
      toast.error('Erreur lors du chargement des caisses');
    } finally {
      setLoadingCaisses(false);
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
    const montantRestant = expense.montant - expense.montant_paye;

    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    } else if (parseFloat(formData.montant) > montantRestant) {
      newErrors.montant = `Le montant ne peut pas dépasser le montant restant (${montantRestant} ${expense.devise})`;
    }

    if (formData.type_paiement === 'immediat') {
      if (!formData.date_paiement) {
        newErrors.date_paiement = 'La date de paiement est requise';
      }
    } else if (formData.type_paiement === 'differe') {
      if (!formData.date_paiement) {
        newErrors.date_paiement = 'La date de décaissement prévue est requise';
      }
      const dateDecaissement = new Date(formData.date_paiement);
      const aujourdhui = new Date();
      if (dateDecaissement <= aujourdhui) {
        newErrors.date_paiement = 'La date de décaissement doit être dans le futur';
      }
    }

    if (!formData.mode_paiement) {
      newErrors.mode_paiement = 'Le mode de paiement est requis';
    }

    if (formData.type_paiement === 'immediat' && !formData.caisse_id) {
      newErrors.caisse_id = 'La caisse est requise pour un paiement immédiat';
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
        montant: parseFloat(formData.montant),
        date_paiement: formData.date_paiement,
        caisse_id: formData.type_paiement === 'immediat' ? formData.caisse_id : null
      };

      await api.post('/paiements-partiels', submitData);
      const message = formData.type_paiement === 'immediat' 
        ? 'Paiement partiel effectué avec succès' 
        : 'Décaissement programmé avec succès';
      toast.success(message);
      
      // Reset form and refresh data
      setFormData({
        montant: '',
        date_paiement: '',
        mode_paiement: 'Espèces',
        reference_paiement: '',
        notes: '',
        type_paiement: 'immediat',
        caisse_id: caisses.length > 0 ? caisses[0].id : ''
      });
      setShowAddForm(false);
      fetchPaiementsPartiels();
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du paiement partiel:', error);
      const errorMessage = formData.type_paiement === 'immediat' 
        ? 'Erreur lors de l\'effectuation du paiement partiel' 
        : 'Erreur lors de la programmation du décaissement';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (paiementId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement partiel ?')) {
      return;
    }

    try {
      await api.delete(`/paiements-partiels/${paiementId}`);
      toast.success('Paiement partiel supprimé avec succès');
      fetchPaiementsPartiels();
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount, currency) => {
    return `${parseFloat(amount).toFixed(2)} ${currency}`;
  };

  const montantRestant = expense.montant - expense.montant_paye;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gestion des Paiements Partiels et Décaissements
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Dépense: {expense.titre} - {formatAmount(expense.montant, expense.devise)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Montant Total</p>
                  <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {formatAmount(expense.montant, expense.devise)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Montant Payé</p>
                  <p className="text-lg font-bold text-green-800 dark:text-green-200">
                    {formatAmount(expense.montant_paye || 0, expense.devise)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Montant Restant</p>
                  <p className="text-lg font-bold text-orange-800 dark:text-orange-200">
                    {formatAmount(montantRestant, expense.devise)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Payment Button */}
          {montantRestant > 0 && (
            <div className="mb-6">
              {hasExactRole('Superviseur') || hasExactRole('Administrateur') ? (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                                  <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter un Paiement/Décaissement
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
                        Seuls les Superviseurs et Administrateurs peuvent gérer les paiements partiels et décaissements.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add Payment Form */}
          {showAddForm && (hasExactRole('Superviseur') || hasExactRole('Administrateur')) && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Nouveau Paiement Partiel ou Décaissement
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type de paiement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type de Paiement *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type_paiement"
                          value="immediat"
                          checked={formData.type_paiement === 'immediat'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm">Paiement Immédiat</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type_paiement"
                          value="differe"
                          checked={formData.type_paiement === 'differe'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm">Décaissement Différé</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Montant *
                    </label>
                    <input
                      type="number"
                      name="montant"
                      value={formData.montant}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      max={montantRestant}
                      className={`input ${errors.montant ? 'border-red-500' : ''}`}
                      placeholder={`Max: ${montantRestant}`}
                    />
                    {errors.montant && (
                      <p className="text-red-500 text-xs mt-1">{errors.montant}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {formData.type_paiement === 'immediat' ? 'Date de Paiement *' : 'Date de Décaissement *'}
                    </label>
                    <input
                      type="date"
                      name="date_paiement"
                      value={formData.date_paiement}
                      onChange={handleChange}
                      min={formData.type_paiement === 'differe' ? new Date().toISOString().split('T')[0] : undefined}
                      className={`input ${errors.date_paiement ? 'border-red-500' : ''}`}
                      placeholder={formData.type_paiement === 'immediat' ? 'Date de paiement' : 'Date de décaissement prévue'}
                    />
                    {errors.date_paiement && (
                      <p className="text-red-500 text-xs mt-1">{errors.date_paiement}</p>
                    )}
                  </div>

                  {/* Caisse - visible seulement pour paiement immédiat */}
                  {formData.type_paiement === 'immediat' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Caisse *
                      </label>
                      <select
                        name="caisse_id"
                        value={formData.caisse_id}
                        onChange={handleChange}
                        className={`input ${errors.caisse_id ? 'border-red-500' : ''}`}
                        disabled={loadingCaisses}
                      >
                        <option value="">Sélectionner une caisse</option>
                        {caisses.map(caisse => (
                          <option key={caisse.id} value={caisse.id}>
                            {caisse.nom} ({caisse.devise}) - Solde: {parseFloat(caisse.solde_actuel || 0).toFixed(2)}
                          </option>
                        ))}
                      </select>
                      {errors.caisse_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.caisse_id}</p>
                      )}
                      {loadingCaisses && (
                        <p className="text-xs text-gray-500 mt-1">Chargement des caisses...</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mode de Paiement *
                    </label>
                    <select
                      name="mode_paiement"
                      value={formData.mode_paiement}
                      onChange={handleChange}
                      className={`input ${errors.mode_paiement ? 'border-red-500' : ''}`}
                    >
                      {modesPaiement.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                    {errors.mode_paiement && (
                      <p className="text-red-500 text-xs mt-1">{errors.mode_paiement}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Référence
                    </label>
                    <input
                      type="text"
                      name="reference_paiement"
                      value={formData.reference_paiement}
                      onChange={handleChange}
                      className="input"
                      placeholder="Numéro de chèque, référence virement..."
                    />
                  </div>
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
                    placeholder="Notes sur le paiement..."
                  />
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
                    {isSubmitting ? 'Enregistrement...' : formData.type_paiement === 'immediat' ? 'Effectuer le Paiement' : 'Programmer le Décaissement'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payments List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Historique des Paiements Partiels et Décaissements
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Chargement...</p>
              </div>
            ) : paiementsPartiels.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Aucun paiement partiel enregistré
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Caisse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Référence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paiementsPartiels.map((paiement) => (
                      <tr key={paiement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            paiement.caisse_id 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {paiement.caisse_id ? 'Immédiat' : 'Différé'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(paiement.date_paiement)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                          {formatAmount(paiement.montant, expense.devise)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {paiement.mode_paiement}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {paiement.caisse_id ? (
                            <span className="text-green-600 dark:text-green-400">
                              {caisses.find(c => c.id === paiement.caisse_id)?.nom || 'Caisse inconnue'}
                            </span>
                          ) : (
                            <span className="text-blue-600 dark:text-blue-400">Programmé</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {paiement.reference_paiement || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {paiement.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(paiement.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Supprimer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
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

export default PaiementsPartielsModal;
