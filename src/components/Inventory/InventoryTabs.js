import React from 'react';
import { 
  CubeIcon, 
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  TruckIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const InventoryTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'inventory'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <CubeIcon className="w-5 h-5 inline mr-2" />
          Inventaire
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'stock'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <ClipboardDocumentListIcon className="w-5 h-5 inline mr-2" />
          Stock
        </button>
        <button
          onClick={() => setActiveTab('fournisseurs')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'fournisseurs'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <BuildingStorefrontIcon className="w-5 h-5 inline mr-2" />
          Fournisseurs
        </button>
        <button
          onClick={() => setActiveTab('achats')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'achats'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
          Achats
        </button>
        <button
          onClick={() => setActiveTab('mouvements')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'mouvements'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <TruckIcon className="w-5 h-5 inline mr-2" />
          Mouvements
        </button>
        <button
          onClick={() => setActiveTab('entrepots')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'entrepots'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
          Entrepôts & Dépôts
        </button>
      </nav>
    </div>
  );
};

export default InventoryTabs; 