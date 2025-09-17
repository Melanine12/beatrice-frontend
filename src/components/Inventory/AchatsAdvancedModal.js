import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import FileUploader from './FileUploader';

const AchatsAdvancedModal = ({ 
  item, 
  onClose, 
  onSubmit, 
  selectStyles = {}, 
  fournisseurOptions = [], 
  inventoryOptions = [] 
}) => {
  const [formData, setFormData] = useState({
    fournisseur_principal_id: '',
    priorite: 'Normale',
    date_livraison_souhaitee: '',
    montant_ht: '',
    montant_tva: '',
    taux_tva: 20,
    frais_livraison: '',
    adresse_livraison: '',
    notes: '',
    lignes_achat: [],
    fournisseurs_supplementaires: [],
    pieces_justificatives: []
  });

  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    if (item) {
      // Parse pieces_justificatives if it's a JSON string
      let piecesJustificatives = [];
      if (item.pieces_justificatives) {
        try {
          piecesJustificatives = typeof item.pieces_justificatives === 'string' 
            ? JSON.parse(item.pieces_justificatives) 
            : item.pieces_justificatives;
        } catch (error) {
          console.error('Error parsing pieces_justificatives:', error);
          piecesJustificatives = [];
        }
      }

      setFormData({
        fournisseur_principal_id: item.fournisseur_principal_id || '',
        priorite: item.priorite || 'Normale',
        date_livraison_souhaitee: item.date_livraison_souhaitee || '',
        montant_ht: item.montant_ht || '',
        montant_tva: item.montant_tva || '',
        taux_tva: item.taux_tva || 20,
        frais_livraison: item.frais_livraison || '',
        adresse_livraison: item.adresse_livraison || '',
        notes: item.notes || '',
        lignes_achat: item.lignes_achat || [],
        fournisseurs_supplementaires: item.fournisseurs_supplementaires || [],
        pieces_justificatives: piecesJustificatives
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addLigneAchat = () => {
    setFormData(prev => ({
      ...prev,
      lignes_achat: [...prev.lignes_achat, {
        produit_id: '',
        quantite: 1,
        prix_unitaire: '',
        prix_auto: false,
        fournisseur_id: '',
        description: '',
        grammage: ''
      }]
    }));
  };

  const removeLigneAchat = (index) => {
    setFormData(prev => ({
      ...prev,
      lignes_achat: prev.lignes_achat.filter((_, i) => i !== index)
    }));
  };

  const updateLigneAchat = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      lignes_achat: prev.lignes_achat.map((ligne, i) => {
        if (i === index) {
          const updatedLigne = { ...ligne, [field]: value };
          
          // Si on change le produit, récupérer automatiquement le prix unitaire
          if (field === 'produit_id' && value) {
            const selectedProduct = inventoryOptions.find(option => option.value === value);
            if (selectedProduct && selectedProduct.prix_unitaire) {
              updatedLigne.prix_unitaire = selectedProduct.prix_unitaire;
              updatedLigne.prix_auto = true; // Marquer que le prix a été rempli automatiquement
            }
          }
          
          return updatedLigne;
        }
        return ligne;
      })
    }));
  };

  const addFournisseurSupplementaire = () => {
    setFormData(prev => ({
      ...prev,
      fournisseurs_supplementaires: [...prev.fournisseurs_supplementaires, {
        fournisseur_id: '',
        montant: '',
        role: 'Fournisseur'
      }]
    }));
  };

  const removeFournisseurSupplementaire = (index) => {
    setFormData(prev => ({
      ...prev,
      fournisseurs_supplementaires: prev.fournisseurs_supplementaires.filter((_, i) => i !== index)
    }));
  };

  const updateFournisseurSupplementaire = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      fournisseurs_supplementaires: prev.fournisseurs_supplementaires.map((fournisseur, i) => 
        i === index ? { ...fournisseur, [field]: value } : fournisseur
      )
    }));
  };

  const handleFilesUploaded = (uploadedFiles) => {
    setFormData(prev => ({
      ...prev,
      pieces_justificatives: [...prev.pieces_justificatives, ...uploadedFiles]
    }));
  };

  const handleFileRemove = (fileId) => {
    setFormData(prev => ({
      ...prev,
      pieces_justificatives: prev.pieces_justificatives.filter(file => file.id !== fileId)
    }));
  };

  const calculateTotal = () => {
    const lignesTotal = formData.lignes_achat.reduce((total, ligne) => {
      const quantite = parseFloat(ligne.quantite) || 0;
      const prix = parseFloat(ligne.prix_unitaire) || 0;
      return total + (quantite * prix);
    }, 0);

    const fournisseursTotal = formData.fournisseurs_supplementaires.reduce((total, fournisseur) => {
      return total + (parseFloat(fournisseur.montant) || 0);
    }, 0);

    return lignesTotal + fournisseursTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    
    // Convert numeric fields
    data.montant_ht = data.montant_ht ? parseFloat(data.montant_ht) : 0;
    data.montant_tva = data.montant_tva ? parseFloat(data.montant_tva) : 0;
    data.taux_tva = parseFloat(data.taux_tva);
    data.frais_livraison = data.frais_livraison ? parseFloat(data.frais_livraison) : 0;
    data.fournisseur_principal_id = data.fournisseur_principal_id ? parseInt(data.fournisseur_principal_id) : null;
    
    // Convert lignes achat
    data.lignes_achat = data.lignes_achat.map(ligne => ({
      ...ligne,
      produit_id: ligne.produit_id ? parseInt(ligne.produit_id) : null,
      quantite: parseInt(ligne.quantite) || 0,
      prix_unitaire: parseFloat(ligne.prix_unitaire) || 0,
      fournisseur_id: ligne.fournisseur_id ? parseInt(ligne.fournisseur_id) : null
    }));

    // Convert fournisseurs supplementaires
    data.fournisseurs_supplementaires = data.fournisseurs_supplementaires.map(fournisseur => ({
      ...fournisseur,
      fournisseur_id: fournisseur.fournisseur_id ? parseInt(fournisseur.fournisseur_id) : null,
      montant: parseFloat(fournisseur.montant) || 0
    }));

    // Convert pieces_justificatives to JSON string
    if (data.pieces_justificatives && Array.isArray(data.pieces_justificatives)) {
      data.pieces_justificatives = JSON.stringify(data.pieces_justificatives);
    }
    
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {item ? 'Modifier l\'achat' : 'Nouvel achat avancé'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fournisseur principal *
                </label>
                <Select
                  name="fournisseur_principal_id"
                  value={fournisseurOptions.find(option => option.value === formData.fournisseur_principal_id) || null}
                  onChange={(selectedOption) => {
                    setFormData(prev => ({
                      ...prev,
                      fournisseur_principal_id: selectedOption ? selectedOption.value : ''
                    }));
                  }}
                  options={fournisseurOptions}
                  placeholder="Sélectionner un fournisseur principal"
                  isClearable
                  isSearchable
                  styles={selectStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priorité
                </label>
                <Select
                  name="priorite"
                  value={{ value: formData.priorite, label: formData.priorite }}
                  onChange={(selectedOption) => {
                    setFormData(prev => ({
                      ...prev,
                      priorite: selectedOption ? selectedOption.value : ''
                    }));
                  }}
                  options={[
                    { value: 'Basse', label: 'Basse' },
                    { value: 'Normale', label: 'Normale' },
                    { value: 'Haute', label: 'Haute' },
                    { value: 'Urgente', label: 'Urgente' }
                  ]}
                  placeholder="Sélectionner une priorité"
                  isClearable
                  isSearchable
                  styles={selectStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date de livraison souhaitée
                </label>
                <input
                  type="date"
                  name="date_livraison_souhaitee"
                  value={formData.date_livraison_souhaitee}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Montant HT ($)
                </label>
                <input
                  type="number"
                  name="montant_ht"
                  value={formData.montant_ht}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  TVA ($)
                </label>
                <input
                  type="number"
                  name="montant_tva"
                  value={formData.montant_tva}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>
            </div>

            {/* Lignes d'achat */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Produits commandés
                </h4>
                <button
                  type="button"
                  onClick={addLigneAchat}
                  className="btn-outline text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Ajouter un produit
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.lignes_achat.map((ligne, index) => (
                  <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Produit {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLigneAchat(index)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                                         <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                             <div>
                         <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Produit
                           {ligne.produit_id && inventoryOptions.find(option => option.value === ligne.produit_id)?.prix_unitaire && (
                             <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
                               (prix: {inventoryOptions.find(option => option.value === ligne.produit_id)?.prix_unitaire}$)
                             </span>
                           )}
                         </label>
                         <Select
                           value={inventoryOptions.find(option => option.value === ligne.produit_id) || null}
                           onChange={(selectedOption) => {
                             updateLigneAchat(index, 'produit_id', selectedOption ? selectedOption.value : '');
                           }}
                           options={inventoryOptions}
                           placeholder="Sélectionner un produit"
                           isClearable
                           isSearchable
                           styles={selectStyles}
                         />
                       </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantité
                        </label>
                        <input
                          type="number"
                          value={ligne.quantite}
                          onChange={(e) => updateLigneAchat(index, 'quantite', e.target.value)}
                          min="1"
                          className="input text-sm"
                        />
                      </div>
                                             <div>
                         <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Prix unitaire ($)
                           {ligne.prix_auto && (
                             <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                               (auto)
                             </span>
                           )}
                         </label>
                         <div className="relative">
                           <input
                             type="number"
                             value={ligne.prix_unitaire}
                             onChange={(e) => {
                               updateLigneAchat(index, 'prix_unitaire', e.target.value);
                               // Marquer que l'utilisateur a modifié le prix
                               updateLigneAchat(index, 'prix_auto', false);
                             }}
                             min="0"
                             step="0.01"
                             className={`input text-sm ${ligne.prix_auto ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : ''}`}
                             placeholder="0.00"
                           />
                           {ligne.prix_auto && (
                             <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                               <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                               </svg>
                             </div>
                           )}
                           {ligne.produit_id && !ligne.prix_auto && (
                             <button
                               type="button"
                               onClick={() => {
                                 const selectedProduct = inventoryOptions.find(option => option.value === ligne.produit_id);
                                 if (selectedProduct && selectedProduct.prix_unitaire) {
                                   updateLigneAchat(index, 'prix_unitaire', selectedProduct.prix_unitaire);
                                   updateLigneAchat(index, 'prix_auto', true);
                                 }
                               }}
                               className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                               title="Récupérer le prix automatique"
                             >
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                               </svg>
                             </button>
                           )}
                         </div>
                       </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fournisseur
                        </label>
                        <Select
                          value={fournisseurOptions.find(option => option.value === ligne.fournisseur_id) || null}
                          onChange={(selectedOption) => {
                            updateLigneAchat(index, 'fournisseur_id', selectedOption ? selectedOption.value : '');
                          }}
                          options={fournisseurOptions}
                          placeholder="Fournisseur"
                          isClearable
                          isSearchable
                          styles={selectStyles}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Grammage (g)
                        </label>
                        <input
                          type="number"
                          value={ligne.grammage}
                          onChange={(e) => updateLigneAchat(index, 'grammage', e.target.value)}
                          min="0"
                          step="0.1"
                          className="input text-sm"
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Total ligne
                        </label>
                        <div className="input text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                          {((parseFloat(ligne.quantite) || 0) * (parseFloat(ligne.prix_unitaire) || 0)).toFixed(2)}$
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={ligne.description}
                        onChange={(e) => updateLigneAchat(index, 'description', e.target.value)}
                        rows="2"
                        className="input text-sm"
                        placeholder="Description du produit..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fournisseurs supplémentaires */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Fournisseurs supplémentaires
                </h4>
                <button
                  type="button"
                  onClick={addFournisseurSupplementaire}
                  className="btn-outline text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Ajouter un fournisseur
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.fournisseurs_supplementaires.map((fournisseur, index) => (
                  <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fournisseur supplémentaire {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFournisseurSupplementaire(index)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fournisseur
                        </label>
                        <Select
                          value={fournisseurOptions.find(option => option.value === fournisseur.fournisseur_id) || null}
                          onChange={(selectedOption) => {
                            updateFournisseurSupplementaire(index, 'fournisseur_id', selectedOption ? selectedOption.value : '');
                          }}
                          options={fournisseurOptions}
                          placeholder="Sélectionner un fournisseur"
                          isClearable
                          isSearchable
                          styles={selectStyles}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Montant ($)
                        </label>
                        <input
                          type="number"
                          value={fournisseur.montant}
                          onChange={(e) => updateFournisseurSupplementaire(index, 'montant', e.target.value)}
                          min="0"
                          step="0.01"
                          className="input text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Rôle
                        </label>
                        <input
                          type="text"
                          value={fournisseur.role}
                          onChange={(e) => updateFournisseurSupplementaire(index, 'role', e.target.value)}
                          className="input text-sm"
                          placeholder="Sous-traitant, Transporteur..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pièces justificatives */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Pièces justificatives
              </h4>
              
              <FileUploader
                onFilesUploaded={handleFilesUploaded}
                existingFiles={formData.pieces_justificatives}
                onFileRemove={handleFileRemove}
              />
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
                placeholder="Notes sur l'achat..."
              />
            </div>

            {/* Total calculé */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total estimé:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {calculateTotal().toFixed(2)}$
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {item ? 'Modifier' : 'Créer l\'achat'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AchatsAdvancedModal; 