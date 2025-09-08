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

const Stock = () => {
  const { canViewInventaire } = usePermissions();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('toutes');
  const [filterStatus, setFilterStatus] = useState('tous');

  // Données de démonstration
  useEffect(() => {
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
        fournisseur: 'Clairefontaine'
      }
    ];
    
    setTimeout(() => {
      setStock(mockStock);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'toutes' || item.categorie === filterCategory;
    const matchesStatus = filterStatus === 'tous' || item.statut.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (statut) => {
    switch (statut.toLowerCase()) {
      case 'en stock':
        return 'bg-green-100 text-green-800';
      case 'stock faible':
        return 'bg-yellow-100 text-yellow-800';
      case 'rupture de stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuantiteColor = (quantite, seuilMin) => {
    if (quantite === 0) return 'text-red-600 font-bold';
    if (quantite <= seuilMin) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <CubeIcon className="h-8 w-8 mr-3 text-blue-600" />
              Gestion du Stock
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Suivez et gérez l'inventaire de vos articles et équipements
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter Article
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CubeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stock.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CubeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {stock.filter(item => item.statut === 'En stock').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CubeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Faible</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stock.filter(item => item.statut === 'Stock faible').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <CubeIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rupture</p>
              <p className="text-2xl font-bold text-red-600">
                {stock.filter(item => item.statut === 'Rupture de stock').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="toutes">Toutes les catégories</option>
            <option value="Électronique">Électronique</option>
            <option value="Électricité">Électricité</option>
            <option value="Bureau">Bureau</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="tous">Tous les statuts</option>
            <option value="en stock">En stock</option>
            <option value="stock faible">Stock faible</option>
            <option value="rupture de stock">Rupture de stock</option>
          </select>
          
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tableau du stock */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Chargement du stock...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.nom}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.sousCategorie}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.categorie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className={`font-medium ${getQuantiteColor(item.quantite, item.seuilMin)}`}>
                          {item.quantite} {item.unite}
                        </span>
                        <div className="text-xs text-gray-500">
                          Seuil: {item.seuilMin} {item.unite}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.statut)}`}>
                        {item.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.prix.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400" title="Voir QR Code">
                        <QrCodeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400" title="Voir détails">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400" title="Modifier">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400" title="Supprimer">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
