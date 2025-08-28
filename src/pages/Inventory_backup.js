import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';
import Select from 'react-select';
import { 
  CubeIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TruckIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Inventory = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [achats, setAchats] = useState([]);
  const [mouvementsStock, setMouvementsStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [fournisseurOptions, setFournisseurOptions] = useState([]);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [filters, setFilters] = useState({
    categorie: '',
    statut: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const categories = [
    'Mobilier', 'Équipement', 'Linge', 'Produits', 
    'Électronique', 'Décoration', 'Autre'
  ];

  const statuses = [
    'Disponible', 'En rupture', 'En commande', 'Hors service'
  ];

  useEffect(() => {
    fetchData();
  }, [filters, activeTab, pagination.currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'inventory':
          await fetchInventory();
          break;
        case 'fournisseurs':
          await fetchFournisseurs();
          break;
        case 'achats':
          await fetchAchats();
          break;
        case 'mouvements':
          await fetchMouvementsStock();
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination when filters change or tab changes
  useEffect(() => {
    if (activeTab === 'fournisseurs') {
      setPagination(prev => ({
        ...prev,
        currentPage: 1
      }));
      // Trigger data fetch when filters change with loading state
      setPageLoading(true);
      setTimeout(() => fetchFournisseurs(), 0);
    }
  }, [filters.search, filters.statut, activeTab]);

  // Reset pagination when changing tabs
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }));
  }, [activeTab]);

  // Auto-fetch data when pagination changes for fournisseurs
  useEffect(() => {
    if (activeTab === 'fournisseurs' && pagination.totalItems > 0) {
      // Add a small delay to avoid multiple rapid calls
      const timeoutId = setTimeout(() => {
        fetchFournisseurs();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pagination.currentPage, pagination.itemsPerPage]);

  // Initial data fetch for fournisseurs tab
  useEffect(() => {
    if (activeTab === 'fournisseurs' && pagination.totalItems === 0) {
      fetchFournisseurs();
    }
  }, [activeTab]);

  // Load options for select components
  useEffect(() => {
    loadFournisseurOptions();
    loadInventoryOptions();
  }, []);

  const loadFournisseurOptions = async () => {
    try {
      const response = await api.get('/fournisseurs?limit=1000');
      const options = response.data.fournisseurs.map(fournisseur => ({
        value: fournisseur.id,
        label: `${fournisseur.nom}${fournisseur.ville ? ` - ${fournisseur.ville}` : ''}`
      }));
      setFournisseurOptions(options);
    } catch (error) {
      console.error('Error loading fournisseur options:', error);
    }
  };

  const loadInventoryOptions = async () => {
    try {
      const response = await api.get('/inventaire?limit=1000');
      const options = response.data.data.map(item => ({
        value: item.id,
        label: `${item.nom}${item.categorie ? ` (${item.categorie})` : ''}`
      }));
      setInventoryOptions(options);
    } catch (error) {
      console.error('Error loading inventory options:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/inventaire?${params}`);
      setInventory(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Erreur lors du chargement de l\'inventaire');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      switch (activeTab) {
        case 'inventory':
          if (editingItem) {
            await api.put(`/inventaire/${editingItem.id}`, formData);
            toast.success('Article mis à jour avec succès');
          } else {
            await api.post('/inventaire', formData);
            toast.success('Article créé avec succès');
          }
          fetchInventory();
          break;
        case 'fournisseurs':
          if (editingItem) {
            await api.put(`/fournisseurs/${editingItem.id}`, formData);
            toast.success('Fournisseur mis à jour avec succès');
          } else {
            await api.post('/fournisseurs', formData);
            toast.success('Fournisseur créé avec succès');
          }
          fetchFournisseurs();
          break;
        case 'achats':
          if (editingItem) {
            await api.put(`/achats/${editingItem.id}`, formData);
            toast.success('Achat mis à jour avec succès');
          } else {
            await api.post('/achats', formData);
            toast.success('Achat créé avec succès');
          }
          fetchAchats();
          break;
        case 'mouvements':
          if (editingItem) {
            await api.put(`/mouvements-stock/${editingItem.id}`, formData);
            toast.success('Mouvement mis à jour avec succès');
          } else {
            await api.post('/mouvements-stock', formData);
            toast.success('Mouvement créé avec succès');
          }
          fetchMouvementsStock();
          break;
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const fetchFournisseurs = async () => {
    try {
      setPageLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.statut) params.append('statut', filters.statut);
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.itemsPerPage);

      console.log('Fetching fournisseurs with params:', params.toString());
      const response = await api.get(`/fournisseurs?${params}`);
      console.log('Fournisseurs API response:', response.data);
      
      setFournisseurs(response.data.fournisseurs || []);
      
      // Update pagination info
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages || 1,
        totalItems: response.data.totalItems || 0,
        currentPage: response.data.currentPage || 1
      }));
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Erreur lors du chargement des fournisseurs');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchAchats = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.statut) params.append('statut', filters.statut);

      const response = await api.get(`/achats?${params}`);
      setAchats(response.data.achats || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Erreur lors du chargement des achats');
    }
  };

  const fetchMouvementsStock = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.statut) params.append('statut', filters.statut);

      const response = await api.get(`/mouvements-stock?${params}`);
      setMouvementsStock(response.data.mouvements || []);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      toast.error('Erreur lors du chargement des mouvements de stock');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }

    try {
      switch (activeTab) {
        case 'inventory':
          await api.delete(`/inventaire/${id}`);
          toast.success('Article supprimé avec succès');
          fetchInventory();
          break;
        case 'fournisseurs':
          await api.delete(`/fournisseurs/${id}`);
          toast.success('Fournisseur supprimé avec succès');
          fetchFournisseurs();
          break;
        case 'achats':
          await api.delete(`/achats/${id}`);
          toast.success('Achat supprimé avec succès');
          fetchAchats();
          break;
        case 'mouvements':
          await api.delete(`/mouvements-stock/${id}`);
          toast.success('Mouvement supprimé avec succès');
          fetchMouvementsStock();
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage === pagination.currentPage) return;
    
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
    
    // Trigger data fetch for fournisseurs tab
    if (activeTab === 'fournisseurs') {
      // Set loading state immediately for better UX
      setPageLoading(true);
      setTimeout(() => fetchFournisseurs(), 0);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    if (newItemsPerPage === pagination.itemsPerPage) return;
    
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Reset to first page when changing items per page
      itemsPerPage: newItemsPerPage
    }));
    
    // Trigger data fetch for fournisseurs tab
    if (activeTab === 'fournisseurs') {
      // Set loading state immediately for better UX
      setPageLoading(true);
      setTimeout(() => fetchFournisseurs(), 0);
    }
  };

  const handleApproveAchat = async (id) => {
    try {
      await api.post(`/achats/${id}/approve`);
      toast.success('Achat approuvé avec succès');
      fetchAchats();
    } catch (error) {
      console.error('Error approving purchase:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const getStockStatusColor = (item) => {
    if (item.quantite === 0) return 'text-red-600 bg-red-100';
    if (item.quantite <= item.quantite_min) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Mobilier': 'bg-purple-100 text-purple-800',
      'Équipement': 'bg-blue-100 text-blue-800',
      'Linge': 'bg-green-100 text-green-800',
      'Produits': 'bg-yellow-100 text-yellow-800',
      'Électronique': 'bg-indigo-100 text-indigo-800',
      'Décoration': 'bg-pink-100 text-pink-800',
      'Autre': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Autre'];
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#f59e0b' : '#d1d5db',
      borderWidth: '1px',
      borderRadius: '0.5rem',
      boxShadow: state.isFocused ? '0 0 0 1px #f59e0b' : 'none',
      '&:hover': {
        borderColor: '#f59e0b'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#f59e0b' : state.isFocused ? '#fef3c7' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#f59e0b' : '#fef3c7'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    })
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Generic Modal Component
  const GenericModal = ({ 
    type, 
    item, 
    onClose, 
    onSubmit, 
    selectStyles = {}, 
    fournisseurOptions = [], 
    inventoryOptions = [] 
  }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
      // Initialize form data based on type and item
      switch (type) {
        case 'inventory':
          setFormData({
            nom: item?.nom || '',
            description: item?.description || '',
            categorie: item?.categorie || 'Autre',
            quantite: item?.quantite || 0,
            quantite_min: item?.quantite_min || 0,
            unite: item?.unite || 'pièce',
            prix_unitaire: item?.prix_unitaire || '',
            fournisseur: item?.fournisseur || '',
            numero_reference: item?.numero_reference || '',
            emplacement: item?.emplacement || '',
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

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const data = { ...formData };
      
      // Convert numeric fields
      if (type === 'inventory') {
        data.prix_unitaire = data.prix_unitaire ? parseFloat(data.prix_unitaire) : null;
        data.quantite = parseInt(data.quantite);
        data.quantite_min = parseInt(data.quantite_min);
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
        <div className="grid grid-cols-2 gap-4">
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
                  categorie: selectedOption ? selectedOption.value : ''
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
        <div className="grid grid-cols-3 gap-4">
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
              Quantité min *
            </label>
            <input
              type="number"
              name="quantite_min"
              value={formData.quantite_min}
              onChange={handleChange}
              min="0"
              required
              className="input"
            />
          </div>
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
              Fournisseur
            </label>
            <input
              type="text"
              name="fournisseur"
              value={formData.fournisseur}
              onChange={handleChange}
              className="input"
            />
          </div>
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
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {getModalTitle()}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderForm()}
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
                  {item ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de l'Inventaire & Achats
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez le stock, les fournisseurs, achats et mouvements
          </p>
        </div>
        {hasPermission('Superviseur') && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            {activeTab === 'inventory' && 'Ajouter un article'}
            {activeTab === 'fournisseurs' && 'Ajouter un fournisseur'}
            {activeTab === 'achats' && 'Nouvel achat'}
            {activeTab === 'mouvements' && 'Nouveau mouvement'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <CubeIcon className="w-5 h-5 inline mr-2" />
            Inventaire
          </button>
          <button
            onClick={() => setActiveTab('fournisseurs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fournisseurs'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BuildingStorefrontIcon className="w-5 h-5 inline mr-2" />
            Fournisseurs
          </button>
          <button
            onClick={() => setActiveTab('achats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'achats'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
            Achats
          </button>
          <button
            onClick={() => setActiveTab('mouvements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mouvements'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <TruckIcon className="w-5 h-5 inline mr-2" />
            Mouvements
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recherche
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                value={filters.categorie}
                onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                className="input"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                className="input"
              >
                <option value="">Tous les statuts</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ categorie: '', statut: '', search: '' })}
                className="btn-outline w-full"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'inventory' && (
        <div className="card">
          <div className="card-body">
            {inventory.length === 0 ? (
              <div className="text-center py-8">
                <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Commencez par ajouter des articles à l'inventaire
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.nom}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.categorie)}`}>
                            {item.categorie}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {item.quantite} {item.unite}
                          </div>
                          <div className={`text-xs ${getStockStatusColor(item)} px-2 py-1 rounded-full inline-block`}>
                            {item.quantite === 0 ? 'Rupture' : 
                             item.quantite <= item.quantite_min ? 'Stock faible' : 'OK'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.prix_unitaire ? `${item.prix_unitaire}$` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.statut === 'Disponible' ? 'bg-green-100 text-green-800' :
                            item.statut === 'En rupture' ? 'bg-red-100 text-red-800' :
                            item.statut === 'En commande' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {hasPermission('Superviseur') && (
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setShowModal(true);
                                }}
                                className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission('Administrateur') && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'fournisseurs' && (
        <div className="card">
          <div className="card-body">
            {/* Stats Summary */}
            {!pageLoading && fournisseurs.length > 0 && pagination.totalItems > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {pagination.totalItems}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total fournisseurs
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {fournisseurs.filter(f => f.statut === 'Actif').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Fournisseurs actifs
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {fournisseurs.filter(f => f.evaluation >= 4).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Bien évalués (4+)
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {pagination.totalPages}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Pages totales
                    </div>
                  </div>
                </div>
              </div>
            )}
            {pageLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement des fournisseurs...</span>
              </div>
            ) : fournisseurs.length === 0 && pagination.totalItems === 0 ? (
              <div className="text-center py-8">
                <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun fournisseur trouvé
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Commencez par ajouter des fournisseurs
                </p>
              </div>
            ) : fournisseurs.length === 0 && pagination.totalItems > 0 ? (
              <div className="text-center py-8">
                <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun fournisseur sur cette page
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Essayez de changer de page ou de modifier les filtres
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fournisseur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Évaluation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {pageLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12">
                          <div className="flex items-center justify-center">
                            <LoadingSpinner size="md" />
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      fournisseurs.map((fournisseur) => (
                        <tr key={fournisseur.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {fournisseur.nom}
                              </div>
                              {fournisseur.ville && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {fournisseur.ville}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {fournisseur.contact_principal || fournisseur.email}
                            </div>
                            {fournisseur.telephone && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {fournisseur.telephone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(fournisseur.categorie_principale)}`}>
                              {fournisseur.categorie_principale || 'Autre'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {fournisseur.evaluation ? (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < fournisseur.evaluation ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              fournisseur.statut === 'Actif' ? 'bg-green-100 text-green-800' :
                              fournisseur.statut === 'Inactif' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {fournisseur.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {hasPermission('Superviseur') && (
                                <button
                                  onClick={() => {
                                    setEditingItem(fournisseur);
                                    setShowModal(true);
                                  }}
                                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission('Administrateur') && (
                                <button
                                  onClick={() => handleDelete(fournisseur.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination for Fournisseurs */}
            {activeTab === 'fournisseurs' && pagination.totalItems > 0 && fournisseurs.length > 0 && (
              <div className="mt-6">
                {!pageLoading && (
                  <>
                    {/* Progress Bar */}
                    {pagination.totalPages > 1 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Progression</span>
                          <span>{Math.round((pagination.currentPage / pagination.totalPages) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${(pagination.currentPage / pagination.totalPages) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                      onPageChange={handlePageChange}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'achats' && (
        <div className="card">
          <div className="card-body">
            {achats.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun achat trouvé
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Commencez par créer des achats
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fournisseur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {achats.map((achat) => (
                      <tr key={achat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {achat.numero_commande}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(achat.date_creation).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {achat.fournisseur?.nom || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {achat.montant_total ? `${achat.montant_total}$` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            achat.statut === 'Réceptionnée' ? 'bg-green-100 text-green-800' :
                            achat.statut === 'Commandée' ? 'bg-blue-100 text-blue-800' :
                            achat.statut === 'Approuvée' ? 'bg-purple-100 text-purple-800' :
                            achat.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                            achat.statut === 'Annulée' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {achat.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            achat.priorite === 'Urgente' ? 'bg-red-100 text-red-800' :
                            achat.priorite === 'Haute' ? 'bg-orange-100 text-orange-800' :
                            achat.priorite === 'Normale' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {achat.priorite}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(achat);
                                setShowModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            {hasPermission('Superviseur') && achat.statut === 'En attente' && (
                              <button
                                onClick={() => handleApproveAchat(achat.id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                ✓
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'mouvements' && (
        <div className="card">
          <div className="card-body">
            {mouvementsStock.length === 0 ? (
              <div className="text-center py-8">
                <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun mouvement trouvé
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Commencez par créer des mouvements de stock
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {mouvementsStock.map((mouvement) => (
                      <tr key={mouvement.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {mouvement.inventaire?.nom || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            mouvement.type_mouvement === 'Entrée' ? 'bg-green-100 text-green-800' :
                            mouvement.type_mouvement === 'Sortie' ? 'bg-red-100 text-red-800' :
                            mouvement.type_mouvement === 'Ajustement' ? 'bg-blue-100 text-blue-800' :
                            mouvement.type_mouvement === 'Transfert' ? 'bg-purple-100 text-purple-800' :
                            mouvement.type_mouvement === 'Perte' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {mouvement.type_mouvement}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {mouvement.quantite}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {mouvement.quantite_avant} → {mouvement.quantite_apres}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {mouvement.utilisateur?.nom} {mouvement.utilisateur?.prenom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(mouvement.date_mouvement).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(mouvement);
                                setShowModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <PencilIcon className="w-4 h-4" />
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
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <GenericModal
          type={activeTab}
          item={editingItem}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
          selectStyles={selectStyles}
          fournisseurOptions={fournisseurOptions}
          inventoryOptions={inventoryOptions}
        />
      )}
    </div>
  );
};

// Generic Modal Component
const GenericModal = ({ 
  type, 
  item, 
  onClose, 
  onSubmit, 
  selectStyles = {}, 
  fournisseurOptions = [], 
  inventoryOptions = [] 
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Initialize form data based on type and item
    switch (type) {
      case 'inventory':
        setFormData({
          nom: item?.nom || '',
          description: item?.description || '',
          categorie: item?.categorie || 'Autre',
          quantite: item?.quantite || 0,
          quantite_min: item?.quantite_min || 0,
          unite: item?.unite || 'pièce',
          prix_unitaire: item?.prix_unitaire || '',
          fournisseur: item?.fournisseur || '',
          numero_reference: item?.numero_reference || '',
          emplacement: item?.emplacement || '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    
    // Convert numeric fields
    if (type === 'inventory') {
      data.prix_unitaire = data.prix_unitaire ? parseFloat(data.prix_unitaire) : null;
      data.quantite = parseInt(data.quantite);
      data.quantite_min = parseInt(data.quantite_min);
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
      <div className="grid grid-cols-2 gap-4">
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
                categorie: selectedOption ? selectedOption.value : ''
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
      <div className="grid grid-cols-3 gap-4">
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
            Quantité min *
          </label>
          <input
            type="number"
            name="quantite_min"
            value={formData.quantite_min}
            onChange={handleChange}
            min="0"
            required
            className="input"
          />
        </div>
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
            Fournisseur
          </label>
          <input
            type="text"
            name="fournisseur"
            value={formData.fournisseur}
            onChange={handleChange}
            className="input"
          />
        </div>
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
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {getModalTitle()}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderForm()}
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
                {item ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inventory; 