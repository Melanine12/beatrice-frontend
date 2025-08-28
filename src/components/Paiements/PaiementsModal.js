import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaiementsModal = ({ paiement, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    montant: '',
    devise: 'EUR',
    type_paiement: 'Espèces',
    description: '',
    beneficiaire: '',
    numero_cheque: '',
    caisse_id: '',
    chambre_id: '',
    depense_id: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [caisses, setCaisses] = useState([]);
  const [loadingCaisses, setLoadingCaisses] = useState(false);
  const [chambres, setChambres] = useState([]);
  const [loadingChambres, setLoadingChambres] = useState(false);
  const [depenses, setDepenses] = useState([]);
  const [loadingDepenses, setLoadingDepenses] = useState(false);

  // Récupérer les caisses pour le select
  useEffect(() => {
    const fetchCaisses = async () => {
      try {
        setLoadingCaisses(true);
        const response = await api.get('/caisses/all');
        if (response.data.success) {
          setCaisses(response.data.caisses);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des caisses:', error);
        toast.error('Erreur lors de la récupération des caisses');
      } finally {
        setLoadingCaisses(false);
      }
    };

    fetchCaisses();
  }, []);

  // Récupérer les chambres pour le select
  useEffect(() => {
    const fetchChambres = async () => {
      try {
        setLoadingChambres(true);
        const response = await api.get('/chambres');
        if (response.data.success) {
          setChambres(response.data.chambres);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des chambres:', error);
        toast.error('Erreur lors de la récupération des chambres');
      } finally {
        setLoadingChambres(false);
      }
    };

    fetchChambres();
  }, []);

  // Récupérer les dépenses pour le select
  useEffect(() => {
    const fetchDepenses = async () => {
      try {
        setLoadingDepenses(true);
        const response = await api.get('/depenses');
        if (response.data.success) {
          setDepenses(response.data.depenses);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des dépenses:', error);
        toast.error('Erreur lors de la récupération des dépenses');
      } finally {
        setLoadingDepenses(false);
      }
    };

    fetchDepenses();
  }, []);

  // Initialiser le formulaire avec les données du paiement existant
  useEffect(() => {
    if (paiement) {
      setFormData({
        montant: paiement.montant || '',
        devise: paiement.devise || 'EUR',
        type_paiement: paiement.type_paiement || 'Espèces',
        description: paiement.description || '',
        beneficiaire: paiement.beneficiaire || '',
        numero_cheque: paiement.numero_cheque || '',
        caisse_id: paiement.caisse_id || '',
        chambre_id: paiement.chambre_id || '',
        depense_id: paiement.depense_id || '',
        notes: paiement.notes || ''
      });
    }
  }, [paiement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCaisseChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      caisse_id: selectedOption ? selectedOption.value : ''
    }));
    
    if (errors.caisse_id) {
      setErrors(prev => ({
        ...prev,
        caisse_id: ''
      }));
    }
  };

  const handleChambreChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      chambre_id: selectedOption ? selectedOption.value : ''
    }));
    
    if (errors.chambre_id) {
      setErrors(prev => ({
        ...prev,
        chambre_id: ''
      }));
    }
  };

  const handleDepenseChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      depense_id: selectedOption ? selectedOption.value : ''
    }));
    
    if (errors.depense_id) {
      setErrors(prev => ({
        ...prev,
        depense_id: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      newErrors.montant = 'Le montant est requis et doit être positif';
    }

    if (!formData.description || formData.description.trim().length < 3) {
      newErrors.description = 'La description doit contenir au moins 3 caractères';
    }

    if (!formData.beneficiaire || formData.beneficiaire.trim().length < 2) {
      newErrors.beneficiaire = 'Le nom du bénéficiaire est requis';
    }

    if (formData.type_paiement === 'Chèque' && !formData.numero_cheque) {
      newErrors.numero_cheque = 'Le numéro de chèque est requis pour ce type de paiement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        montant: parseFloat(formData.montant),
        caisse_id: formData.caisse_id || null,
        chambre_id: formData.chambre_id || null,
        depense_id: formData.depense_id || null
      };

      if (paiement) {
        // Mise à jour
        await api.put(`/paiements/${paiement.id}`, submitData);
        toast.success('Paiement mis à jour avec succès');
      } else {
        // Création
        await api.post('/paiements', submitData);
        toast.success('Paiement créé avec succès');
      }

      onSubmit();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const optionsCaisses = caisses.map(caisse => ({
    value: caisse.id,
    label: `${caisse.nom} (${caisse.code_caisse}) - Solde: ${caisse.solde_actuel || 0} ${caisse.devise}`
  }));

  const optionsChambres = chambres.map(chambre => ({
    value: chambre.id,
    label: `Chambre ${chambre.numero} - ${chambre.type}`
  }));

  const optionsDepenses = depenses.map(depense => ({
    value: depense.id,
    label: `${depense.titre} - ${depense.montant} ${depense.devise}`
  }));

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {paiement ? 'Modifier le Paiement' : 'Nouveau Paiement'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Montant et Devise */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant *
                </label>
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.montant ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.montant && (
                  <p className="text-red-500 text-xs mt-1">{errors.montant}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Devise *
                </label>
                <select
                  name="devise"
                  value={formData.devise}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
            </div>

            {/* Type de Paiement et Statut */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Paiement *
                </label>
                <select
                  name="type_paiement"
                  value={formData.type_paiement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Espèces">Espèces</option>
                  <option value="Carte bancaire">Carte bancaire</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Virement">Virement</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de Chèque
                </label>
                <input
                  type="text"
                  name="numero_cheque"
                  value={formData.numero_cheque}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.numero_cheque ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Numéro de chèque"
                  disabled={formData.type_paiement !== 'Chèque'}
                />
                {errors.numero_cheque && (
                  <p className="text-red-500 text-xs mt-1">{errors.numero_cheque}</p>
                )}
              </div>
            </div>

            {/* Description et Bénéficiaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Description du paiement"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bénéficiaire *
              </label>
              <input
                type="text"
                name="beneficiaire"
                value={formData.beneficiaire}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.beneficiaire ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nom du bénéficiaire"
              />
              {errors.beneficiaire && (
                <p className="text-red-500 text-xs mt-1">{errors.beneficiaire}</p>
              )}
            </div>

            {/* Caisse et Chambre */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caisse (optionnel)
                </label>
                <Select
                  value={optionsCaisses.find(option => option.value === formData.caisse_id)}
                  onChange={handleCaisseChange}
                  options={optionsCaisses}
                  isClearable
                  placeholder="Sélectionner une caisse"
                  isLoading={loadingCaisses}
                  noOptionsMessage={() => "Aucune caisse disponible"}
                  className={`${errors.caisse_id ? 'border-red-500' : ''}`}
                />
                {errors.caisse_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.caisse_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chambre (optionnel)
                </label>
                <Select
                  value={optionsChambres.find(option => option.value === formData.chambre_id)}
                  onChange={handleChambreChange}
                  options={optionsChambres}
                  isClearable
                  placeholder="Sélectionner une chambre"
                  isLoading={loadingChambres}
                  noOptionsMessage={() => "Aucune chambre disponible"}
                  className={`${errors.chambre_id ? 'border-red-500' : ''}`}
                />
                {errors.chambre_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.chambre_id}</p>
                )}
              </div>
            </div>

            {/* Dépense associée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dépense associée (optionnel)
              </label>
              <Select
                value={optionsDepenses.find(option => option.value === formData.depense_id)}
                onChange={handleDepenseChange}
                options={optionsDepenses}
                isClearable
                placeholder="Sélectionner une dépense"
                isLoading={loadingDepenses}
                noOptionsMessage={() => "Aucune dépense disponible"}
                className={`${errors.depense_id ? 'border-red-500' : ''}`}
              />
              {errors.depense_id && (
                <p className="text-red-500 text-xs mt-1">{errors.depense_id}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes supplémentaires"
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sauvegarde...' : (paiement ? 'Mettre à jour' : 'Créer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaiementsModal; 