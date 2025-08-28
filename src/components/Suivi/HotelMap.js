import React, { useState } from 'react';
import {
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const HotelMap = ({ rooms, onRoomClick, selectedFloor = 1 }) => {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-500';
      case 'Occupée':
        return 'bg-red-500';
      case 'En maintenance':
        return 'bg-yellow-500';
      case 'En nettoyage':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoomStatusIcon = (status) => {
    switch (status) {
      case 'Libre':
        return <CheckCircleIcon className="h-4 w-4 text-white" />;
      case 'Occupée':
        return <UserIcon className="h-4 w-4 text-white" />;
      case 'En maintenance':
        return <ExclamationTriangleIcon className="h-4 w-4 text-white" />;
      case 'En nettoyage':
        return <ClockIcon className="h-4 w-4 text-white" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-white" />;
    }
  };

  // Filtrer les pièces par étage
  const floorRooms = rooms.filter(room => room.etage === selectedFloor);

  // Organiser les pièces en grille (simulation d'un plan d'hôtel)
  const organizeRooms = (rooms) => {
    const organized = [];
    const roomsPerRow = 5;
    
    for (let i = 0; i < rooms.length; i += roomsPerRow) {
      organized.push(rooms.slice(i, i + roomsPerRow));
    }
    
    return organized;
  };

  const organizedRooms = organizeRooms(floorRooms);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Plan de l'étage {selectedFloor}
        </h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Libre</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Occupée</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Nettoyage</span>
          </div>
        </div>
      </div>

      {/* Plan de l'étage */}
      <div className="relative">
        {/* Couloir central */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 transform -translate-x-1/2"></div>
        
        {/* Grille des pièces */}
        <div className="space-y-4">
          {organizedRooms.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-4">
              {row.map((room) => (
                <div
                  key={room.id}
                  className={`relative w-20 h-20 ${getRoomStatusColor(room.statut)} rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center`}
                  onClick={() => onRoomClick(room)}
                  onMouseEnter={() => setHoveredRoom(room)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  {getRoomStatusIcon(room.statut)}
                  
                  {/* Numéro de la chambre */}
                  <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white px-1 rounded">
                    {room.numero}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Légende des services */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Services</h4>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div>🛎️ Réception</div>
              <div>🍽️ Restaurant</div>
              <div>🏊 Piscine</div>
              <div>🚗 Parking</div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Équipements</h4>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div>🛁 Salle de bain</div>
              <div>📺 TV</div>
              <div>❄️ Climatisation</div>
              <div>📶 WiFi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip pour la pièce survolée */}
      {hoveredRoom && (
        <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-48">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {hoveredRoom.nom}
            </h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(hoveredRoom.statut)} text-white`}>
              {hoveredRoom.statut}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div>Type: {hoveredRoom.type}</div>
            <div>Prix: {hoveredRoom.prix_nuit}€/nuit</div>
            <div>Capacité: {hoveredRoom.capacite} personnes</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelMap; 