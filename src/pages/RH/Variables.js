import React, { useState, useEffect } from 'react';
import {
  CogIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  TruckIcon,
  HomeIcon,
  HeartIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CalculatorIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';

const Variables = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Données de démonstration
  const variables = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      type: 'Prime de performance',
      statut: 'Actif',
      montant: 500.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Prime variable basée sur les objectifs mensuels',
      criteres: ['Objectifs de production', 'Qualité du travail', 'Ponctualité'],
      calcul: 'Montant fixe + bonus selon performance',
      responsable: 'Marie Dubois',
      commentaires: 'Prime standard pour le poste',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      type: 'Prime de projet',
      statut: 'Actif',
      montant: 300.00,
      frequence: 'Par projet',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Prime pour chaque projet livré dans les temps',
      criteres: ['Respect des délais', 'Qualité du design', 'Satisfaction client'],
      calcul: 'Montant fixe par projet + bonus qualité',
      responsable: 'Lucas Rousseau',
      commentaires: 'Prime motivante pour les designers',
      couleur: 'green'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      type: 'Prime technique',
      statut: 'Actif',
      montant: 400.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Prime pour expertise technique et innovation',
      criteres: ['Innovation technique', 'Résolution de bugs', 'Formation équipe'],
      calcul: 'Montant fixe + bonus innovation',
      responsable: 'Thomas Moreau',
      commentaires: 'Reconnaissance de l\'expertise technique',
      couleur: 'green'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      type: 'Prime commerciale',
      statut: 'Actif',
      montant: 600.00,
      frequence: 'Trimestriel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Prime basée sur les résultats commerciaux',
      criteres: ['Chiffre d\'affaires', 'Nouveaux clients', 'Fidélisation'],
      calcul: 'Pourcentage du CA + bonus nouveaux clients',
      responsable: 'Emma Petit',
      commentaires: 'Prime alignée sur les objectifs commerciaux',
      couleur: 'green'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      type: 'Prime de formation',
      statut: 'Actif',
      montant: 200.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Prime pour formation et partage de connaissances',
      criteres: ['Formations suivies', 'Partage d\'expertise', 'Mentorat'],
      calcul: 'Montant fixe + bonus partage',
      responsable: 'Alexandre Dubois',
      commentaires: 'Encouragement à la formation continue',
      couleur: 'green'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      type: 'Prime de management',
      statut: 'Actif',
      montant: 800.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Prime pour gestion d\'équipe et résultats RH',
      criteres: ['Satisfaction équipe', 'Réduction turnover', 'Formation équipe'],
      calcul: 'Montant fixe + bonus satisfaction',
      responsable: 'Sophie Martin',
      commentaires: 'Reconnaissance du rôle managérial',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      type: 'Prime créative',
      statut: 'Suspendu',
      montant: 250.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-06-30',
      description: 'Prime pour créativité et innovation design',
      criteres: ['Innovation créative', 'Reconnaissance client', 'Mentorat junior'],
      calcul: 'Montant fixe + bonus créativité',
      responsable: 'Isabella Garcia',
      commentaires: 'Suspendu temporairement - révision en cours',
      couleur: 'orange'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      type: 'Prime événementielle',
      statut: 'Actif',
      montant: 150.00,
      frequence: 'Par événement',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Prime pour organisation d\'événements réussis',
      criteres: ['Succès événement', 'Participation', 'Retour positif'],
      calcul: 'Montant fixe par événement + bonus succès',
      responsable: 'Sophie Martin',
      commentaires: 'Prime motivante pour les événements',
      couleur: 'green'
    },
    {
      id: 9,
      employeId: 9,
      employeNom: 'Jean Dupont',
      employeEmail: 'jean.dupont@email.com',
      departement: 'Commercial',
      poste: 'Commercial Senior',
      type: 'Commission',
      statut: 'Actif',
      montant: 1200.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Commission sur les ventes réalisées',
      criteres: ['Chiffre d\'affaires', 'Nouveaux clients', 'Objectifs mensuels'],
      calcul: 'Pourcentage du CA + bonus nouveaux clients',
      responsable: 'Sophie Martin',
      commentaires: 'Commission standard pour les commerciaux',
      couleur: 'green'
    },
    {
      id: 10,
      employeId: 10,
      employeNom: 'Sarah Johnson',
      employeEmail: 'sarah.johnson@email.com',
      departement: 'Production',
      poste: 'Chef d\'équipe Production',
      type: 'Prime de production',
      statut: 'Actif',
      montant: 350.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Prime basée sur la productivité et qualité',
      criteres: ['Productivité équipe', 'Qualité production', 'Sécurité'],
      calcul: 'Montant fixe + bonus productivité',
      responsable: 'Pierre Bernard',
      commentaires: 'Prime alignée sur les objectifs production',
      couleur: 'green'
    }
  ];

  const types = ['Prime de performance', 'Prime de projet', 'Prime technique', 'Prime commerciale', 'Prime de formation', 'Prime de management', 'Prime créative', 'Prime événementielle', 'Commission', 'Prime de production'];
  const statuts = ['Actif', 'Suspendu', 'Expiré', 'En attente'];
  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Prime de performance':
        return 'bg-green-100 text-green-800';
      case 'Prime de projet':
        return 'bg-blue-100 text-blue-800';
      case 'Prime technique':
        return 'bg-purple-100 text-purple-800';
      case 'Prime commerciale':
        return 'bg-orange-100 text-orange-800';
      case 'Prime de formation':
        return 'bg-pink-100 text-pink-800';
      case 'Prime de management':
        return 'bg-indigo-100 text-indigo-800';
      case 'Prime créative':
        return 'bg-yellow-100 text-yellow-800';
      case 'Prime événementielle':
        return 'bg-red-100 text-red-800';
      case 'Commission':
        return 'bg-emerald-100 text-emerald-800';
      case 'Prime de production':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Suspendu':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expiré':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartementColor = (departement) => {
    switch (departement) {
      case 'IT':
        return 'bg-blue-100 text-blue-800';
      case 'Marketing':
        return 'bg-green-100 text-green-800';
      case 'Finance':
        return 'bg-purple-100 text-purple-800';
      case 'Design':
        return 'bg-pink-100 text-pink-800';
      case 'RH':
        return 'bg-indigo-100 text-indigo-800';
      case 'Commercial':
        return 'bg-orange-100 text-orange-800';
      case 'Production':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Prime de performance':
        return <StarIcon className="h-5 w-5" />;
      case 'Prime de projet':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'Prime technique':
        return <CogIcon className="h-5 w-5" />;
      case 'Prime commerciale':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'Prime de formation':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'Prime de management':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'Prime créative':
        return <HeartIcon className="h-5 w-5" />;
      case 'Prime événementielle':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'Commission':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'Prime de production':
        return <ChartBarSquareIcon className="h-5 w-5" />;
      default:
        return <CalculatorIcon className="h-5 w-5" />;
    }
  };

  const filteredVariables = variables.filter(variable => {
    const matchesSearch = !searchTerm || 
      variable.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || variable.type === filterType;
    const matchesStatut = filterStatut === 'tous' || variable.statut === filterStatut;
    const matchesDepartement = filterDepartement === 'tous' || variable.departement === filterDepartement;
    return matchesSearch && matchesType && matchesStatut && matchesDepartement;
  });

  const stats = {
    totalVariables: variables.length,
    actives: variables.filter(v => v.statut === 'Actif').length,
    suspendues: variables.filter(v => v.statut === 'Suspendu').length,
    expirees: variables.filter(v => v.statut === 'Expiré').length,
    totalMontant: variables
      .filter(v => v.statut === 'Actif')
      .reduce((sum, v) => sum + v.montant, 0),
    typesUniques: [...new Set(variables.map(v => v.type))].length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getInitials = (nom) => {
    return nom.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Variables</h1>
        <p className="text-gray-600">Gestion des primes variables et des commissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalculatorIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVariables}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-gray-900">{stats.actives}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspendues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.suspendues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expirées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expirees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalMontant)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Types</p>
              <p className="text-2xl font-bold text-gray-900">{stats.typesUniques}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par employé, type, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterDepartement}
                onChange={(e) => setFilterDepartement(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les départements</option>
                {departements.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredVariables.length} variable(s) trouvée(s)
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVariables.map((variable) => (
                <div key={variable.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(variable.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {variable.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{variable.poste}</p>
                        <p className="text-xs text-gray-500">{variable.departement}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(variable.montant)}</p>
                      <p className="text-sm text-gray-500">{variable.frequence}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(variable.type)}
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-900">{variable.type}</h4>
                      <p className="text-sm text-gray-600">{variable.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Calcul:</span>
                      <span className="font-medium">{variable.calcul}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Responsable:</span>
                      <span className="font-medium">{variable.responsable}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Début:</span>
                      <span className="font-medium">{formatDate(variable.dateDebut)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fin:</span>
                      <span className="font-medium">{formatDate(variable.dateFin)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Critères:</span>
                      <span className="font-medium">{variable.criteres.length} critère(s)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(variable.statut)}`}>
                      {variable.statut}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(variable.type)}`}>
                      {variable.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(variable.departement)}`}>
                      {variable.departement}
                    </span>
                  </div>

                  {variable.commentaires && (
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{variable.commentaires}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="flex-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="flex-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVariables.map((variable) => (
                <div key={variable.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(variable.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {variable.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{variable.poste} - {variable.departement}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{variable.type}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(variable.montant)}</span>
                          <span className="text-sm text-gray-500">{variable.frequence}</span>
                          <span className="text-sm text-gray-500">{variable.responsable}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{variable.calcul}</p>
                        <p className="text-xs text-gray-500">{formatDate(variable.dateDebut)} - {formatDate(variable.dateFin)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(variable.statut)}`}>
                          {variable.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(variable.type)}`}>
                          {variable.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la variable</h3>
            <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement...</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Variables;
