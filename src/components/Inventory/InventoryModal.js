import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '../../services/api';
import QRCode from 'qrcode';

const InventoryModal = ({ 
  type, 
  item, 
  onClose, 
  onSubmit, 
  selectStyles = {}, 
  fournisseurOptions = [], 
  inventoryOptions = [] 
}) => {
  const [formData, setFormData] = useState({});
  const [entrepots, setEntrepots] = useState([]);
  const [loadingEntrepots, setLoadingEntrepots] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState('');

  useEffect(() => {
    // Initialize form data based on type and item
    switch (type) {
      case 'inventory':
        setFormData({
          nom: item?.nom || '',
          description: item?.description || '',
          code_produit: item?.code_produit || '',
          qr_code_article: item?.qr_code_article || '',
          categorie: item?.categorie || 'Autre',
          sous_categorie: item?.sous_categorie || '',
          nature: item?.nature || 'Autre',
          quantite: item?.quantite || 0,
          quantite_min: item?.quantite_min || 0,
          unite: item?.unite || 'pièce',
          prix_unitaire: item?.prix_unitaire || '',
          fournisseur: item?.fournisseur || '',
          numero_reference: item?.numero_reference || '',
          emplacement: item?.emplacement || '',
          emplacement_id: item?.emplacement_id || '',
          statut: item?.statut || 'Disponible',
          notes: item?.notes || ''
        });
        break;
      case 'fournisseurs':
        setFormData({
          nom: item?.nom || '',
          email: item?.email || '',
          telephone: item?.telephone || '',
          adresse: item?.adresse || '',
          ville: item?.ville || '',
          code_postal: item?.code_postal || '',
          pays: item?.pays || 'France',
          contact_principal: item?.contact_principal || '',
          telephone_contact: item?.telephone_contact || '',
          email_contact: item?.email_contact || '',
          categorie_principale: item?.categorie_principale || 'Autre',
          evaluation: item?.evaluation || '',
          statut: item?.statut || 'Actif',
          notes: item?.notes || ''
        });
        break;
      case 'achats':
        setFormData({
          fournisseur_id: item?.fournisseur_id || '',
          priorite: item?.priorite || 'Normale',
          date_livraison_souhaitee: item?.date_livraison_souhaitee || '',
          montant_ht: item?.montant_ht || '',
          montant_tva: item?.montant_tva || '',
          taux_tva: item?.taux_tva || 20,
          frais_livraison: item?.frais_livraison || '',
          adresse_livraison: item?.adresse_livraison || '',
          notes: item?.notes || ''
        });
        break;
      case 'mouvements':
        setFormData({
          inventaire_id: item?.inventaire_id || '',
          type_mouvement: item?.type_mouvement || 'Entrée',
          quantite: item?.quantite || 1,
          prix_unitaire: item?.prix_unitaire || '',
          motif: item?.motif || '',
          chambre_id: item?.chambre_id || '',
          emplacement_source: item?.emplacement_source || '',
          emplacement_destination: item?.emplacement_destination || '',
          notes: item?.notes || ''
        });
        break;
    }
  }, [type, item]);

  // Charger les entrepôts pour le formulaire d'inventaire
  useEffect(() => {
    if (type === 'inventory') {
      fetchEntrepots();
    }
  }, [type]);

  // Générer le QR code quand le composant se charge avec un item existant
  useEffect(() => {
    if (type === 'inventory' && item?.qr_code_article) {
      generateQRCodeImage(item.qr_code_article);
    }
  }, [type, item]);

  // Fonction pour générer l'image du QR code à partir d'un texte
  const generateQRCodeImage = async (text) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeImage(qrCodeDataURL);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image du QR code:', error);
    }
  };

  // Fonction pour télécharger le QR code
  const downloadQRCode = () => {
    if (qrCodeImage && formData.qr_code_article) {
      const link = document.createElement('a');
      link.download = `QR-${formData.qr_code_article}.png`;
      link.href = qrCodeImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchEntrepots = async () => {
    try {
      setLoadingEntrepots(true);
      const response = await api.get('/entrepots');
      setEntrepots(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des entrepôts:', error);
    } finally {
      setLoadingEntrepots(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const qrCode = `QR-${timestamp}-${random}`;
      
      // Générer l'image du QR code
      const qrCodeDataURL = await QRCode.toDataURL(qrCode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setFormData(prev => ({
        ...prev,
        qr_code_article: qrCode
      }));
      
      setQrCodeImage(qrCodeDataURL);
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
    }
  };

  const generateCodeProduit = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const codeProduit = `PROD-${timestamp}-${random}`;
    setFormData(prev => ({
      ...prev,
      code_produit: codeProduit
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Générer automatiquement l'image du QR code quand le champ change
    if (name === 'qr_code_article' && value) {
      generateQRCodeImage(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    
    // Convert numeric fields
    if (type === 'inventory') {
      data.prix_unitaire = data.prix_unitaire ? parseFloat(data.prix_unitaire) : null;
      data.quantite = parseInt(data.quantite);
      data.quantite_min = parseInt(data.quantite_min);
      // Handle emplacement_id - convert empty string to null
      data.emplacement_id = data.emplacement_id && data.emplacement_id !== '' ? parseInt(data.emplacement_id) : null;
      // Ensure required fields have valid values
      data.unite = data.unite || 'pièce';
      data.statut = data.statut || 'Disponible';
      data.categorie = data.categorie || 'Autre';
      data.nature = data.nature || 'Autre';
    } else if (type === 'fournisseurs') {
      data.evaluation = data.evaluation ? parseInt(data.evaluation) : null;
    } else if (type === 'achats') {
      data.montant_ht = data.montant_ht ? parseFloat(data.montant_ht) : 0;
      data.montant_tva = data.montant_tva ? parseFloat(data.montant_tva) : 0;
      data.taux_tva = parseFloat(data.taux_tva);
      data.frais_livraison = data.frais_livraison ? parseFloat(data.frais_livraison) : 0;
    } else if (type === 'mouvements') {
      data.quantite = parseInt(data.quantite);
      data.prix_unitaire = data.prix_unitaire ? parseFloat(data.prix_unitaire) : null;
      data.inventaire_id = data.inventaire_id ? parseInt(data.inventaire_id) : null;
      data.chambre_id = data.chambre_id ? parseInt(data.chambre_id) : null;
    }
    
    onSubmit(data);
  };

  const getModalTitle = () => {
    const titles = {
      inventory: item ? 'Modifier l\'article' : 'Ajouter un article',
      fournisseurs: item ? 'Modifier le fournisseur' : 'Ajouter un fournisseur',
      achats: item ? 'Modifier l\'achat' : 'Nouvel achat',
      mouvements: item ? 'Modifier le mouvement' : 'Nouveau mouvement'
    };
    return titles[type] || 'Modifier';
  };

  // Options pour les sous-catégories selon la catégorie principale
  const getSousCategories = (categorie) => {
    const sousCategories = {
      'Mobilier': [
        'Chaises',
        'Tables',
        'Lits',
        'Armoires',
        'Canapés',
        'Bureau',
        'Étagères',
        'Autre'
      ],
      'Équipement': [
        'Équipement de cuisine',
        'Équipement de nettoyage',
        'Équipement de sécurité',
        'Équipement technique',
        'Équipement de maintenance',
        'Autre'
      ],
      'Linge': [
        'Draps',
        'Serviettes',
        'Nappes',
        'Couvre-lits',
        'Rideaux',
        'Tapis',
        'Autre'
      ],
      'Produits': [
        'Produits d\'entretien',
        'Produits de toilette',
        'Produits alimentaires',
        'Produits de sécurité',
        'Autre'
      ],
      'Électronique': [
        'Télévisions',
        'Ordinateurs',
        'Téléphones',
        'Systèmes audio',
        'Éclairage',
        'Autre'
      ],
      'Décoration': [
        'Tableaux',
        'Vases',
        'Coussins',
        'Miroirs',
        'Plantes',
        'Autre'
      ],
      'Autre': [
        'Divers',
        'Autre'
      ]
    };
    return sousCategories[categorie] || ['Autre'];
  };

  // Options pour la nature
  const natureOptions = [
    { value: 'Consommable', label: 'Consommable' },
    { value: 'Durable', label: 'Durable' },
    { value: 'Équipement', label: 'Équipement' },
    { value: 'Mobilier', label: 'Mobilier' },
    { value: 'Linge', label: 'Linge' },
    { value: 'Produit d\'entretien', label: 'Produit d\'entretien' },
    { value: 'Autre', label: 'Autre' }
  ];

  const renderInventoryForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom *
        </label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
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
        />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Code produit
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="code_produit"
              value={formData.code_produit}
              onChange={handleChange}
              className="input flex-1"
              placeholder="PROD-001"
            />
            <button
              type="button"
              onClick={generateCodeProduit}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Générer automatiquement"
            >
              🔄
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            QR Code Article
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="qr_code_article"
              value={formData.qr_code_article}
              onChange={handleChange}
              className="input flex-1"
              placeholder="QR-CODE-123456"
            />
            <button
              type="button"
              onClick={generateQRCode}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Générer automatiquement"
            >
              🔄
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prix unitaire
          </label>
          <input
            type="number"
            name="prix_unitaire"
            value={formData.prix_unitaire}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="input"
            placeholder="0.00"
          />
        </div>
      </div>
      
      {/* Affichage de l'image du QR code en dessous */}
      {qrCodeImage && (
        <div className="flex justify-center">
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <img 
              src={qrCodeImage} 
              alt="QR Code" 
              className="border border-gray-300 rounded-lg shadow-sm"
              style={{ width: '180px', height: '180px' }}
            />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 font-mono">
              {formData.qr_code_article}
            </p>
            <button
              type="button"
              onClick={downloadQRCode}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              title="Télécharger le QR code"
            >
              📥 Télécharger le QR Code
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie *
          </label>
          <Select
            name="categorie"
            value={{ value: formData.categorie, label: formData.categorie }}
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                categorie: selectedOption ? selectedOption.value : '',
                sous_categorie: '' // Reset sous-catégorie when changing category
              }));
            }}
            options={[
              { value: 'Mobilier', label: 'Mobilier' },
              { value: 'Équipement', label: 'Équipement' },
              { value: 'Linge', label: 'Linge' },
              { value: 'Produits', label: 'Produits' },
              { value: 'Électronique', label: 'Électronique' },
              { value: 'Décoration', label: 'Décoration' },
              { value: 'Autre', label: 'Autre' }
            ]}
            placeholder="Sélectionner une catégorie"
            isClearable
            isSearchable
            styles={selectStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sous-catégorie
          </label>
          <Select
            name="sous_categorie"
            value={{ value: formData.sous_categorie, label: formData.sous_categorie }}
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                sous_categorie: selectedOption ? selectedOption.value : ''
              }));
            }}
            options={getSousCategories(formData.categorie).map(option => ({
              value: option,
              label: option
            }))}
            placeholder="Sélectionner une sous-catégorie"
            isClearable
            isSearchable
            styles={selectStyles}
            isDisabled={!formData.categorie}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nature
          </label>
          <Select
            name="nature"
            value={{ value: formData.nature, label: formData.nature }}
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                nature: selectedOption ? selectedOption.value : ''
              }));
            }}
            options={natureOptions}
            placeholder="Sélectionner une nature"
            isClearable
            isSearchable
            styles={selectStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Statut *
          </label>
          <Select
            name="statut"
            value={{ value: formData.statut, label: formData.statut }}
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                statut: selectedOption ? selectedOption.value : ''
              }));
            }}
            options={[
              { value: 'Disponible', label: 'Disponible' },
              { value: 'En rupture', label: 'En rupture' },
              { value: 'En commande', label: 'En commande' },
              { value: 'Hors service', label: 'Hors service' }
            ]}
            placeholder="Sélectionner un statut"
            isClearable
            isSearchable
            styles={selectStyles}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unité
          </label>
          <input
            type="text"
            name="unite"
            value={formData.unite}
            onChange={handleChange}
            className="input"
            placeholder="pièce, kg, litre, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantité *
          </label>
          <input
            type="number"
            name="quantite"
            value={formData.quantite}
            onChange={handleChange}
            min="0"
            required
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantité min
          </label>
          <input
            type="number"
            name="quantite_min"
            value={formData.quantite_min}
            onChange={handleChange}
            min="0"
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prix unitaire
          </label>
          <input
            type="number"
            name="prix_unitaire"
            value={formData.prix_unitaire}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
            Numéro de référence
          </label>
          <input
            type="text"
            name="numero_reference"
            value={formData.numero_reference}
            onChange={handleChange}
            className="input"
            placeholder="REF-001"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Emplacement (texte libre)
          </label>
          <input
            type="text"
            name="emplacement"
            value={formData.emplacement}
            onChange={handleChange}
            className="input"
            placeholder="Entrepôt A, Rayon 3, Chambre 101"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Entrepôt de stockage
          </label>
          <Select
            name="emplacement_id"
            value={entrepots.find(e => e.id === formData.emplacement_id) ? 
              { value: formData.emplacement_id, label: entrepots.find(e => e.id === formData.emplacement_id)?.nom } : 
              null
            }
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                emplacement_id: selectedOption ? selectedOption.value : null
              }));
            }}
            options={entrepots.map(entrepot => ({
              value: entrepot.id,
              label: entrepot.nom
            }))}
            placeholder="Sélectionner un entrepôt"
            isClearable
            isSearchable
            styles={selectStyles}
            isLoading={loadingEntrepots}
            noOptionsMessage={() => "Aucun entrepôt disponible"}
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
          rows="3"
          className="input"
          placeholder="Informations supplémentaires..."
        />
      </div>
    </div>
  );

  const renderFournisseurForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom *
        </label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Téléphone
          </label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Adresse
        </label>
        <textarea
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          rows="2"
          className="input"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ville
          </label>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Code postal
          </label>
          <input
            type="text"
            name="code_postal"
            value={formData.code_postal}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pays
          </label>
          <input
            type="text"
            name="pays"
            value={formData.pays}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie principale
          </label>
          <Select
            name="categorie_principale"
            value={{ value: formData.categorie_principale, label: formData.categorie_principale }}
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                categorie_principale: selectedOption ? selectedOption.value : ''
              }));
            }}
            options={[
              { value: 'Mobilier', label: 'Mobilier' },
              { value: 'Équipement', label: 'Équipement' },
              { value: 'Linge', label: 'Linge' },
              { value: 'Produits', label: 'Produits' },
              { value: 'Électronique', label: 'Électronique' },
              { value: 'Décoration', label: 'Décoration' },
              { value: 'Services', label: 'Services' },
              { value: 'Autre', label: 'Autre' }
            ]}
            placeholder="Sélectionner une catégorie"
            isClearable
            isSearchable
            styles={selectStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Évaluation (1-5)
          </label>
          <Select
            name="evaluation"
            value={formData.evaluation ? { value: formData.evaluation, label: `${formData.evaluation} étoile${formData.evaluation > 1 ? 's' : ''}` } : null}
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                evaluation: selectedOption ? selectedOption.value : ''
              }));
            }}
            options={[
              { value: 1, label: '1 étoile' },
              { value: 2, label: '2 étoiles' },
              { value: 3, label: '3 étoiles' },
              { value: 4, label: '4 étoiles' },
              { value: 5, label: '5 étoiles' }
            ]}
            placeholder="Non évalué"
            isClearable
            isSearchable
            styles={selectStyles}
          />
        </div>
      </div>
    </div>
  );

  const renderAchatForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fournisseur *
        </label>
        <Select
          name="fournisseur_id"
          value={fournisseurOptions.find(option => option.value === formData.fournisseur_id) || null}
          onChange={(selectedOption) => {
            setFormData(prev => ({
              ...prev,
              fournisseur_id: selectedOption ? selectedOption.value : ''
            }));
          }}
          options={fournisseurOptions}
          placeholder="Sélectionner un fournisseur"
          isClearable
          isSearchable
          styles={selectStyles}
          noOptionsMessage={() => "Aucun fournisseur trouvé"}
          loadingMessage={() => "Chargement..."}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <div className="grid grid-cols-3 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Taux TVA (%)
          </label>
          <input
            type="number"
            name="taux_tva"
            value={formData.taux_tva}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            className="input"
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
          rows="3"
          className="input"
        />
      </div>
    </div>
  );

  const renderMouvementForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Article *
        </label>
        <Select
          name="inventaire_id"
          value={inventoryOptions.find(option => option.value === formData.inventaire_id) || null}
          onChange={(selectedOption) => {
            setFormData(prev => ({
              ...prev,
              inventaire_id: selectedOption ? selectedOption.value : ''
            }));
          }}
          options={inventoryOptions}
          placeholder="Sélectionner un article"
          isClearable
          isSearchable
          styles={selectStyles}
          noOptionsMessage={() => "Aucun article trouvé"}
          loadingMessage={() => "Chargement..."}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type de mouvement *
          </label>
          <Select
            name="type_mouvement"
            value={{ value: formData.type_mouvement, label: formData.type_mouvement }}
            onChange={(selectedOption) => {
              setFormData(prev => ({
                ...prev,
                type_mouvement: selectedOption ? selectedOption.value : ''
              }));
            }}
            options={[
              { value: 'Entrée', label: 'Entrée' },
              { value: 'Sortie', label: 'Sortie' },
              { value: 'Ajustement', label: 'Ajustement' },
              { value: 'Transfert', label: 'Transfert' },
              { value: 'Perte', label: 'Perte' },
              { value: 'Retour', label: 'Retour' }
            ]}
            placeholder="Sélectionner un type"
            isClearable
            isSearchable
            styles={selectStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantité *
          </label>
          <input
            type="number"
            name="quantite"
            value={formData.quantite}
            onChange={handleChange}
            min="1"
            required
            className="input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prix unitaire ($)
          </label>
          <input
            type="number"
            name="prix_unitaire"
            value={formData.prix_unitaire}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chambre
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Emplacement source
          </label>
          <input
            type="text"
            name="emplacement_source"
            value={formData.emplacement_source}
            onChange={handleChange}
            className="input"
            placeholder="Entrepôt, chambre, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Emplacement destination
          </label>
          <input
            type="text"
            name="emplacement_destination"
            value={formData.emplacement_destination}
            onChange={handleChange}
            className="input"
            placeholder="Entrepôt, chambre, etc."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Référence document
          </label>
          <input
            type="text"
            name="reference_document"
            value={formData.reference_document}
            onChange={handleChange}
            className="input"
            placeholder="Facture, bon de livraison, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Numéro document
          </label>
          <input
            type="text"
            name="numero_document"
            value={formData.numero_document}
            onChange={handleChange}
            className="input"
            placeholder="BL-001, FACT-2024-001, etc."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Motif
        </label>
        <input
          type="text"
          name="motif"
          value={formData.motif}
          onChange={handleChange}
          className="input"
          placeholder="Raison du mouvement"
        />
      </div>
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
          placeholder="Informations supplémentaires..."
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (type) {
      case 'inventory':
        return renderInventoryForm();
      case 'fournisseurs':
        return renderFournisseurForm();
      case 'achats':
        return renderAchatForm();
      case 'mouvements':
        return renderMouvementForm();
      default:
        return <div>Formulaire non disponible</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
            {getModalTitle()}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                {item ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal; 