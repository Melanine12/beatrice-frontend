import React, { useState, useEffect } from 'react';
import {
  GiftIcon,
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
  HeartIcon,
  HomeIcon,
  TruckIcon,
  ShieldCheckIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const AvantagesSociaux = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedAvantage, setSelectedAvantage] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Données de démonstration
  const avantagesSociaux = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      type: 'Mutuelle santé',
      statut: 'Actif',
      montant: 45.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Couverture santé complète avec remboursement à 100%',
      beneficiaire: 'Pierre Bernard + famille',
      prestataire: 'Mutuelle Entreprise',
      contact: '01 23 45 67 89',
      email: 'contact@mutuelle-entreprise.fr',
      commentaires: 'Couverture familiale incluse',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      type: 'Tickets restaurant',
      statut: 'Actif',
      montant: 8.00,
      frequence: 'Quotidien',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Tickets restaurant d\'une valeur de 8€ par jour travaillé',
      beneficiaire: 'Isabella Garcia',
      prestataire: 'Edenred',
      contact: '01 23 45 67 90',
      email: 'contact@edenred.fr',
      commentaires: 'Utilisables dans tous les restaurants partenaires',
      couleur: 'green'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      type: 'Voiture de fonction',
      statut: 'Actif',
      montant: 350.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Voiture de fonction avec carburant inclus',
      beneficiaire: 'Alexandre Dubois',
      prestataire: 'Fleet Management',
      contact: '01 23 45 67 91',
      email: 'contact@fleet-mgmt.fr',
      commentaires: 'Renouvelable annuellement',
      couleur: 'green'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      type: 'Chèques vacances',
      statut: 'Actif',
      montant: 200.00,
      frequence: 'Annuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Chèques vacances d\'une valeur de 200€ par an',
      beneficiaire: 'Sophie Martin + famille',
      prestataire: 'ANCV',
      contact: '01 23 45 67 92',
      email: 'contact@ancv.fr',
      commentaires: 'Utilisables pour les vacances et loisirs',
      couleur: 'green'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      type: 'Télétravail',
      statut: 'Actif',
      montant: 50.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Indemnité télétravail pour frais de bureau',
      beneficiaire: 'Thomas Moreau',
      prestataire: 'Entreprise',
      contact: 'N/A',
      email: 'N/A',
      commentaires: 'Indemnité forfaitaire pour frais de télétravail',
      couleur: 'green'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      type: 'Formation',
      statut: 'Actif',
      montant: 1000.00,
      frequence: 'Annuel',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      description: 'Budget formation de 1000€ par an',
      beneficiaire: 'Marie Dubois',
      prestataire: 'Centre de Formation',
      contact: '01 23 45 67 93',
      email: 'contact@formation.fr',
      commentaires: 'Formations professionnelles et certifications',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      type: 'Gym',
      statut: 'Actif',
      montant: 30.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Abonnement salle de sport',
      beneficiaire: 'Lucas Rousseau',
      prestataire: 'Fitness Club',
      contact: '01 23 45 67 94',
      email: 'contact@fitness-club.fr',
      commentaires: 'Accès illimité à tous les équipements',
      couleur: 'green'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      type: 'Transport',
      statut: 'Actif',
      montant: 40.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Remboursement 50% des frais de transport',
      beneficiaire: 'Emma Petit',
      prestataire: 'Entreprise',
      contact: 'N/A',
      email: 'N/A',
      commentaires: 'Remboursement sur présentation des justificatifs',
      couleur: 'green'
    },
    {
      id: 9,
      employeId: 9,
      employeNom: 'Jean Dupont',
      employeEmail: 'jean.dupont@email.com',
      departement: 'Commercial',
      poste: 'Commercial Senior',
      type: 'Prime de performance',
      statut: 'Actif',
      montant: 500.00,
      frequence: 'Trimestriel',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Prime de performance basée sur les ventes',
      beneficiaire: 'Jean Dupont',
      prestataire: 'Entreprise',
      contact: 'N/A',
      email: 'N/A',
      commentaires: 'Prime variable selon les objectifs atteints',
      couleur: 'green'
    },
    {
      id: 10,
      employeId: 10,
      employeNom: 'Sarah Johnson',
      employeEmail: 'sarah.johnson@email.com',
      departement: 'Production',
      poste: 'Chef d\'équipe Production',
      type: 'Assurance décès',
      statut: 'Actif',
      montant: 15.00,
      frequence: 'Mensuel',
      dateDebut: '2024-01-01',
      dateFin: null,
      description: 'Assurance décès et invalidité',
      beneficiaire: 'Sarah Johnson + famille',
      prestataire: 'Assurance Entreprise',
      contact: '01 23 45 67 95',
      email: 'contact@assurance-entreprise.fr',
      commentaires: 'Couverture familiale incluse',
      couleur: 'green'
    }
  ];

  const types = ['Mutuelle santé', 'Tickets restaurant', 'Voiture de fonction', 'Chèques vacances', 'Télétravail', 'Formation', 'Gym', 'Transport', 'Prime de performance', 'Assurance décès'];
  const statuts = ['Actif', 'Suspendu', 'Expiré', 'En attente'];
  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Mutuelle santé':
        return 'bg-green-100 text-green-800';
      case 'Tickets restaurant':
        return 'bg-blue-100 text-blue-800';
      case 'Voiture de fonction':
        return 'bg-purple-100 text-purple-800';
      case 'Chèques vacances':
        return 'bg-orange-100 text-orange-800';
      case 'Télétravail':
        return 'bg-pink-100 text-pink-800';
      case 'Formation':
        return 'bg-indigo-100 text-indigo-800';
      case 'Gym':
        return 'bg-red-100 text-red-800';
      case 'Transport':
        return 'bg-yellow-100 text-yellow-800';
      case 'Prime de performance':
        return 'bg-emerald-100 text-emerald-800';
      case 'Assurance décès':
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
      case 'Mutuelle santé':
        return <HeartIcon className="h-5 w-5" />;
      case 'Tickets restaurant':
        return <GiftIcon className="h-5 w-5" />;
      case 'Voiture de fonction':
        return <TruckIcon className="h-5 w-5" />;
      case 'Chèques vacances':
        return <HomeIcon className="h-5 w-5" />;
      case 'Télétravail':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'Formation':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'Gym':
        return <StarIcon className="h-5 w-5" />;
      case 'Transport':
        return <TruckIcon className="h-5 w-5" />;
      case 'Prime de performance':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'Assurance décès':
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <GiftIcon className="h-5 w-5" />;
    }
  };

  const filteredAvantages = avantagesSociaux.filter(avantage => {
    const matchesSearch = !searchTerm || 
      avantage.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avantage.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avantage.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avantage.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avantage.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || avantage.type === filterType;
    const matchesStatut = filterStatut === 'tous' || avantage.statut === filterStatut;
    const matchesDepartement = filterDepartement === 'tous' || avantage.departement === filterDepartement;
    return matchesSearch && matchesType && matchesStatut && matchesDepartement;
  });

  const stats = {
    totalAvantages: avantagesSociaux.length,
    actifs: avantagesSociaux.filter(a => a.statut === 'Actif').length,
    suspendus: avantagesSociaux.filter(a => a.statut === 'Suspendu').length,
    expires: avantagesSociaux.filter(a => a.statut === 'Expiré').length,
    totalMontant: avantagesSociaux
      .filter(a => a.statut === 'Actif')
      .reduce((sum, a) => sum + a.montant, 0),
    typesUniques: [...new Set(avantagesSociaux.map(a => a.type))].length
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Avantages Sociaux</h1>
        <p className="text-gray-600">Gestion des avantages sociaux et des prestations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GiftIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAvantages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.actifs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspendus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.suspendus}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expirés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expires}</p>
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
              {filteredAvantages.length} avantage(s) trouvé(s)
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
              {filteredAvantages.map((avantage) => (
                <div key={avantage.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(avantage.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {avantage.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{avantage.poste}</p>
                        <p className="text-xs text-gray-500">{avantage.departement}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(avantage.montant)}</p>
                      <p className="text-sm text-gray-500">{avantage.frequence}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(avantage.type)}
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-900">{avantage.type}</h4>
                      <p className="text-sm text-gray-600">{avantage.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bénéficiaire:</span>
                      <span className="font-medium">{avantage.beneficiaire}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Prestataire:</span>
                      <span className="font-medium">{avantage.prestataire}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Début:</span>
                      <span className="font-medium">{formatDate(avantage.dateDebut)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fin:</span>
                      <span className="font-medium">{formatDate(avantage.dateFin)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(avantage.statut)}`}>
                      {avantage.statut}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(avantage.type)}`}>
                      {avantage.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(avantage.departement)}`}>
                      {avantage.departement}
                    </span>
                  </div>

                  {avantage.commentaires && (
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{avantage.commentaires}</p>
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
              {filteredAvantages.map((avantage) => (
                <div key={avantage.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(avantage.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {avantage.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{avantage.poste} - {avantage.departement}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{avantage.type}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(avantage.montant)}</span>
                          <span className="text-sm text-gray-500">{avantage.frequence}</span>
                          <span className="text-sm text-gray-500">{avantage.prestataire}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{avantage.beneficiaire}</p>
                        <p className="text-xs text-gray-500">{formatDate(avantage.dateDebut)} - {formatDate(avantage.dateFin)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(avantage.statut)}`}>
                          {avantage.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(avantage.type)}`}>
                          {avantage.type}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'avantage social</h3>
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

export default AvantagesSociaux;
