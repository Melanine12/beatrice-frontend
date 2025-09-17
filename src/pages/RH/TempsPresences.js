import React, { useState } from 'react';
import { Pointage, CongesAbsences, Planning, HeuresSupplementaires } from './index';

const TempsPresences = () => {
  const [activeTab, setActiveTab] = useState('pointage');

  const tabs = [
    { id: 'pointage', name: 'Pointage', component: Pointage },
    { id: 'conges-absences', name: 'Congés & Absences', component: CongesAbsences },
    { id: 'planning', name: 'Planning', component: Planning },
    { id: 'heures-supplementaires', name: 'Heures Supplémentaires', component: HeuresSupplementaires }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Temps & Présences
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestion du temps de travail, des présences et des plannings
        </p>
      </div>

      {/* Onglets */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default TempsPresences;
