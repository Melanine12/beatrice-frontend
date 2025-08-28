import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../UI/LoadingSpinner';
import Pagination from '../UI/Pagination';
import { 
  BuildingOfficeIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const RoomsTable = ({ onEdit, onDelete, onView, showActions = true }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    statut: '',
    type: '',
    etage: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const roomTypes = ['Simple', 'Double', 'Suite', 'Familiale'];
  const roomStatuses = ['Libre', 'Occupée', 'En nettoyage', 'En maintenance', 'Réservée'];

  useEffect(() => {
    fetchRooms();
  }, [filters, pagination.page, pagination.limit]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.type) params.append('type', filters.type);
      if (filters.etage) params.append('etage', filters.etage);
      if (filters.search) params.append('search', filters.search);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await api.get(`/chambres?${params}`);
      const data = response.data;
      
      setRooms(data.chambres || data.rooms || data);
      
      // Update pagination info from response
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total || data.total || 0,
          totalPages: data.pagination.pages || Math.ceil((data.total || 0) / pagination.limit)
        }));
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Erreur lors du chargement des chambres');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Libre': 'bg-green-100 text-green-800',
      'Occupée': 'bg-red-100 text-red-800',
      'En nettoyage': 'bg-yellow-100 text-yellow-800',
      'En maintenance': 'bg-orange-100 text-orange-800',
      'Réservée': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Simple': 'bg-blue-100 text-blue-800',
      'Double': 'bg-purple-100 text-purple-800',
      'Suite': 'bg-indigo-100 text-indigo-800',
      'Familiale': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit, 
      page: 1 // Reset to first page when changing limit
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
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
      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recherche
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Numéro de chambre..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange({ ...filters, statut: e.target.value })}
                className="input"
              >
                <option value="">Tous les statuts</option>
                {roomStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ ...filters, type: e.target.value })}
                className="input"
              >
                <option value="">Tous les types</option>
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Étage
              </label>
              <input
                type="number"
                placeholder="Étage..."
                value={filters.etage}
                onChange={(e) => handleFilterChange({ ...filters, etage: e.target.value })}
                className="input"
                min="0"
                max="50"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => handleFilterChange({ statut: '', type: '', etage: '', search: '' })}
                className="btn-outline w-full"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="card">
        <div className="card-body">
          {rooms.length === 0 ? (
            <div className="text-center py-8">
              <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune chambre trouvée
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aucune chambre ne correspond aux critères de recherche
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Chambre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Capacité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Prix/Nuit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Étage
                    </th>
                    {showActions && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Chambre {room.numero}
                          </div>
                          {room.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {room.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(room.type)}`}>
                          {room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.statut)}`}>
                          {room.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {room.capacite} personne(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {room.prix_nuit}$
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {room.etage}
                      </td>
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {onView && (
                              <button
                                onClick={() => onView(room)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Voir les détails"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(room)}
                                className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                title="Modifier"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(room)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Supprimer"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <div className="card">
          <div className="card-body">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsTable; 