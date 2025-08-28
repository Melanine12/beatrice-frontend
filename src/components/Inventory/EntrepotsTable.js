import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import EntrepotsModal from './EntrepotsModal';

const EntrepotsTable = () => {
  const [entrepots, setEntrepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntrepot, setSelectedEntrepot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  useEffect(() => {
    fetchEntrepots();
  }, []);

  const fetchEntrepots = async () => {
    try {
      setLoading(true);
      const response = await api.get('/entrepots');
      setEntrepots(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des entrepôts:', error);
      toast.error('Erreur lors de la récupération des entrepôts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entrepot) => {
    setSelectedEntrepot(entrepot);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedEntrepot(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntrepot(null);
  };

  const handleRefresh = () => {
    fetchEntrepots();
  };

  const filteredEntrepots = entrepots.filter(entrepot => {
    const matchesSearch = entrepot.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepot.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepot.ville?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || entrepot.type === filterType;
    const matchesStatut = !filterStatut || entrepot.statut === filterStatut;
    
    return matchesSearch && matchesType && matchesStatut;
  });

  const getTypeLabel = (type) => {
    const typeLabels = {
      'entrepôt': 'Entrepôt',
      'dépôt': 'Dépôt',
      'magasin': 'Magasin',
      'zone_stockage': 'Zone de stockage'
    };
    return typeLabels[type] || type;
  };

  const getStatutBadge = (statut) => {
    const statutConfig = {
      'actif': 'bg-green-100 text-green-800',
      'inactif': 'bg-gray-100 text-gray-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'construction': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statutConfig[statut] || 'bg-gray-100 text-gray-800'}`}>
        {statut}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header avec bouton d'ajout et filtres */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Entrepôts</h2>
            <p className="text-gray-600 mt-1">Gérez vos entrepôts, dépôts et zones de stockage</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Nouvel entrepôt
          </button>
        </div>

        {/* Filtres */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <input
              type="text"
              placeholder="Nom, description, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              <option value="entrepôt">Entrepôt</option>
              <option value="dépôt">Dépôt</option>
              <option value="magasin">Magasin</option>
              <option value="zone_stockage">Zone de stockage</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="maintenance">Maintenance</option>
              <option value="construction">Construction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localisation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEntrepots.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {loading ? 'Chargement...' : 'Aucun entrepôt trouvé'}
                </td>
              </tr>
            ) : (
              filteredEntrepots.map((entrepot) => (
                <tr key={entrepot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entrepot.nom}</div>
                      {entrepot.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {entrepot.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {getTypeLabel(entrepot.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {entrepot.ville && (
                        <div>{entrepot.ville}</div>
                      )}
                      {entrepot.code_postal && (
                        <div className="text-gray-500">{entrepot.code_postal}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {entrepot.capacite ? `${entrepot.capacite} m³` : '-'}
                    </div>
                    {entrepot.utilisation && (
                      <div className="text-xs text-gray-500">
                        {entrepot.utilisation}% utilisé
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatutBadge(entrepot.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {entrepot.responsable || '-'}
                    </div>
                    {entrepot.telephone && (
                      <div className="text-xs text-gray-500">{entrepot.telephone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(entrepot)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          {filteredEntrepots.length} entrepôt(s) affiché(s)
        </div>
      </div>

      {/* Modal */}
      <EntrepotsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        entrepot={selectedEntrepot}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default EntrepotsTable; 