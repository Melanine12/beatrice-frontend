import React, { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const OffresEmploi = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterDepartment, setFilterDepartment] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid ou list

  // Données de démonstration
  const offresEmploi = [
    {
      id: 1,
      titre: 'Développeur Full Stack Senior',
      entreprise: 'TechCorp Solutions',
      departement: 'IT',
      type: 'CDI',
      statut: 'Active',
      localisation: 'Paris, France',
      salaire: '4500€ - 6000€',
      experience: '3-5 ans',
      datePublication: '2024-01-15',
      dateExpiration: '2024-02-15',
      candidatures: 24,
      description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant React, Node.js et les dernières technologies.',
      competences: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      avantages: ['Télétravail', 'Formation', 'Mutuelle', 'Tickets restaurant'],
      couleur: 'blue'
    },
    {
      id: 2,
      titre: 'Chef de Projet Marketing Digital',
      entreprise: 'Digital Agency Pro',
      departement: 'Marketing',
      type: 'CDD',
      statut: 'Active',
      localisation: 'Lyon, France',
      salaire: '3500€ - 4500€',
      experience: '2-4 ans',
      datePublication: '2024-01-12',
      dateExpiration: '2024-02-12',
      candidatures: 18,
      description: 'Rejoignez notre équipe marketing pour piloter des campagnes digitales innovantes. Vous serez responsable de la stratégie et de l\'exécution des projets clients.',
      competences: ['Google Analytics', 'Facebook Ads', 'SEO', 'Content Marketing', 'Project Management'],
      avantages: ['Prime performance', 'Formation continue', 'Équipe jeune'],
      couleur: 'green'
    },
    {
      id: 3,
      titre: 'Comptable Senior',
      entreprise: 'Finance Experts',
      departement: 'Finance',
      type: 'CDI',
      statut: 'En attente',
      localisation: 'Marseille, France',
      salaire: '3200€ - 4000€',
      experience: '4-6 ans',
      datePublication: '2024-01-10',
      dateExpiration: '2024-02-10',
      candidatures: 12,
      description: 'Nous cherchons un comptable expérimenté pour gérer la comptabilité générale et les déclarations fiscales de nos clients PME.',
      competences: ['Sage', 'Excel', 'Fiscalité', 'Comptabilité générale', 'Déclarations TVA'],
      avantages: ['Horaires flexibles', 'Mutuelle', 'Prévoyance'],
      couleur: 'purple'
    },
    {
      id: 4,
      titre: 'Designer UX/UI',
      entreprise: 'Creative Studio',
      departement: 'Design',
      type: 'Stage',
      statut: 'Active',
      localisation: 'Toulouse, France',
      salaire: '800€ - 1000€',
      experience: '0-2 ans',
      datePublication: '2024-01-08',
      dateExpiration: '2024-02-08',
      candidatures: 35,
      description: 'Stage de 6 mois pour un designer créatif souhaitant développer ses compétences en UX/UI. Vous travaillerez sur des projets variés pour nos clients.',
      competences: ['Figma', 'Adobe Creative Suite', 'Prototypage', 'User Research', 'Design System'],
      avantages: ['Formation', 'Encadrement', 'Projets variés'],
      couleur: 'orange'
    },
    {
      id: 5,
      titre: 'Responsable Commercial',
      entreprise: 'Sales Dynamics',
      departement: 'Commercial',
      type: 'CDI',
      statut: 'Expirée',
      localisation: 'Nantes, France',
      salaire: '4000€ - 5500€',
      experience: '5-8 ans',
      datePublication: '2023-12-20',
      dateExpiration: '2024-01-20',
      candidatures: 8,
      description: 'Poste de responsable commercial pour développer notre portefeuille clients B2B. Vous encadrerez une équipe de 3 commerciaux et serez responsable des objectifs de vente.',
      competences: ['Management', 'CRM', 'Négociation', 'Stratégie commerciale', 'Reporting'],
      avantages: ['Commission', 'Voiture de fonction', 'Mutuelle'],
      couleur: 'red'
    },
    {
      id: 6,
      titre: 'Développeur Mobile React Native',
      entreprise: 'AppTech Solutions',
      departement: 'IT',
      type: 'CDI',
      statut: 'Active',
      localisation: 'Remote',
      salaire: '3800€ - 5000€',
      experience: '2-4 ans',
      datePublication: '2024-01-05',
      dateExpiration: '2024-02-05',
      candidatures: 15,
      description: 'Développeur mobile expérimenté pour créer des applications iOS et Android avec React Native. Télétravail possible.',
      competences: ['React Native', 'JavaScript', 'iOS', 'Android', 'API REST'],
      avantages: ['100% Télétravail', 'Matériel fourni', 'Formation'],
      couleur: 'blue'
    }
  ];

  const departements = [
    'IT', 'Marketing', 'Finance', 'Design', 'Commercial', 'RH', 'Production', 'Logistique'
  ];

  const typesContrat = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'];
  const statuts = ['Active', 'En attente', 'Expirée', 'Brouillon'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expirée':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'CDI':
        return 'bg-blue-100 text-blue-800';
      case 'CDD':
        return 'bg-orange-100 text-orange-800';
      case 'Stage':
        return 'bg-purple-100 text-purple-800';
      case 'Freelance':
        return 'bg-green-100 text-green-800';
      case 'Alternance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (departement) => {
    switch (departement) {
      case 'IT':
        return 'bg-blue-100 text-blue-800';
      case 'Marketing':
        return 'bg-green-100 text-green-800';
      case 'Finance':
        return 'bg-purple-100 text-purple-800';
      case 'Design':
        return 'bg-pink-100 text-pink-800';
      case 'Commercial':
        return 'bg-orange-100 text-orange-800';
      case 'RH':
        return 'bg-indigo-100 text-indigo-800';
      case 'Production':
        return 'bg-gray-100 text-gray-800';
      case 'Logistique':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOffres = offresEmploi.filter(offre => {
    const matchesSearch = !searchTerm || 
      offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.localisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || offre.statut === filterStatus;
    const matchesDepartment = filterDepartment === 'tous' || offre.departement === filterDepartment;
    const matchesType = filterType === 'tous' || offre.type === filterType;
    return matchesSearch && matchesStatus && matchesDepartment && matchesType;
  });

  const stats = {
    totalOffres: offresEmploi.length,
    offresActives: offresEmploi.filter(o => o.statut === 'Active').length,
    totalCandidatures: offresEmploi.reduce((sum, offre) => sum + offre.candidatures, 0),
    offresExpirees: offresEmploi.filter(o => o.statut === 'Expirée').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const isExpiringSoon = (dateExpiration) => {
    const today = new Date();
    const expiration = new Date(dateExpiration);
    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Offres d'Emploi</h1>
        <p className="text-gray-600">Gestion des offres d'emploi et du processus de recrutement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Offres</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOffres}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offres Actives</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offresActives}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidatures</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCandidatures}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offres Expirées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offresExpirees}</p>
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
                  placeholder="Rechercher par titre, entreprise ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les départements</option>
                {departements.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les types</option>
                {typesContrat.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvelle Offre
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredOffres.length} offre(s) trouvée(s)
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
              {filteredOffres.map((offre) => (
                <div key={offre.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{offre.titre}</h3>
                      <p className="text-sm text-gray-600 mb-2">{offre.entreprise}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offre.statut)}`}>
                          {offre.statut}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(offre.type)}`}>
                          {offre.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(offre.departement)}`}>
                          {offre.departement}
                        </span>
                      </div>
                    </div>
                    {isExpiringSoon(offre.dateExpiration) && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {offre.localisation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      {offre.salaire}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {offre.experience}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      {offre.candidatures} candidatures
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{offre.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Publié le {formatDate(offre.datePublication)}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOffres.map((offre) => (
                <div key={offre.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{offre.titre}</h3>
                        <p className="text-sm text-gray-600">{offre.entreprise} • {offre.localisation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offre.statut)}`}>
                          {offre.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(offre.type)}`}>
                          {offre.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(offre.departement)}`}>
                          {offre.departement}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{offre.salaire}</p>
                        <p className="text-xs text-gray-500">{offre.candidatures} candidatures</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">{offre.description}</p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Publié le {formatDate(offre.datePublication)} • Expire le {formatDate(offre.dateExpiration)}</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle Offre d'Emploi</h3>
            <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement...</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffresEmploi;
