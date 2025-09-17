import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const HistoriqueRH = () => {
  const [activeTab, setActiveTab] = useState('activites');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('30j');
  const [filterType, setFilterType] = useState('tous');
  const [selectedEmploye, setSelectedEmploye] = useState(null);

  // Données de démonstration
  const employes = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      departement: 'IT',
      poste: 'Développeur Senior'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Marie',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      departement: 'RH',
      poste: 'Responsable RH'
    },
    {
      id: 3,
      nom: 'Bernard',
      prenom: 'Pierre',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      departement: 'Finance',
      poste: 'Comptable'
    },
    {
      id: 4,
      nom: 'Leroy',
      prenom: 'Sophie',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      departement: 'Marketing',
      poste: 'Chef de Projet'
    },
    {
      id: 5,
      nom: 'Moreau',
      prenom: 'Thomas',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      departement: 'IT',
      poste: 'Développeur'
    }
  ];

  const activites = [
    {
      id: 1,
      employeId: 1,
      type: 'Embauche',
      description: 'Nouvel employé embauché',
      date: '2024-01-15T09:30:00',
      statut: 'Terminé',
      details: 'Contrat CDI signé, intégration programmée',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      type: 'Promotion',
      description: 'Promotion au poste de Responsable RH',
      date: '2024-01-10T14:20:00',
      statut: 'Terminé',
      details: 'Augmentation de salaire de 15%',
      couleur: 'blue'
    },
    {
      id: 3,
      employeId: 3,
      type: 'Formation',
      description: 'Formation comptabilité avancée',
      date: '2024-01-08T10:00:00',
      statut: 'En cours',
      details: 'Formation de 3 jours à Paris',
      couleur: 'yellow'
    },
    {
      id: 4,
      employeId: 4,
      type: 'Congé',
      description: 'Demande de congés annuels',
      date: '2024-01-05T16:45:00',
      statut: 'Approuvé',
      details: 'Congés du 15 au 22 février 2024',
      couleur: 'green'
    },
    {
      id: 5,
      employeId: 5,
      type: 'Évaluation',
      description: 'Évaluation annuelle',
      date: '2024-01-03T11:15:00',
      statut: 'En attente',
      details: 'Entretien programmé le 20 janvier',
      couleur: 'orange'
    },
    {
      id: 6,
      employeId: 1,
      type: 'Changement',
      description: 'Changement de département',
      date: '2023-12-20T13:30:00',
      statut: 'Terminé',
      details: 'Transfert de IT vers Marketing',
      couleur: 'purple'
    },
    {
      id: 7,
      employeId: 2,
      type: 'Formation',
      description: 'Certification RH',
      date: '2023-12-15T09:00:00',
      statut: 'Terminé',
      details: 'Certification obtenue avec mention',
      couleur: 'green'
    },
    {
      id: 8,
      employeId: 3,
      type: 'Avertissement',
      description: 'Retard répété',
      date: '2023-12-10T14:00:00',
      statut: 'Archivé',
      details: 'Avertissement verbal donné',
      couleur: 'red'
    }
  ];

  const changements = [
    {
      id: 1,
      employeId: 1,
      type: 'Salaire',
      ancienneValeur: '4000€',
      nouvelleValeur: '4500€',
      date: '2024-01-15',
      raison: 'Promotion',
      statut: 'Approuvé'
    },
    {
      id: 2,
      employeId: 2,
      type: 'Poste',
      ancienneValeur: 'Assistant RH',
      nouvelleValeur: 'Responsable RH',
      date: '2024-01-10',
      raison: 'Promotion interne',
      statut: 'Approuvé'
    },
    {
      id: 3,
      employeId: 3,
      type: 'Département',
      ancienneValeur: 'Comptabilité',
      nouvelleValeur: 'Finance',
      date: '2023-12-20',
      raison: 'Réorganisation',
      statut: 'Approuvé'
    },
    {
      id: 4,
      employeId: 4,
      type: 'Temps de travail',
      ancienneValeur: 'Temps plein',
      nouvelleValeur: 'Temps partiel 80%',
      date: '2023-12-01',
      raison: 'Demande personnelle',
      statut: 'En attente'
    },
    {
      id: 5,
      employeId: 5,
      type: 'Salaire',
      ancienneValeur: '2500€',
      nouvelleValeur: '2800€',
      date: '2023-11-15',
      raison: 'Augmentation annuelle',
      statut: 'Approuvé'
    }
  ];

  const statistiques = [
    {
      id: 1,
      employeId: 1,
      type: 'Heures travaillées',
      valeur: '160h',
      periode: 'Janvier 2024',
      evolution: '+5%',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      type: 'Formations suivies',
      valeur: '3',
      periode: '2023',
      evolution: '+50%',
      couleur: 'blue'
    },
    {
      id: 3,
      employeId: 3,
      type: 'Retards',
      valeur: '2',
      periode: 'Janvier 2024',
      evolution: '-60%',
      couleur: 'green'
    },
    {
      id: 4,
      employeId: 4,
      type: 'Projets terminés',
      valeur: '8',
      periode: '2023',
      evolution: '+25%',
      couleur: 'purple'
    },
    {
      id: 5,
      employeId: 5,
      type: 'Absences',
      valeur: '3j',
      periode: 'Janvier 2024',
      evolution: '+1j',
      couleur: 'orange'
    }
  ];

  const getEmployeById = (id) => employes.find(emp => emp.id === id);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Terminé':
      case 'Approuvé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En attente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Archivé':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Embauche':
        return 'bg-green-100 text-green-800';
      case 'Promotion':
        return 'bg-blue-100 text-blue-800';
      case 'Formation':
        return 'bg-purple-100 text-purple-800';
      case 'Congé':
        return 'bg-yellow-100 text-yellow-800';
      case 'Évaluation':
        return 'bg-orange-100 text-orange-800';
      case 'Changement':
        return 'bg-indigo-100 text-indigo-800';
      case 'Avertissement':
        return 'bg-red-100 text-red-800';
      case 'Salaire':
        return 'bg-green-100 text-green-800';
      case 'Poste':
        return 'bg-blue-100 text-blue-800';
      case 'Département':
        return 'bg-purple-100 text-purple-800';
      case 'Temps de travail':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEvolutionColor = (evolution) => {
    if (evolution.startsWith('+')) return 'text-green-600';
    if (evolution.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const filteredActivites = activites.filter(activite => {
    const employe = getEmployeById(activite.employeId);
    const matchesSearch = !searchTerm || 
      employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activite.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || activite.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredChangements = changements.filter(changement => {
    const employe = getEmployeById(changement.employeId);
    const matchesSearch = !searchTerm || 
      employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      changement.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || changement.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredStatistiques = statistiques.filter(stat => {
    const employe = getEmployeById(stat.employeId);
    const matchesSearch = !searchTerm || 
      employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    totalActivites: activites.length,
    activitesTerminees: activites.filter(a => a.statut === 'Terminé').length,
    changementsApprouves: changements.filter(c => c.statut === 'Approuvé').length,
    totalChangements: changements.length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique RH</h1>
        <p className="text-gray-600">Suivi des activités et changements des employés</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activités</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalActivites}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activités Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activitesTerminees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowPathIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Changements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalChangements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Changements Approuvés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.changementsApprouves}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('activites')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activités
            </button>
            <button
              onClick={() => setActiveTab('changements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'changements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Changements
            </button>
            <button
              onClick={() => setActiveTab('statistiques')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistiques'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistiques
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par employé, activité ou type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7j">7 derniers jours</option>
                <option value="30j">30 derniers jours</option>
                <option value="90j">90 derniers jours</option>
                <option value="1a">1 an</option>
                <option value="tout">Tout</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les types</option>
                <option value="Embauche">Embauche</option>
                <option value="Promotion">Promotion</option>
                <option value="Formation">Formation</option>
                <option value="Congé">Congé</option>
                <option value="Évaluation">Évaluation</option>
                <option value="Changement">Changement</option>
                <option value="Avertissement">Avertissement</option>
                <option value="Salaire">Salaire</option>
                <option value="Poste">Poste</option>
                <option value="Département">Département</option>
                <option value="Temps de travail">Temps de travail</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'activites' && (
            <div className="space-y-4">
              {filteredActivites.map((activite) => {
                const employe = getEmployeById(activite.employeId);
                return (
                  <div key={activite.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employe.avatar}
                          alt={`${employe.prenom} ${employe.nom}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {employe.prenom} {employe.nom}
                          </h3>
                          <p className="text-sm text-gray-600">{employe.poste} - {employe.departement}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(activite.type)}`}>
                          {activite.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(activite.statut)}`}>
                          {activite.statut}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(activite.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activite.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 font-medium">{activite.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{activite.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'changements' && (
            <div className="space-y-4">
              {filteredChangements.map((changement) => {
                const employe = getEmployeById(changement.employeId);
                return (
                  <div key={changement.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employe.avatar}
                          alt={`${employe.prenom} ${employe.nom}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {employe.prenom} {employe.nom}
                          </h3>
                          <p className="text-sm text-gray-600">{employe.poste} - {employe.departement}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(changement.type)}`}>
                          {changement.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(changement.statut)}`}>
                          {changement.statut}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(changement.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Ancienne valeur:</span>
                          <span className="ml-2 font-medium text-gray-900">{changement.ancienneValeur}</span>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="text-sm">
                          <span className="text-gray-500">Nouvelle valeur:</span>
                          <span className="ml-2 font-medium text-gray-900">{changement.nouvelleValeur}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Raison: {changement.raison}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'statistiques' && (
            <div className="space-y-4">
              {filteredStatistiques.map((stat) => {
                const employe = getEmployeById(stat.employeId);
                return (
                  <div key={stat.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employe.avatar}
                          alt={`${employe.prenom} ${employe.nom}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {employe.prenom} {employe.nom}
                          </h3>
                          <p className="text-sm text-gray-600">{employe.poste} - {employe.departement}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{stat.valeur}</p>
                          <p className="text-sm text-gray-500">{stat.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{stat.periode}</p>
                          <p className={`text-sm font-medium ${getEvolutionColor(stat.evolution)}`}>
                            {stat.evolution}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {stat.evolution.startsWith('+') ? (
                            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                          ) : stat.evolution.startsWith('-') ? (
                            <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                          ) : (
                            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoriqueRH;
