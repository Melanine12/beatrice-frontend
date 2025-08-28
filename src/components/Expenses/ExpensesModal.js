import React, { useState, useEffect } from 'react';
import { XMarkIcon, DocumentIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import FileUploader from '../Inventory/FileUploader';
import api from '../../services/api';

const ExpensesModal = ({ expense, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    montant: '',
    devise: 'EUR',
    categorie: 'Autre',
    fournisseur: '',
    numero_facture: '',
    chambre_id: '',
    caisse_id: '',
    notes: '',
    tags: [],
    fichiers: [],
    // Nouveaux champs pour la gestion des paiements
    date_paiement_prevue: '',
    urgence: 'Normale',
    priorite_paiement: 'Moyenne',
    notes_paiement: '',
    responsable_paiement_id: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [caisses, setCaisses] = useState([]);
  const [loadingCaisses, setLoadingCaisses] = useState(false);

  const categories = [
    'Maintenance',
    'Nettoyage',
    'Équipement',
    'Services',
    'Marketing',
    'Administration',
    'Autre'
  ];

  const devises = ['EUR', 'USD', 'GBP'];

  const niveauxUrgence = [
    'Très faible',
    'Faible', 
    'Normale',
    'Élevée',
    'Très élevée',
    'Critique'
  ];

  const prioritesPaiement = [
    'Très basse',
    'Basse',
    'Moyenne',
    'Haute',
    'Très haute',
    'Urgente'
  ];

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
      } finally {
        setLoadingCaisses(false);
      }
    };

    fetchCaisses();
  }, []);

  useEffect(() => {
    if (expense) {
      // Parse tags and fichiers if they are JSON strings
      let tags = [];
      let fichiers = [];
      
      try {
        if (expense.tags) {
          tags = typeof expense.tags === 'string' ? JSON.parse(expense.tags) : expense.tags;
          if (!Array.isArray(tags)) tags = [];
        }
      } catch (error) {
        console.warn('Erreur lors du parsing des tags:', error);
        tags = [];
      }
      
      try {
        if (expense.fichiers) {
          fichiers = typeof expense.fichiers === 'string' ? JSON.parse(expense.fichiers) : expense.fichiers;
          if (!Array.isArray(fichiers)) fichiers = [];
        }
      } catch (error) {
        console.warn('Erreur lors du parsing des fichiers:', error);
        fichiers = [];
      }
      
      setFormData({
        titre: expense.titre || '',
        description: expense.description || '',
        montant: expense.montant || '',
        devise: expense.devise || 'EUR',
        categorie: expense.categorie || 'Autre',
        fournisseur: expense.fournisseur || '',
        numero_facture: expense.numero_facture || '',
        chambre_id: expense.chambre_id || '',
        caisse_id: expense.caisse_id || '',
        notes: expense.notes || '',
        tags: tags,
        fichiers: fichiers,
        // Nouveaux champs
        date_paiement_prevue: expense.date_paiement_prevue || '',
        urgence: expense.urgence || 'Normale',
        priorite_paiement: expense.priorite_paiement || 'Moyenne',
        notes_paiement: expense.notes_paiement || '',
        responsable_paiement_id: expense.responsable_paiement_id || ''
      });
    }
  }, [expense]);

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

    // Validation en temps réel du montant par rapport au solde de la caisse
    if (name === 'montant' && formData.caisse_id) {
      const caisseSelectionnee = caisses.find(c => c.id === formData.caisse_id);
      if (caisseSelectionnee && value) {
        const montantDepense = parseFloat(value);
        const soldeCaisse = parseFloat(caisseSelectionnee.solde_actuel || 0);
        
        if (montantDepense > soldeCaisse) {
          setErrors(prev => ({
            ...prev,
            montant: `Le montant (${montantDepense} ${caisseSelectionnee.devise}) ne peut pas dépasser le solde disponible de la caisse (${soldeCaisse} ${caisseSelectionnee.devise})`
          }));
        }
      }
    }
  };

  const handleCaisseChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      caisse_id: selectedOption ? selectedOption.value : ''
    }));
    
    // Clear error when user selects a caisse
    if (errors.caisse_id) {
      setErrors(prev => ({
        ...prev,
        caisse_id: ''
      }));
    }

    // Valider le montant existant par rapport à la nouvelle caisse sélectionnée
    if (selectedOption && formData.montant) {
      const caisseSelectionnee = caisses.find(c => c.id === selectedOption.value);
      if (caisseSelectionnee) {
        const montantDepense = parseFloat(formData.montant);
        const soldeCaisse = parseFloat(caisseSelectionnee.solde_actuel || 0);
        
        if (montantDepense > soldeCaisse) {
          setErrors(prev => ({
            ...prev,
            montant: `Le montant (${montantDepense} ${caisseSelectionnee.devise}) ne peut pas dépasser le solde disponible de la caisse (${soldeCaisse} ${caisseSelectionnee.devise})`
          }));
        } else {
          // Clear montant error if validation passes
          if (errors.montant) {
            setErrors(prev => ({
              ...prev,
              montant: ''
            }));
          }
        }
      }
    }
  };

  const handleFileUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      fichiers: [...prev.fichiers, ...files]
    }));
  };

  const handleFileRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      fichiers: prev.fichiers.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }

    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    }

    // Validation du montant par rapport au solde de la caisse
    if (formData.caisse_id && formData.montant) {
      const caisseSelectionnee = caisses.find(c => c.id === formData.caisse_id);
      if (caisseSelectionnee) {
        const montantDepense = parseFloat(formData.montant);
        const soldeCaisse = parseFloat(caisseSelectionnee.solde_actuel || 0);
        
        if (montantDepense > soldeCaisse) {
          newErrors.montant = `Le montant (${montantDepense} ${caisseSelectionnee.devise}) ne peut pas dépasser le solde disponible de la caisse (${soldeCaisse} ${caisseSelectionnee.devise})`;
        }
      }
    }

    if (!formData.categorie) {
      newErrors.categorie = 'La catégorie est requise';
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
        montant: parseFloat(formData.montant),
        chambre_id: formData.chambre_id ? parseInt(formData.chambre_id) : null
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {expense ? 'Modifier la Dépense' : 'Nouvelle Dépense'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className={`input ${errors.titre ? 'border-red-500' : ''}`}
                  placeholder="Titre de la dépense"
                />
                {errors.titre && (
                  <p className="text-red-500 text-xs mt-1">{errors.titre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie *
                </label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className={`input ${errors.categorie ? 'border-red-500' : ''}`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categorie && (
                  <p className="text-red-500 text-xs mt-1">{errors.categorie}</p>
                )}
              </div>
            </div>

            {/* Description */}
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
                placeholder="Description détaillée de la dépense"
              />
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className={`input ${errors.montant ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.montant && (
                  <p className="text-red-500 text-xs mt-1">{errors.montant}</p>
                )}
                {/* Indicateur du solde disponible de la caisse */}
                {formData.caisse_id && (
                  (() => {
                    const caisseSelectionnee = caisses.find(c => c.id === formData.caisse_id);
                    if (caisseSelectionnee) {
                      const soldeCaisse = parseFloat(caisseSelectionnee.solde_actuel || 0);
                      const montantDepense = parseFloat(formData.montant || 0);
                      const soldeRestant = soldeCaisse - montantDepense;
                      return (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Solde disponible :</span> {soldeCaisse} {caisseSelectionnee.devise}
                          </p>
                          {montantDepense > 0 && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              <span className="font-medium">Solde après dépense :</span> {soldeRestant.toFixed(2)} {caisseSelectionnee.devise}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()
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
                  {devises.map(devise => (
                    <option key={devise} value={devise}>{devise}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chambre (optionnel)
                </label>
                <input
                  type="number"
                  name="chambre_id"
                  value={formData.chambre_id}
                  onChange={handleChange}
                  min="1"
                  className="input"
                  placeholder="Numéro de chambre"
                />
              </div>
            </div>

            {/* Supplier Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fournisseur
                </label>
                <input
                  type="text"
                  name="fournisseur"
                  value={formData.fournisseur}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nom du fournisseur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Numéro de facture
                </label>
                <input
                  type="text"
                  name="numero_facture"
                  value={formData.numero_facture}
                  onChange={handleChange}
                  className="input"
                  placeholder="Numéro de facture"
                />
              </div>
            </div>

            {/* Caisse Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Caisse (optionnel)
              </label>
              <Select
                value={caisses.find(c => c.id === formData.caisse_id) ? 
                  { 
                    value: formData.caisse_id, 
                    label: `${caisses.find(c => c.id === formData.caisse_id)?.nom} (${caisses.find(c => c.id === formData.caisse_id)?.code_caisse}) - Solde: ${caisses.find(c => c.id === formData.caisse_id)?.solde_actuel || 0} ${caisses.find(c => c.id === formData.caisse_id)?.devise}` 
                  } : null}
                onChange={handleCaisseChange}
                options={caisses.map(caisse => ({
                  value: caisse.id,
                  label: `${caisse.nom} (${caisse.code_caisse}) - Solde: ${caisse.solde_actuel || 0} ${caisse.devise}`
                }))}
                isClearable
                placeholder={loadingCaisses ? "Chargement des caisses..." : "Sélectionner une caisse"}
                isLoading={loadingCaisses}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() => "Aucune caisse disponible"}
                isDisabled={loadingCaisses}
              />
              {errors.caisse_id && (
                <p className="text-red-500 text-xs mt-1">{errors.caisse_id}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="input flex-1"
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-outline px-3"
                >
                  <TagIcon className="w-4 h-4" />
                </button>
              </div>
              
              {/* Display existing tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                placeholder="Notes supplémentaires"
              />
            </div>

            {/* Gestion des Paiements */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Gestion des Paiements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de Paiement Prévue
                  </label>
                  <input
                    type="date"
                    name="date_paiement_prevue"
                    value={formData.date_paiement_prevue}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Niveau d'Urgence
                  </label>
                  <select
                    name="urgence"
                    value={formData.urgence}
                    onChange={handleChange}
                    className="input"
                  >
                    {niveauxUrgence.map(niveau => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priorité de Paiement
                  </label>
                  <select
                    name="priorite_paiement"
                    value={formData.priorite_paiement}
                    onChange={handleChange}
                    className="input"
                  >
                    {prioritesPaiement.map(priorite => (
                      <option key={priorite} value={priorite}>{priorite}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Responsable Paiement (ID)
                  </label>
                  <input
                    type="number"
                    name="responsable_paiement_id"
                    value={formData.responsable_paiement_id}
                    onChange={handleChange}
                    className="input"
                    placeholder="ID de l'utilisateur responsable"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes sur le Paiement
                </label>
                <textarea
                  name="notes_paiement"
                  value={formData.notes_paiement}
                  onChange={handleChange}
                  rows="2"
                  className="input"
                  placeholder="Notes spécifiques au paiement..."
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fichiers (factures, devis, etc.)
              </label>
              <FileUploader
                onFilesUploaded={handleFileUpload}
                acceptedTypes={['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                maxFiles={5}
                maxSize={5 * 1024 * 1024} // 5MB
              />
              
              {/* Display existing files */}
              {formData.fichiers.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.fichiers.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center space-x-2">
                        <DocumentIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {file.originalname || file.filename}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileRemove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
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
                {isSubmitting ? 'Enregistrement...' : (expense ? 'Modifier' : 'Créer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpensesModal; 