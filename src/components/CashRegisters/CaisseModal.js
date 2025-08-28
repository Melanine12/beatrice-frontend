import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CaisseModal = ({ isOpen, onClose, onSubmit, caisse = null }) => {
  const [formData, setFormData] = useState({
    nom: '',
    code_caisse: '',
    description: '',
    emplacement: '',
    solde_initial: '',
    devise: 'EUR',
    statut: 'Active',
    limite_retrait: '',
    limite_depot: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le formulaire avec les données de la caisse si en mode édition
  useEffect(() => {
    if (caisse) {
      setFormData({
        nom: caisse.nom || '',
        code_caisse: caisse.code_caisse || '',
        description: caisse.description || '',
        emplacement: caisse.emplacement || '',
        solde_initial: caisse.solde_initial || '',
        devise: caisse.devise || 'EUR',
        statut: caisse.statut || 'Active',
        limite_retrait: caisse.limite_retrait || '',
        limite_depot: caisse.limite_depot || '',
        notes: caisse.notes || ''
      });
    } else {
      // Mode création - générer un code caisse automatiquement
      generateCodeCaisse();
    }
  }, [caisse]);

  const generateCodeCaisse = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const code = `CAISSE-${timestamp}-${random}`;
    setFormData(prev => ({
      ...prev,
      code_caisse: code
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.code_caisse.trim()) {
      newErrors.code_caisse = 'Le code caisse est requis';
    } else if (!/^[A-Z0-9\-_]+$/.test(formData.code_caisse)) {
      newErrors.code_caisse = 'Le code caisse ne peut contenir que des lettres majuscules, chiffres, tirets et underscores';
    }

    if (formData.solde_initial && parseFloat(formData.solde_initial) < 0) {
      newErrors.solde_initial = 'Le solde initial doit être positif';
    }

    if (formData.limite_retrait && parseFloat(formData.limite_retrait) < 0) {
      newErrors.limite_retrait = 'La limite de retrait doit être positive';
    }

    if (formData.limite_depot && parseFloat(formData.limite_depot) < 0) {
      newErrors.limite_depot = 'La limite de dépôt doit être positive';
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
      // Préparer les données pour l'API
      const submitData = {
        nom: formData.nom.trim(),
        code_caisse: formData.code_caisse.trim(),
        description: formData.description.trim() || null,
        emplacement: formData.emplacement.trim() || null,
        solde_initial: parseFloat(formData.solde_initial) || 0,
        devise: formData.devise,
        statut: formData.statut,
        limite_retrait: formData.limite_retrait ? parseFloat(formData.limite_retrait) : null,
        limite_depot: formData.limite_depot ? parseFloat(formData.limite_depot) : null,
        notes: formData.notes.trim() || null
      };

      // DEBUG: Log des données envoyées
      console.log('🔍 === DEBUG CLIENT ===');
      console.log('📤 Données envoyées:', JSON.stringify(submitData, null, 2));
      console.log('🔍 === FIN DEBUG CLIENT ===');

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la caisse');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {caisse ? 'Modifier la caisse' : 'Nouvelle caisse'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de la caisse *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`input ${errors.nom ? 'border-red-500' : ''}`}
                placeholder="Caisse principale"
                required
              />
              {errors.nom && (
                <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code caisse *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="code_caisse"
                  value={formData.code_caisse}
                  onChange={handleChange}
                  className={`input flex-1 ${errors.code_caisse ? 'border-red-500' : ''}`}
                  placeholder="CAISSE-001"
                  required
                />
                {!caisse && (
                  <button
                    type="button"
                    onClick={generateCodeCaisse}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Générer automatiquement"
                  >
                    🔄
                  </button>
                )}
              </div>
              {errors.code_caisse && (
                <p className="text-red-500 text-xs mt-1">{errors.code_caisse}</p>
              )}
            </div>
          </div>

          {/* Description et emplacement */}
          <div className="grid grid-cols-2 gap-6">
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
                placeholder="Description de la caisse..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emplacement
              </label>
              <input
                type="text"
                name="emplacement"
                value={formData.emplacement}
                onChange={handleChange}
                className="input"
                placeholder="Ex: Bureau principal, Réception..."
              />
            </div>
          </div>

          {/* Solde et devise */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Solde initial *
              </label>
              <input
                type="number"
                name="solde_initial"
                value={formData.solde_initial}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`input ${errors.solde_initial ? 'border-red-500' : ''}`}
                placeholder="0.00"
                required
              />
              {errors.solde_initial && (
                <p className="text-red-500 text-xs mt-1">{errors.solde_initial}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Devise
              </label>
              <select
                name="devise"
                value={formData.devise}
                onChange={handleChange}
                className="input"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF (CHF)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="input"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="En maintenance">En maintenance</option>
                <option value="Fermée">Fermée</option>
              </select>
            </div>
          </div>

          {/* Limites */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Limite de retrait quotidien
              </label>
              <input
                type="number"
                name="limite_retrait"
                value={formData.limite_retrait}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`input ${errors.limite_retrait ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.limite_retrait && (
                <p className="text-red-500 text-xs mt-1">{errors.limite_retrait}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Limite de dépôt quotidien
              </label>
              <input
                type="number"
                name="limite_depot"
                value={formData.limite_depot}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`input ${errors.limite_depot ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.limite_depot && (
                <p className="text-red-500 text-xs mt-1">{errors.limite_depot}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="input"
              placeholder="Notes additionnelles..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Sauvegarde...' : (caisse ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaisseModal; 