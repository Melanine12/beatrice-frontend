import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../contexts/PermissionContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/outline';

// Import des composants d'inventaire
import InventoryFilters from '../components/Inventory/InventoryFilters';
import StockTable from '../components/Inventory/StockTable';
import InventoryModal from '../components/Inventory/InventoryModal';

// Import des utilitaires
import { 
  getStockStatusColor, 
  getCategoryColor, 
  selectStyles, 
  categories, 
  statuses 
} from '../components/Inventory/inventoryUtils';

const Stock = () => {
  const { user, hasPermission } = useAuth();
  const { canViewInventaire } = usePermissions();
  const [stockSummary, setStockSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [fournisseurOptions, setFournisseurOptions] = useState([]);
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

  // Charger les données du stock
  useEffect(() => {
    fetchStockSummary();
  }, [pagination.currentPage, pagination.itemsPerPage]);

  // Recharger quand les filtres changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStockSummary();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchStockSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory/stock-summary', {
        params: {
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          ...filters
        }
      });
      
      if (response.data.success) {
        setStockSummary(response.data.data.items || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.totalPages || 1,
          totalItems: response.data.data.totalItems || 0
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du stock:', error);
      toast.error('Erreur lors du chargement du stock');
      
      // Données de démonstration en cas d'erreur
      const mockStock = [
        {
          id: 1,
          nom: 'Ampoule LED Philips',
          code: 'AMP-LED-001',
          categorie: 'Électronique',
          sousCategorie: 'Éclairage',
          quantite: 25,
          unite: 'pièces',
          seuilMin: 10,
          statut: 'En stock',
          prix: 15.50,
          fournisseur: 'Philips Lighting',
          qrCode: null
        },
        {
          id: 2,
          nom: 'Câble électrique 2.5mm²',
          code: 'CAB-2.5-001',
          categorie: 'Électricité',
          sousCategorie: 'Câblage',
          quantite: 5,
          unite: 'mètres',
          seuilMin: 20,
          statut: 'Stock faible',
          prix: 2.30,
          fournisseur: 'Legrand',
          qrCode: null
        },
        {
          id: 3,
          nom: 'Papier A4 80g',
          code: 'PAP-A4-001',
          categorie: 'Bureau',
          sousCategorie: 'Papeterie',
          quantite: 0,
          unite: 'rames',
          seuilMin: 5,
          statut: 'Rupture de stock',
          prix: 3.20,
          fournisseur: 'Clairefontaine',
          qrCode: null
        }
      ];
      setStockSummary(mockStock);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        // Mise à jour
        const response = await api.put(`/inventory/${editingItem.id}`, itemData);
        if (response.data.success) {
          toast.success('Article mis à jour avec succès');
          fetchStockSummary();
        }
      } else {
        // Ajout
        const response = await api.post('/inventory', itemData);
        if (response.data.success) {
          toast.success('Article ajouté avec succès');
          fetchStockSummary();
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await api.delete(`/inventory/${id}`);
      if (response.data.success) {
        toast.success('Article supprimé avec succès');
        fetchStockSummary();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (!canViewInventaire) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">
          Accès non autorisé
        </div>
        <p className="text-gray-600 mt-2">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <PlusIcon className="h-8 w-8 mr-3 text-blue-600" />
              Gestion de Stock
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez le stock de vos articles et équipements
            </p>
          </div>
          <button
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter Article
          </button>
        </div>
      </div>

      {/* Filtres */}
      <InventoryFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        fournisseurOptions={fournisseurOptions}
        categories={categories}
        statuses={statuses}
      />

      {/* Tableau du stock */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <StockTable
          data={stockSummary}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          filters={filters}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <InventoryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveItem}
          editingItem={editingItem}
          fournisseurOptions={fournisseurOptions}
        />
      )}
    </div>
  );
};

export default Stock;
