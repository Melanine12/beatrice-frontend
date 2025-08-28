import React from 'react';
import { 
  CurrencyEuroIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const POSStats = () => {
  const stats = [
    {
      name: 'Chiffre d\'affaires du jour',
      value: '1,247.80€',
      change: '+12.5%',
      changeType: 'positive',
      icon: CurrencyEuroIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Transactions du jour',
      value: '47',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Paiements par carte',
      value: '32',
      change: '+15.3%',
      changeType: 'positive',
      icon: CreditCardIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Paiements en espèces',
      value: '15',
      change: '-2.1%',
      changeType: 'negative',
      icon: BanknotesIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Panier moyen',
      value: '26.55€',
      change: '+5.7%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'Temps moyen de transaction',
      value: '2m 34s',
      change: '-8.9%',
      changeType: 'positive',
      icon: ClockIcon,
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="pos-stats-card bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                vs hier
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default POSStats;
