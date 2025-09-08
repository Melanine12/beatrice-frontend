import React, { useState, useEffect } from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import { 
  ClipboardDocumentListIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const BonsPrelevement = () => {
  const { canViewBonsPrelevement } = usePermissions();
  const [bons, setBons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [showModal, setShowModal] = useState(false);

  // Données de démonstration
  useEffect(() => {
    const mockBons = [
      {
        id: 1,
        numero: 'BP-001-2024',
        date: '2024-01-15',
        demandeur: 'Jean Dupont',
        departement: 'Maintenance',
        statut: 'En attente',
        articles: [
          { nom: 'Ampoule LED', quantite: 5, unite: 'pièces' },
          { nom: 'Câble électrique', quantite: 10, unite: 'mètres' }
        ]
      },
      {
        id: 2,
        numero: 'BP-002-2024',
        date: '2024-01-16',
        demandeur: 'Marie Martin',
        departement: 'Réception',
        statut: 'Approuvé',
        articles: [
          { nom: 'Papier A4', quantite: 20, unite: 'rames' },
          { nom: 'Stylos', quantite: 50, unite: 'pièces' }
        ]
      }
    ];
    
    setTimeout(() => {
      setBons(mockBons);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBons = bons.filter(bon => {
    const matchesSearch = bon.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bon.demandeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bon.departement.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'tous' || bon.statut.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (statut) => {
    switch (statut.toLowerCase()) {
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'approuvé':
        return 'bg-green-100 text-green-800';
      case 'refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!canViewBonsPrelevement) {
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
              <ClipboardDocumentListIcon className="h-8 w-8 mr-3 text-blue-600" />
              Bons de Prélèvement
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez les demandes de prélèvement de matériel et d'équipements
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau Bon
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro, demandeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="tous">Tous les statuts</option>
            <option value="en attente">En attente</option>
            <option value="approuvé">Approuvé</option>
            <option value="refusé">Refusé</option>
          </select>
          
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tableau des bons */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Chargement des bons...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Demandeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBons.map((bon) => (
                  <tr key={bon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {bon.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(bon.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {bon.demandeur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {bon.departement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bon.statut)}`}>
                        {bon.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {bon.articles.length} article(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400">
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

export default BonsPrelevement;
