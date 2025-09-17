import React from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  BanknotesIcon,
  ChartBarIcon,
  MegaphoneIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const RHDashboard = () => {
  const sections = [
    {
      name: 'Gestion des Employés',
      description: 'Dossiers personnels, organigramme, contrats et historique',
      href: '/rh/gestion-employes',
      icon: UsersIcon,
      color: 'blue',
      stats: { total: 25, pending: 3 }
    },
    {
      name: 'Recrutement & Intégration',
      description: 'Offres d\'emploi, candidatures et processus d\'intégration',
      href: '/rh/recrutement-integration',
      icon: BriefcaseIcon,
      color: 'green',
      stats: { total: 8, pending: 2 }
    },
    {
      name: 'Temps & Présences',
      description: 'Pointage, congés, planning et heures supplémentaires',
      href: '/rh/temps-presences',
      icon: ClockIcon,
      color: 'yellow',
      stats: { total: 15, pending: 5 }
    },
    {
      name: 'Paie & Avantages',
      description: 'Bulletins de paie, avantages sociaux et remboursements',
      href: '/rh/paie-avantages',
      icon: BanknotesIcon,
      color: 'purple',
      stats: { total: 12, pending: 1 }
    },
    {
      name: 'Performance & Formation',
      description: 'Évaluations, objectifs, formations et compétences',
      href: '/rh/performance-formation',
      icon: ChartBarIcon,
      color: 'indigo',
      stats: { total: 18, pending: 4 }
    },
    {
      name: 'Communication RH',
      description: 'Annonces, sondages, événements et politiques RH',
      href: '/rh/communication-rh',
      icon: MegaphoneIcon,
      color: 'pink',
      stats: { total: 6, pending: 2 }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      green: 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300',
      yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
      pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ressources Humaines
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestion complète des ressources humaines de l'entreprise
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Employés
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  25
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Demandes en attente
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  17
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Évaluations terminées
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  12
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MegaphoneIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Événements à venir
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  3
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Sections RH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.name}
              to={section.href}
              className="group bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(section.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {section.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {section.description}
              </p>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Total: {section.stats.total}
                </span>
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  {section.stats.pending} en attente
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/rh/gestion-employes"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
          >
            Nouvel employé
          </Link>
          <Link
            to="/rh/recrutement-integration"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            Nouvelle offre
          </Link>
          <Link
            to="/rh/temps-presences"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-center"
          >
            Gérer les congés
          </Link>
          <Link
            to="/rh/performance-formation"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            Nouvelle évaluation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RHDashboard;
