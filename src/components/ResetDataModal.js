import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const ResetDataModal = ({ isOpen, onClose, onReset }) => {
  const { user, hasExactRole } = useAuth();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [resetAll, setResetAll] = useState(false);
  const [keepImages, setKeepImages] = useState(false);
  const [keepAdmin, setKeepAdmin] = useState(true);
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({});

  // Vérifier que l'utilisateur a le rôle Web Master
  const isWebMaster = hasExactRole('Web Master');

  // Charger les tables disponibles
  useEffect(() => {
    if (isOpen) {
      // Vérifier que l'utilisateur a le rôle Web Master
      if (!isWebMaster) {
        alert('Accès refusé. Seuls les Web Masters peuvent accéder à cette fonctionnalité.');
        onClose();
        return;
      }
      
      loadTables();
      loadStatus();
    }
  }, [isOpen, isWebMaster, onClose]);

  const loadTables = async () => {
    try {
      console.log('🔄 Chargement des tables...');
      const response = await fetch('/api/reset/tables', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Tables chargées:', data.tables);
        setTables(data.tables);
      } else {
        console.error('❌ Erreur API:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des tables:', error);
    }
  };

  const loadStatus = async () => {
    try {
      console.log('🔄 Chargement du statut...');
      const response = await fetch('/api/reset/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Statut chargé:', data.status);
        setStatus(data.status);
      } else {
        console.error('❌ Erreur API statut:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du statut:', error);
    }
  };

  const handleReset = async () => {
    // Vérifier que l'utilisateur a le rôle Web Master
    if (!isWebMaster) {
      alert('Accès refusé. Seuls les Web Masters peuvent effectuer cette action.');
      return;
    }

    if (!confirmText.includes('RESET')) {
      alert('Veuillez taper "RESET" pour confirmer');
      return;
    }

    setIsLoading(true);
    
    try {
      let endpoint = '/api/reset/all';
      let body = {
        keepImages,
        keepAdmin,
        confirm: true
      };

      if (!resetAll && selectedTable) {
        endpoint = `/api/reset/table/${selectedTable}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        alert('Réinitialisation effectuée avec succès !');
        onReset();
        onClose();
        loadStatus(); // Recharger le statut
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      alert('Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  const getTableStatus = (tableName) => {
    const tableStatus = status[tableName];
    console.log(`🔍 Statut pour ${tableName}:`, tableStatus);
    if (!tableStatus) return { count: 0, hasData: false };
    
    return {
      count: tableStatus.count,
      hasData: tableStatus.hasData
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Réinitialisation des Données
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Web Master Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                🔐 Accès Web Master
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Cette fonctionnalité est réservée aux utilisateurs ayant le rôle "Web Master".
                Vous êtes actuellement connecté en tant que {user?.role}.
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                ⚠️ ATTENTION - Action Irréversible
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Cette action supprimera définitivement toutes les données sélectionnées. 
                Cette opération ne peut pas être annulée.
              </p>
            </div>
          </div>
        </div>

        {/* Reset Options */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="resetAll"
              checked={resetAll}
              onChange={(e) => setResetAll(e.target.checked)}
              className="text-red-600"
            />
            <label htmlFor="resetAll" className="font-medium text-gray-900">
              Réinitialiser TOUTES les tables
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="resetTable"
              checked={!resetAll}
              onChange={(e) => setResetAll(!e.target.checked)}
              className="text-red-600"
            />
            <label htmlFor="resetTable" className="font-medium text-gray-900">
              Réinitialiser une table spécifique
            </label>
          </div>

          {!resetAll && (
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner une table</option>
              {tables.map((table) => {
                const tableStatus = getTableStatus(table.name);
                return (
                  <option key={table.name} value={table.name}>
                    {table.displayName} ({tableStatus.count} enregistrements)
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="keepImages"
              checked={keepImages}
              onChange={(e) => setKeepImages(e.target.checked)}
              className="text-red-600"
            />
            <label htmlFor="keepImages" className="text-gray-700">
              Conserver les images Cloudinary (pour les problématiques)
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="keepAdmin"
              checked={keepAdmin}
              onChange={(e) => setKeepAdmin(e.target.checked)}
              className="text-red-600"
            />
            <label htmlFor="keepAdmin" className="text-gray-700">
              Conserver les comptes administrateurs
            </label>
          </div>
        </div>

        {/* Table Status */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            État actuel des tables
          </h3>
          
          {/* Debug Info */}
          <div className="mb-3 p-2 bg-gray-100 rounded text-xs">
            <strong>Debug:</strong> {tables.length} tables chargées, {Object.keys(status).length} statuts chargés
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {tables.length > 0 ? (
              tables.map((table) => {
                const tableStatus = getTableStatus(table.name);
                return (
                  <div
                    key={table.name}
                    className={`p-3 rounded-lg border ${
                      tableStatus.hasData 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {table.displayName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tableStatus.count} enregistrements
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 p-4 text-center text-gray-500">
                Aucune table chargée...
              </div>
            )}
          </div>
        </div>

        {/* Confirmation */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmation finale
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Tapez 'RESET' pour confirmer"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">
            Vous devez taper "RESET" pour confirmer cette action destructrice.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Annuler
          </button>
          
          <button
            onClick={handleReset}
            disabled={isLoading || !confirmText.includes('RESET')}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 rounded-md flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Réinitialisation...</span>
              </>
            ) : (
              <>
                <TrashIcon className="h-4 w-4" />
                <span>Réinitialiser</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetDataModal;
