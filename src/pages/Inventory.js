import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/outline';

// Import des nouveaux composants
import InventoryTabs from '../components/Inventory/InventoryTabs';
import InventoryFilters from '../components/Inventory/InventoryFilters';
import InventoryTable from '../components/Inventory/InventoryTable';
import FournisseursTable from '../components/Inventory/FournisseursTable';
import AchatsTable from '../components/Inventory/AchatsTable';
import AchatsAdvancedTable from '../components/Inventory/AchatsAdvancedTable';
import MouvementsTable from '../components/Inventory/MouvementsTable';
import EntrepotsTable from '../components/Inventory/EntrepotsTable';
import StockTable from '../components/Inventory/StockTable';
import InventoryModal from '../components/Inventory/InventoryModal';
import AchatsAdvancedModal from '../components/Inventory/AchatsAdvancedModal';
import EntrepotsModal from '../components/Inventory/EntrepotsModal';

// Import des utilitaires
import { 
  getStockStatusColor, 
  getCategoryColor, 
  selectStyles, 
  categories, 
  statuses 
} from '../components/Inventory/inventoryUtils';

const Inventory = () => {
  const { user, hasPermission } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [achats, setAchats] = useState([]);
  const [mouvementsStock, setMouvementsStock] = useState([]);
  const [entrepots, setEntrepots] = useState([]);
  const [stockSummary, setStockSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [showEntrepotsModal, setShowEntrepotsModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [fournisseurOptions, setFournisseurOptions] = useState([]);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [useAdvancedAchats, setUseAdvancedAchats] = useState(true);
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

  // Optimized data fetching with debounced search
  useEffect(() => {
    // Only fetch on tab change or pagination change
    if (activeTab !== 'fournisseurs' && activeTab !== 'entrepots') {
      fetchData();
    }
  }, [activeTab, pagination.currentPage]);

  // Separate effect for fournisseurs with optimized search
  useEffect(() => {
    if (activeTab === 'fournisseurs') {
      fetchFournisseurs();
    }
  }, [activeTab, pagination.currentPage, pagination.itemsPerPage]);

  // Separate effect for entrepots with optimized search
  useEffect(() => {
    if (activeTab === 'entrepots') {
      fetchEntrepots();
    }
  }, [activeTab, pagination.currentPage, pagination.itemsPerPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'inventory':
          await fetchInventory();
          break;
        case 'stock':
          await fetchStockSummary();
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
        case 'entrepots':
          await fetchEntrepots();
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Optimized search function for AJAX
  const handleSearch = async (searchTerm) => {
    try {
      setPageLoading(true);
      
      // Reset pagination for search
      setPagination(prev => ({
        ...prev,
        currentPage: 1
      }));

      // Update filters
      setFilters(prev => ({
        ...prev,
        search: searchTerm
      }));

      // Fetch data based on active tab
      switch (activeTab) {
        case 'inventory':
          await fetchInventory();
          break;
        case 'stock':
          await fetchStockSummary();
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
        case 'entrepots':
          await fetchEntrepots();
          break;
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setPageLoading(false);
    }
  };

  // Reset pagination when changing tabs
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }));
  }, [activeTab]);

  // Handle filter changes (category/status) - immediate fetch
  const handleFilterChange = async (key, value) => {
    try {
      setPageLoading(true);
      
      // Update filters
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));

      // Reset pagination
      setPagination(prev => ({
        ...prev,
        currentPage: 1
      }));

      // Fetch data based on active tab
      switch (activeTab) {
        case 'inventory':
          await fetchInventory();
          break;
        case 'stock':
          await fetchStockSummary();
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
        case 'entrepots':
          await fetchEntrepots();
          break;
      }
    } catch (error) {
      console.error('Filter change error:', error);
      toast.error('Erreur lors du changement de filtre');
    } finally {
      setPageLoading(false);
    }
  };

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
        label: `${item.nom}${item.categorie ? ` (${item.categorie})` : ''}${item.prix_unitaire ? ` - ${item.prix_unitaire}$` : ''}`,
        prix_unitaire: item.prix_unitaire,
        nom: item.nom,
        categorie: item.categorie,
        unite: item.unite
      }));
      setInventoryOptions(options);
    } catch (error) {
      console.error('Error loading inventory options:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/inventaire?${params}`);
      setInventory(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Erreur lors du chargement de l\'inventaire');
    }
  };

  const fetchStockSummary = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/inventaire/stocks/summary?${params}`);
      setStockSummary(response.data.data || []);
    } catch (error) {
      console.error('Error fetching stock summary:', error);
      toast.error('Erreur lors du chargement du stock');
    }
  };

  const handleExportStockPDF = () => {
    try {
      const now = new Date();
      const timestamp = now.toLocaleString('fr-FR');
      const title = "Listing de stock";

      const rowsHtml = stockSummary.map(item => `
        <tr>
          <td>${item.nom || ''}</td>
          <td>${item.categorie || ''}</td>
          <td class="num">${item.stock_initial ?? 0}</td>
          <td class="num">${item.entrees ?? 0}</td>
          <td class="num">${item.sorties ?? 0}</td>
          <td class="num">${item.stock_final ?? 0}</td>
          <td>${item.unite || ''}</td>
        </tr>
      `).join('');

      const html = `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>${title} - ${timestamp}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 24px; }
          h1 { margin: 0 0 4px 0; font-size: 20px; }
          .meta { color: #6b7280; margin-bottom: 16px; font-size: 12px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
          th { background: #f9fafb; text-align: left; }
          td.num { text-align: right; }
          tfoot td { font-weight: bold; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Généré le ${timestamp}</div>
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Catégorie</th>
              <th>Stock initial</th>
              <th>Entrées</th>
              <th>Sorties</th>
              <th>Stock final</th>
              <th>Unité</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>`;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      // Delay print to ensure rendering
      setTimeout(() => {
        printWindow.print();
      }, 300);
    } catch (err) {
      console.error('Export PDF error:', err);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const fetchEntrepots = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.statut) params.append('statut', filters.statut);
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.itemsPerPage);

      const response = await api.get(`/entrepots?${params}`);
      
      setEntrepots(response.data.entrepots || []);
      
      // Update pagination info
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages || 1,
        totalItems: response.data.totalItems || 0,
        currentPage: response.data.currentPage || 1
      }));
    } catch (error) {
      console.error('Error fetching entrepots:', error);
      toast.error('Erreur lors du chargement des entrepôts');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      console.log('📤 Données envoyées à l\'API:', formData);
      
      switch (activeTab) {
        case 'inventory':
          if (editingItem) {
            await api.put(`/inventaire/${editingItem.id}`, formData);
            toast.success('Article mis à jour avec succès');
            
            // Notification pour la modification d'article
            addNotification({
              title: 'Article modifié',
              message: `L'article "${formData.nom || formData.designation}" a été modifié par ${user?.prenom} ${user?.nom}`,
              type: 'info',
              link: '/inventory'
            });
          } else {
            await api.post('/inventaire', formData);
            toast.success('Article créé avec succès');
            
            // Notification pour la création d'article
            addNotification({
              title: 'Nouvel article créé',
              message: `Un nouvel article "${formData.nom || formData.designation}" a été créé par ${user?.prenom} ${user?.nom}`,
              type: 'success',
              link: '/inventory'
            });
          }
          fetchInventory();
          break;
        case 'fournisseurs':
          if (editingItem) {
            await api.put(`/fournisseurs/${editingItem.id}`, formData);
            toast.success('Fournisseur mis à jour avec succès');
            
            // Notification pour la modification de fournisseur
            addNotification({
              title: 'Fournisseur modifié',
              message: `Le fournisseur "${formData.nom || formData.raison_sociale}" a été modifié par ${user?.prenom} ${user?.nom}`,
              type: 'info',
              link: '/inventory'
            });
          } else {
            await api.post('/fournisseurs', formData);
            toast.success('Fournisseur créé avec succès');
            
            // Notification pour la création de fournisseur
            addNotification({
              title: 'Nouveau fournisseur créé',
              message: `Un nouveau fournisseur "${formData.nom || formData.raison_sociale}" a été créé par ${user?.prenom} ${user?.nom}`,
              type: 'success',
              link: '/inventory'
            });
          }
          fetchFournisseurs();
          break;
        case 'achats':
          if (editingItem) {
            await api.put(`/achats/${editingItem.id}`, formData);
            toast.success('Achat mis à jour avec succès');
            
            // Notification pour la modification d'achat
            addNotification({
              title: 'Achat modifié',
              message: `L'achat "${formData.reference || formData.description}" a été modifié par ${user?.prenom} ${user?.nom}`,
              type: 'info',
              link: '/inventory'
            });
          } else {
            await api.post('/achats', formData);
            toast.success('Achat créé avec succès');
            
            // Notification pour la création d'achat
            addNotification({
              title: 'Nouvel achat créé',
              message: `Un nouvel achat "${formData.reference || formData.description}" a été créé par ${user?.prenom} ${user?.nom}`,
              type: 'success',
              link: '/inventory'
            });
          }
          fetchAchats();
          break;
        case 'mouvements':
          if (editingItem) {
            await api.put(`/mouvements-stock/${editingItem.id}`, formData);
            toast.success('Mouvement mis à jour avec succès');
            
            // Notification pour la modification de mouvement
            addNotification({
              title: 'Mouvement de stock modifié',
              message: `Le mouvement de stock "${formData.type || 'Mouvement'}" a été modifié par ${user?.prenom} ${user?.nom}`,
              type: 'info',
              link: '/inventory'
            });
          } else {
            await api.post('/mouvements-stock', formData);
            toast.success('Mouvement créé avec succès');
            
            // Notification pour la création de mouvement
            addNotification({
              title: 'Nouveau mouvement de stock',
              message: `Un nouveau mouvement de stock "${formData.type || 'Mouvement'}" a été créé par ${user?.prenom} ${user?.nom}`,
              type: 'success',
              link: '/inventory'
            });
          }
          fetchMouvementsStock();
          break;
        case 'entrepots':
          if (editingItem) {
            await api.put(`/entrepots/${editingItem.id}`, formData);
            toast.success('Entrepôt/dépôt mis à jour avec succès');
            
            // Notification pour la modification d'entrepôt
            addNotification({
              title: 'Entrepôt modifié',
              message: `L'entrepôt "${formData.nom || formData.designation}" a été modifié par ${user?.prenom} ${user?.nom}`,
              type: 'info',
              link: '/inventory'
            });
          } else {
            await api.post('/entrepots', formData);
            toast.success('Entrepôt/dépôt créé avec succès');
            
            // Notification pour la création d'entrepôt
            addNotification({
              title: 'Nouvel entrepôt créé',
              message: `Un nouvel entrepôt "${formData.nom || formData.designation}" a été créé par ${user?.prenom} ${user?.nom}`,
              type: 'success',
              link: '/inventory'
            });
          }
          fetchEntrepots();
          break;
      }
      setShowModal(false);
      setShowEntrepotsModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Erreur lors de la sauvegarde');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur inventaire',
        message: `Erreur lors de la sauvegarde: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/inventory'
      });
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.statut) params.append('statut', filters.statut);
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.itemsPerPage);

      const response = await api.get(`/fournisseurs?${params}`);
      
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
      // Récupérer les informations de l'élément avant suppression pour la notification
      let itemToDelete = null;
      switch (activeTab) {
        case 'inventory':
          itemToDelete = inventory.find(item => item.id === id);
          break;
        case 'fournisseurs':
          itemToDelete = fournisseurs.find(item => item.id === id);
          break;
        case 'achats':
          itemToDelete = achats.find(item => item.id === id);
          break;
        case 'mouvements':
          itemToDelete = mouvementsStock.find(item => item.id === id);
          break;
        case 'entrepots':
          itemToDelete = entrepots.find(item => item.id === id);
          break;
      }

      switch (activeTab) {
        case 'inventory':
          await api.delete(`/inventaire/${id}`);
          toast.success('Article supprimé avec succès');
          
          // Notification pour la suppression d'article
          addNotification({
            title: 'Article supprimé',
            message: `L'article "${itemToDelete?.nom || itemToDelete?.designation || 'inconnu'}" a été supprimé par ${user?.prenom} ${user?.nom}`,
            type: 'warning',
            link: '/inventory'
          });
          
          fetchInventory();
          break;
        case 'fournisseurs':
          await api.delete(`/fournisseurs/${id}`);
          toast.success('Fournisseur supprimé avec succès');
          
          // Notification pour la suppression de fournisseur
          addNotification({
            title: 'Fournisseur supprimé',
            message: `Le fournisseur "${itemToDelete?.nom || itemToDelete?.raison_sociale || 'inconnu'}" a été supprimé par ${user?.prenom} ${user?.nom}`,
            type: 'warning',
            link: '/inventory'
          });
          
          fetchFournisseurs();
          break;
        case 'achats':
          await api.delete(`/achats/${id}`);
          toast.success('Achat supprimé avec succès');
          
          // Notification pour la suppression d'achat
          addNotification({
            title: 'Achat supprimé',
            message: `L'achat "${itemToDelete?.reference || itemToDelete?.description || 'inconnu'}" a été supprimé par ${user?.prenom} ${user?.nom}`,
            type: 'warning',
            link: '/inventory'
          });
          
          fetchAchats();
          break;
        case 'mouvements':
          await api.delete(`/mouvements-stock/${id}`);
          toast.success('Mouvement supprimé avec succès');
          
          // Notification pour la suppression de mouvement
          addNotification({
            title: 'Mouvement de stock supprimé',
            message: `Le mouvement de stock "${itemToDelete?.type || 'Mouvement'}" a été supprimé par ${user?.prenom} ${user?.nom}`,
            type: 'warning',
            link: '/inventory'
          });
          
          fetchMouvementsStock();
          break;
        case 'entrepots':
          await api.delete(`/entrepots/${id}`);
          toast.success('Entrepôt/dépôt supprimé avec succès');
          
          // Notification pour la suppression d'entrepôt
          addNotification({
            title: 'Entrepôt supprimé',
            message: `L'entrepôt "${itemToDelete?.nom || itemToDelete?.designation || 'inconnu'}" a été supprimé par ${user?.prenom} ${user?.nom}`,
            type: 'warning',
            link: '/inventory'
          });
          
          fetchEntrepots();
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erreur lors de la suppression');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur suppression inventaire',
        message: `Erreur lors de la suppression: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/inventory'
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage === pagination.currentPage) return;
    
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
    
    // Trigger data fetch for paginated tabs
    if (activeTab === 'fournisseurs' || activeTab === 'entrepots') {
      // Set loading state immediately for better UX
      setPageLoading(true);
      setTimeout(() => {
        if (activeTab === 'fournisseurs') {
          fetchFournisseurs();
        } else if (activeTab === 'entrepots') {
          fetchEntrepots();
        }
      }, 0);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    if (newItemsPerPage === pagination.itemsPerPage) return;
    
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Reset to first page when changing items per page
      itemsPerPage: newItemsPerPage
    }));
    
    // Trigger data fetch for paginated tabs
    if (activeTab === 'fournisseurs' || activeTab === 'entrepots') {
      // Set loading state immediately for better UX
      setPageLoading(true);
      setTimeout(() => {
        if (activeTab === 'fournisseurs') {
          fetchFournisseurs();
        } else if (activeTab === 'entrepots') {
          fetchEntrepots();
        }
      }, 0);
    }
  };

  const handleApproveAchat = async (id) => {
    try {
      // Récupérer les informations de l'achat pour la notification
      const achat = achats.find(item => item.id === id);
      
      await api.post(`/achats/${id}/approve`);
      toast.success('Achat approuvé avec succès');
      
      // Notification pour l'approbation d'achat
      addNotification({
        title: 'Achat approuvé',
        message: `L'achat "${achat?.reference || achat?.description || 'inconnu'}" a été approuvé par ${user?.prenom} ${user?.nom}`,
        type: 'success',
        link: '/inventory'
      });
      
      fetchAchats();
    } catch (error) {
      console.error('Error approving purchase:', error);
      toast.error('Erreur lors de l\'approbation');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur approbation achat',
        message: `Erreur lors de l'approbation de l'achat: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/inventory'
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'achats' && useAdvancedAchats) {
      setShowAdvancedModal(true);
    } else if (activeTab === 'entrepots') {
      setShowEntrepotsModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleViewDetails = (item) => {
    // Ouvrir une vue détaillée de l'élément
    console.log('Voir détails:', item);
    // Ici vous pourriez ouvrir un modal de détails ou naviguer vers une page dédiée
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de l'Inventaire & Achats
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez le stock, les fournisseurs, achats, mouvements et entrepôts
          </p>
        </div>
        {hasPermission('Superviseur') && (
          <div className="flex space-x-2">
            {activeTab === 'achats' && (
              <button
                onClick={() => setUseAdvancedAchats(!useAdvancedAchats)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  useAdvancedAchats 
                    ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                {useAdvancedAchats ? 'Mode Avancé' : 'Mode Simple'}
              </button>
            )}
            {activeTab === 'stock' && (
              <button
                onClick={handleExportStockPDF}
                className="px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300"
              >
                Exporter PDF
              </button>
            )}
            <button
              onClick={() => {
                if (activeTab === 'achats' && useAdvancedAchats) {
                  setShowAdvancedModal(true);
                } else if (activeTab === 'entrepots') {
                  setShowEntrepotsModal(true);
                } else {
                  setShowModal(true);
                }
              }}
              className="btn-primary"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {activeTab === 'inventory' && 'Ajouter un article'}
              {activeTab === 'fournisseurs' && 'Ajouter un fournisseur'}
              {activeTab === 'achats' && (useAdvancedAchats ? 'Nouvel achat avancé' : 'Nouvel achat')}
              {activeTab === 'mouvements' && 'Nouveau mouvement'}
              {activeTab === 'entrepots' && 'Ajouter un entrepôt/dépôt'}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <InventoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Filters */}
      <InventoryFilters 
        filters={filters} 
        setFilters={setFilters} 
        categories={categories} 
        statuses={statuses}
        onSearch={handleSearch}
      />

      {/* Content based on active tab */}
      {activeTab === 'inventory' && (
        <div className="card">
          <div className="card-body">
            <InventoryTable 
              inventory={inventory}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getCategoryColor={getCategoryColor}
              getStockStatusColor={getStockStatusColor}
            />
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="card">
          <div className="card-body">
            <StockTable 
              items={stockSummary}
              onEdit={handleEdit}
            />
          </div>
        </div>
      )}

      {activeTab === 'fournisseurs' && (
        <div className="card">
          <div className="card-body">
            <FournisseursTable 
              fournisseurs={fournisseurs}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getCategoryColor={getCategoryColor}
              pagination={pagination}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              pageLoading={pageLoading}
            />
          </div>
        </div>
      )}

      {activeTab === 'achats' && (
        <div className="card">
          <div className="card-body">
            {useAdvancedAchats ? (
              <AchatsAdvancedTable 
                achats={achats}
                onEdit={handleEdit}
                onApprove={handleApproveAchat}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <AchatsTable 
                achats={achats}
                onEdit={handleEdit}
                onApprove={handleApproveAchat}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'mouvements' && (
        <div className="card">
          <div className="card-body">
            <MouvementsTable 
              mouvementsStock={mouvementsStock}
              onEdit={handleEdit}
            />
          </div>
        </div>
      )}

      {activeTab === 'entrepots' && (
        <div className="card">
          <div className="card-body">
            <EntrepotsTable 
              entrepots={entrepots}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              pagination={pagination}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              pageLoading={pageLoading}
            />
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <InventoryModal
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

      {/* Advanced Modal for Achats */}
      {showAdvancedModal && (
        <AchatsAdvancedModal
          item={editingItem}
          onClose={() => {
            setShowAdvancedModal(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
          selectStyles={selectStyles}
          fournisseurOptions={fournisseurOptions}
          inventoryOptions={inventoryOptions}
        />
      )}

      {/* Modal for Entrepots */}
      {showEntrepotsModal && (
        <EntrepotsModal
          isOpen={showEntrepotsModal}
          entrepot={editingItem}
          onClose={() => {
            setShowEntrepotsModal(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
          selectStyles={selectStyles}
        />
      )}
    </div>
  );
};

export default Inventory; 