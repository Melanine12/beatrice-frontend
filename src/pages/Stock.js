import React, { useState, useEffect } from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import { 
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

// Import des composants d'inventaire
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

const Stock = () => {
  const { canViewInventaire } = usePermissions();
  const [activeTab, setActiveTab] = useState('stock');
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
    search: '',
    fournisseur: '',
    dateDebut: '',
    dateFin: ''
  });

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les données de démonstration
      const mockData = {
        inventory: [
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
            fournisseur: 'Philips Lighting'
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
            fournisseur: 'Legrand'
          }
        ],
        fournisseurs: [
          { id: 1, nom: 'Philips Lighting', contact: 'contact@philips.com', telephone: '01 23 45 67 89' },
          { id: 2, nom: 'Legrand', contact: 'contact@legrand.com', telephone: '01 23 45 67 90' }
        ],
        achats: [],
        mouvementsStock: [],
        entrepots: [],
        stockSummary: []
      };

      setInventory(mockData.inventory);
      setFournisseurs(mockData.fournisseurs);
      setAchats(mockData.achats);
      setMouvementsStock(mockData.mouvementsStock);
      setEntrepots(mockData.entrepots);
      setStockSummary(mockData.stockSummary);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPageLoading(true);
    setTimeout(() => setPageLoading(false), 500);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
        setInventory(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...itemData } : item
        ));
      } else {
        // Ajout
        const newItem = {
          ...itemData,
          id: Date.now(),
          code: `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        };
        setInventory(prev => [...prev, newItem]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <CubeIcon className="h-8 w-8 mr-3 text-blue-600" />
              Gestion de l'Inventaire & Achats
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez le stock, les fournisseurs, achats, mouvements et entrepôts
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

      {/* Onglets */}
      <InventoryTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        showAdvancedAchats={useAdvancedAchats}
        onToggleAdvancedAchats={() => setUseAdvancedAchats(!useAdvancedAchats)}
      />

      {/* Filtres */}
      <InventoryFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        fournisseurOptions={fournisseurOptions}
        categories={categories}
        statuses={statuses}
      />

      {/* Contenu des onglets */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {pageLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Chargement...</p>
          </div>
        ) : (
          <>
            {activeTab === 'inventory' && (
              <InventoryTable
                data={inventory}
                onEdit={handleEditItem}
                onDelete={(id) => {
                  setInventory(prev => prev.filter(item => item.id !== id));
                }}
                filters={filters}
              />
            )}
            
            {activeTab === 'stock' && (
              <StockTable
                data={stockSummary}
                onEdit={handleEditItem}
                onDelete={(id) => {
                  setStockSummary(prev => prev.filter(item => item.id !== id));
                }}
                filters={filters}
              />
            )}
            
            {activeTab === 'fournisseurs' && (
              <FournisseursTable
                data={fournisseurs}
                onEdit={(fournisseur) => {
                  // Logique d'édition des fournisseurs
                }}
                onDelete={(id) => {
                  setFournisseurs(prev => prev.filter(item => item.id !== id));
                }}
                filters={filters}
              />
            )}
            
            {activeTab === 'achats' && (
              useAdvancedAchats ? (
                <AchatsAdvancedTable
                  data={achats}
                  onEdit={(achat) => {
                    // Logique d'édition des achats
                  }}
                  onDelete={(id) => {
                    setAchats(prev => prev.filter(item => item.id !== id));
                  }}
                  filters={filters}
                  onAdd={() => setShowAdvancedModal(true)}
                />
              ) : (
                <AchatsTable
                  data={achats}
                  onEdit={(achat) => {
                    // Logique d'édition des achats
                  }}
                  onDelete={(id) => {
                    setAchats(prev => prev.filter(item => item.id !== id));
                  }}
                  filters={filters}
                />
              )
            )}
            
            {activeTab === 'mouvements' && (
              <MouvementsTable
                data={mouvementsStock}
                onEdit={(mouvement) => {
                  // Logique d'édition des mouvements
                }}
                onDelete={(id) => {
                  setMouvementsStock(prev => prev.filter(item => item.id !== id));
                }}
                filters={filters}
              />
            )}
            
            {activeTab === 'entrepots' && (
              <EntrepotsTable
                data={entrepots}
                onEdit={(entrepot) => {
                  // Logique d'édition des entrepôts
                }}
                onDelete={(id) => {
                  setEntrepots(prev => prev.filter(item => item.id !== id));
                }}
                filters={filters}
                onAdd={() => setShowEntrepotsModal(true)}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <InventoryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveItem}
          editingItem={editingItem}
          fournisseurOptions={fournisseurOptions}
        />
      )}

      {showAdvancedModal && (
        <AchatsAdvancedModal
          isOpen={showAdvancedModal}
          onClose={() => setShowAdvancedModal(false)}
          onSave={(achatData) => {
            // Logique de sauvegarde des achats
            setShowAdvancedModal(false);
          }}
          fournisseurOptions={fournisseurOptions}
          inventoryOptions={inventoryOptions}
        />
      )}

      {showEntrepotsModal && (
        <EntrepotsModal
          isOpen={showEntrepotsModal}
          onClose={() => setShowEntrepotsModal(false)}
          onSave={(entrepotData) => {
            // Logique de sauvegarde des entrepôts
            setShowEntrepotsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Stock;
