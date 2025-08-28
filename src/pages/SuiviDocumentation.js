import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import HotelMap from '../components/Suivi/HotelMap';
import ActivityStats from '../components/Suivi/ActivityStats';
import {
  MapPinIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const SuiviDocumentation = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomHistory, setRoomHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, occupied, available, maintenance, cleaning
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // grid, map
  const [dateFilter, setDateFilter] = useState('all'); // all, today, 3days, week, month
  const [showDateFilters, setShowDateFilters] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chambres');
      setRooms(response.data.chambres || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Erreur lors du chargement des pièces');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomHistory = async (roomId) => {
    try {
      setHistoryLoading(true);
      const response = await api.get(`/chambres/${roomId}/history`);
      setRoomHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching room history:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    fetchRoomHistory(room.id);
    setShowModal(true);
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Occupée':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'En maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En nettoyage':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoomStatusIcon = (status) => {
    switch (status) {
      case 'Libre':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'Occupée':
        return <UserIcon className="h-5 w-5" />;
      case 'En maintenance':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'En nettoyage':
        return <ClockIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin':
        return <UserIcon className="h-4 w-4 text-green-600" />;
      case 'checkout':
        return <UserIcon className="h-4 w-4 text-red-600" />;
      case 'cleaning':
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      case 'maintenance':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />;
      case 'issue':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour obtenir la date de début selon le filtre
  const getStartDate = (filterType) => {
    const now = new Date();
    switch (filterType) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case '3days':
        return new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
      case 'week':
        return new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      case 'month':
        return new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      default:
        return null;
    }
  };

  // Fonction pour filtrer l'historique par date
  const filterHistoryByDate = (history) => {
    if (dateFilter === 'all') return history;
    
    const startDate = getStartDate(dateFilter);
    if (!startDate) return history;
    
    return history.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= startDate;
    });
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.statut === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Suivi et Documentation
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Carte interactive des pièces et locaux avec historique détaillé
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Contrôles de vue */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'map'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Carte
              </button>
            </div>

            {/* Sélecteur d'étage (visible seulement en mode carte) */}
            {viewMode === 'map' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Étage:</span>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  {[1, 2, 3, 4, 5].map(floor => (
                    <option key={floor} value={floor}>Étage {floor}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtres */}
            <div className="flex items-center space-x-4">
              {/* Filtre par statut */}
              <div className="flex items-center space-x-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Toutes les pièces</option>
                  <option value="Libre">Pièces libres</option>
                  <option value="Occupée">Pièces occupées</option>
                  <option value="En maintenance">En maintenance</option>
                  <option value="En nettoyage">En nettoyage</option>
                </select>
              </div>

              {/* Filtre par date */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="3days">Il y a 3 jours</option>
                  <option value="week">Il y a une semaine</option>
                  <option value="month">Il y a un mois</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affichage des pièces */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden group"
            >
              {/* Image de la pièce (placeholder) */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <MapPinIcon className="h-16 w-16 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </div>

              {/* Informations de la pièce */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {room.nom}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoomStatusColor(room.statut)}`}>
                    {getRoomStatusIcon(room.statut)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{room.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Étage:</span>
                    <span className="font-medium">{room.etage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Prix/nuit:</span>
                    <span className="font-medium">{room.prix_nuit}€</span>
                  </div>
                </div>

                {/* Indicateurs d'activité */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {dateFilter === 'all' ? 'Dernière activité' :
                       dateFilter === 'today' ? 'Activité aujourd\'hui' :
                       dateFilter === '3days' ? 'Activité 3 derniers jours' :
                       dateFilter === 'week' ? 'Activité cette semaine' :
                       dateFilter === 'month' ? 'Activité ce mois' : 'Dernière activité'}
                    </span>
                  </div>
                  <EyeIcon className="h-3 w-3 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <HotelMap 
          rooms={filteredRooms}
          onRoomClick={handleRoomClick}
          selectedFloor={selectedFloor}
        />
      )}

      {/* Modal pour l'historique détaillé */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Historique - {selectedRoom.nom}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedRoom.type} • Étage {selectedRoom.etage} • {selectedRoom.statut}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {historyLoading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner />
                </div>
              ) : roomHistory.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Aucun historique disponible
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Aucune activité enregistrée pour cette pièce.
                  </p>
                </div>
              ) : (
                <>
                  {/* Statistiques d'activité */}
                  <ActivityStats history={roomHistory} dateFilter={dateFilter} />
                  
                  {/* Indicateur de filtre actif */}
                  {dateFilter !== 'all' && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FunnelIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Filtre actif: {
                              dateFilter === 'today' ? 'Aujourd\'hui' :
                              dateFilter === '3days' ? 'Il y a 3 jours' :
                              dateFilter === 'week' ? 'Il y a une semaine' :
                              dateFilter === 'month' ? 'Il y a un mois' : 'Toutes les dates'
                            }
                          </span>
                        </div>
                        <button
                          onClick={() => setDateFilter('all')}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Effacer le filtre
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {filterHistoryByDate(roomHistory).map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.title}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(activity.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {activity.description}
                          </p>
                          {activity.user && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Par: {activity.user.prenom} {activity.user.nom}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message si aucun résultat avec le filtre */}
                  {filterHistoryByDate(roomHistory).length === 0 && dateFilter !== 'all' && (
                    <div className="text-center py-8">
                      <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Aucune activité trouvée
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Aucune activité ne correspond au filtre de date sélectionné.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuiviDocumentation; 