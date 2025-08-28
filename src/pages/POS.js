import React, { useState } from 'react';
import { 
  ShoppingCartIcon, 
  ClockIcon, 
  CalculatorIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import POSInterface from '../components/POS/POSInterface';
import TransactionHistory from '../components/POS/TransactionHistory';
import POSCalculator from '../components/POS/POSCalculator';
import POSStats from '../components/POS/POSStats';

const POS = () => {
  const [activeTab, setActiveTab] = useState('pos');

  const tabs = [
    { id: 'pos', name: 'Point de Vente', icon: ShoppingCartIcon },
    { id: 'history', name: 'Historique', icon: ClockIcon },
    { id: 'calculator', name: 'Calculatrice', icon: CalculatorIcon },
    { id: 'reports', name: 'Rapports', icon: ChartBarIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POSInterface />;
      case 'history':
        return <TransactionHistory />;
      case 'calculator':
        return (
          <div className="max-w-md mx-auto">
            <POSCalculator onAmountChange={(amount) => console.log('Montant:', amount)} />
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Rapports et Statistiques
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Fonctionnalité en cours de développement
            </p>
          </div>
        );
      default:
        return <POSInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Système POS(Front Office)
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Point de Perception et Gestion des Encaissements
          </p>
        </div>

        {/* Onglets */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 mb-8 max-w-4xl mx-auto">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Statistiques rapides */}
        <POSStats />

        {/* Contenu des onglets */}
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default POS;
