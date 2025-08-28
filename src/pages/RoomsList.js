import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RoomsTable from '../components/Rooms/RoomsTable';
import { PlusIcon } from '@heroicons/react/24/outline';

const RoomsList = () => {
  const { hasPermission } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDelete = (room) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la chambre ${room.numero} ?`)) {
      // Ici vous pouvez ajouter la logique de suppression
      console.log('Supprimer la chambre:', room);
    }
  };

  const handleView = (room) => {
    setViewingRoom(room);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Liste des Chambres
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Consultez toutes les chambres de l'hôtel
          </p>
        </div>
        {hasPermission('Superviseur') && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter une chambre
          </button>
        )}
      </div>

      {/* Rooms Table */}
      <RoomsTable
        onEdit={hasPermission('Superviseur') ? handleEdit : null}
        onDelete={hasPermission('Administrateur') ? handleDelete : null}
        onView={handleView}
        showActions={true}
      />

      {/* View Details Modal */}
      {viewingRoom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Détails de la chambre {viewingRoom.numero}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Numéro
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.numero}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Statut
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.statut}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Capacité
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.capacite} personne(s)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prix/Nuit
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.prix_nuit}$</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Étage
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.etage}</p>
                  </div>
                </div>
                {viewingRoom.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.description}</p>
                  </div>
                )}
                {viewingRoom.equipements && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Équipements
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.equipements}</p>
                  </div>
                )}
                {viewingRoom.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{viewingRoom.notes}</p>
                  </div>
                )}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setViewingRoom(null)}
                    className="btn-outline"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsList; 