import React from 'react';

const PaymentStats = ({ stats }) => {
  // Fonction pour formater les montants
  const formatAmount = (amount, currency = 'FC') => {
    const supportedCurrencies = ['EUR', 'USD', 'GBP', 'JPY'];
    
    if (supportedCurrencies.includes(currency)) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } else {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount) + ' ' + currency;
    }
  };

  const statItems = [
    {
      name: 'Total',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'En attente',
      value: stats.enAttente,
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Validés',
      value: stats.valides,
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Rejetés',
      value: stats.rejetes,
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      name: 'Annulés',
      value: stats.annules,
      icon: (
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-gray-500',
      textColor: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  {item.icon}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {item.name}
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </dd>
                </dl>
              </div>
            </div>
            
            {/* Barre de progression pour le total */}
            {item.name === 'Total' && stats.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progression</span>
                  <span>{Math.round((stats.valides / stats.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.valides / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Montants par devise */}
            {stats.montantsParDevise && Object.keys(stats.montantsParDevise).length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Montants par devise:
                </div>
                {Object.entries(stats.montantsParDevise).map(([devise, montants]) => {
                  // Mapper le nom de la statistique vers la clé dans montantsParDevise
                  let montantKey = 'total';
                  if (item.name === 'En attente') montantKey = 'enAttente';
                  else if (item.name === 'Validés') montantKey = 'valides';
                  else if (item.name === 'Rejetés') montantKey = 'rejetes';
                  else if (item.name === 'Annulés') montantKey = 'annules';
                  
                  return (
                    <div key={devise} className="text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">{devise}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatAmount(montants[montantKey] || 0, devise)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStats; 