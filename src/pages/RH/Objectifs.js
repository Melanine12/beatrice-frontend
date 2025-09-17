import React, { useState, useEffect } from 'react';
import {
  FlagIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ArrowDownTrayIcon,
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
  ChartBarSquareIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const Objectifs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [filterPeriode, setFilterPeriode] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedObjectif, setSelectedObjectif] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Données de démonstration
  const objectifs = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      type: 'Objectif quantitatif',
      statut: 'En cours',
      titre: 'Amélioration de la précision comptable',
      description: 'Réduire les erreurs comptables de 20% et améliorer la rapidité de traitement',
      valeurCible: 100,
      valeurActuelle: 75,
      unite: '%',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Haute',
      responsable: 'Marie Dubois',
      commentaires: 'Objectif ambitieux mais réalisable',
      couleur: 'orange'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      type: 'Objectif qualitatif',
      statut: 'Atteint',
      titre: 'Amélioration de l\'expérience utilisateur',
      description: 'Créer des interfaces plus intuitives et accessibles',
      valeurCible: 5,
      valeurActuelle: 5,
      unite: '/5',
      dateDebut: '2024-01-01',
      dateFin: '2024-06-30',
      priorite: 'Moyenne',
      responsable: 'Lucas Rousseau',
      commentaires: 'Excellent travail sur l\'UX',
      couleur: 'green'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      type: 'Objectif quantitatif',
      statut: 'En cours',
      titre: 'Réduction des bugs en production',
      description: 'Diminuer le nombre de bugs critiques de 50%',
      valeurCible: 10,
      valeurActuelle: 3,
      unite: 'bugs',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Haute',
      responsable: 'Thomas Moreau',
      commentaires: 'Très bon progrès, objectif en voie d\'être atteint',
      couleur: 'green'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      type: 'Objectif quantitatif',
      statut: 'En retard',
      titre: 'Augmentation du chiffre d\'affaires',
      description: 'Augmenter le CA de 15% grâce aux campagnes marketing',
      valeurCible: 500000,
      valeurActuelle: 200000,
      unite: '€',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Haute',
      responsable: 'Emma Petit',
      commentaires: 'Difficultés rencontrées, révision nécessaire',
      couleur: 'red'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      type: 'Objectif qualitatif',
      statut: 'En cours',
      titre: 'Formation de l\'équipe mobile',
      description: 'Former 3 développeurs juniors aux technologies mobiles',
      valeurCible: 3,
      valeurActuelle: 2,
      unite: 'personnes',
      dateDebut: '2024-01-01',
      dateFin: '2024-09-30',
      priorite: 'Moyenne',
      responsable: 'Alexandre Dubois',
      commentaires: 'Formation en cours, bon rythme',
      couleur: 'orange'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      type: 'Objectif quantitatif',
      statut: 'Atteint',
      titre: 'Réduction du turnover',
      description: 'Réduire le taux de turnover de 30%',
      valeurCible: 5,
      valeurActuelle: 3,
      unite: '%',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Haute',
      responsable: 'Sophie Martin',
      commentaires: 'Objectif dépassé, excellent travail',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      type: 'Objectif qualitatif',
      statut: 'En cours',
      titre: 'Innovation design',
      description: 'Développer de nouveaux concepts créatifs',
      valeurCible: 10,
      valeurActuelle: 7,
      unite: 'concepts',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Moyenne',
      responsable: 'Isabella Garcia',
      commentaires: 'Créativité remarquable',
      couleur: 'orange'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      type: 'Objectif quantitatif',
      statut: 'En cours',
      titre: 'Augmentation de la visibilité',
      description: 'Augmenter la visibilité de la marque de 40%',
      valeurCible: 1000000,
      valeurActuelle: 650000,
      unite: 'impressions',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Moyenne',
      responsable: 'Sophie Martin',
      commentaires: 'Bonne progression, objectif atteignable',
      couleur: 'orange'
    },
    {
      id: 9,
      employeId: 9,
      employeNom: 'Jean Dupont',
      employeEmail: 'jean.dupont@email.com',
      departement: 'Commercial',
      poste: 'Commercial Senior',
      type: 'Objectif quantitatif',
      statut: 'Atteint',
      titre: 'Objectif de vente',
      description: 'Atteindre 2M€ de chiffre d\'affaires',
      valeurCible: 2000000,
      valeurActuelle: 2100000,
      unite: '€',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Haute',
      responsable: 'Sophie Martin',
      commentaires: 'Objectif dépassé, excellent commercial',
      couleur: 'green'
    },
    {
      id: 10,
      employeId: 10,
      employeNom: 'Sarah Johnson',
      employeEmail: 'sarah.johnson@email.com',
      departement: 'Production',
      poste: 'Chef d\'équipe Production',
      type: 'Objectif quantitatif',
      statut: 'En cours',
      titre: 'Amélioration de la productivité',
      description: 'Augmenter la productivité de l\'équipe de 25%',
      valeurCible: 25,
      valeurActuelle: 18,
      unite: '%',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      priorite: 'Haute',
      responsable: 'Pierre Bernard',
      commentaires: 'Bon rythme, objectif atteignable',
      couleur: 'orange'
    }
  ];

  const types = ['Objectif quantitatif', 'Objectif qualitatif', 'Objectif comportemental', 'Objectif de formation'];
  const statuts = ['En cours', 'Atteint', 'En retard', 'Abandonné', 'En attente'];
  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];
  const periodes = ['2024', '2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
  const priorites = ['Haute', 'Moyenne', 'Basse'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Objectif quantitatif':
        return 'bg-blue-100 text-blue-800';
      case 'Objectif qualitatif':
        return 'bg-green-100 text-green-800';
      case 'Objectif comportemental':
        return 'bg-purple-100 text-purple-800';
      case 'Objectif de formation':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Atteint':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'En retard':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Abandonné':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'Haute':
        return 'bg-red-100 text-red-800';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'Basse':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      case 'Objectif quantitatif':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'Objectif qualitatif':
        return <StarIcon className="h-5 w-5" />;
      case 'Objectif comportemental':
        return <UserIcon className="h-5 w-5" />;
      case 'Objectif de formation':
        return <BookOpenIcon className="h-5 w-5" />;
      default:
        return <FlagIcon className="h-5 w-5" />;
    }
  };

  const getProgressColor = (pourcentage) => {
    if (pourcentage >= 100) return 'bg-green-500';
    if (pourcentage >= 75) return 'bg-blue-500';
    if (pourcentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredObjectifs = objectifs.filter(objectif => {
    const matchesSearch = !searchTerm || 
      objectif.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objectif.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objectif.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objectif.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objectif.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'tous' || objectif.statut === filterStatut;
    const matchesType = filterType === 'tous' || objectif.type === filterType;
    const matchesDepartement = filterDepartement === 'tous' || objectif.departement === filterDepartement;
    return matchesSearch && matchesStatut && matchesType && matchesDepartement;
  });

  const stats = {
    totalObjectifs: objectifs.length,
    enCours: objectifs.filter(o => o.statut === 'En cours').length,
    atteints: objectifs.filter(o => o.statut === 'Atteint').length,
    enRetard: objectifs.filter(o => o.statut === 'En retard').length,
    tauxReussite: Math.round((objectifs.filter(o => o.statut === 'Atteint').length / objectifs.length) * 100),
    objectifsPrioriteHaute: objectifs.filter(o => o.priorite === 'Haute').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  const getInitials = (nom) => {
    return nom.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getProgressPercentage = (actuel, cible) => {
    return Math.round((actuel / cible) * 100);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Objectifs</h1>
        <p className="text-gray-600">Gestion des objectifs et des évaluations de performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FlagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalObjectifs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Atteints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.atteints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enRetard}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tauxReussite}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FireIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Priorité haute</p>
              <p className="text-2xl font-bold text-gray-900">{stats.objectifsPrioriteHaute}</p>
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
                  placeholder="Rechercher par employé, titre, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
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
              {filteredObjectifs.length} objectif(s) trouvé(s)
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
              {filteredObjectifs.map((objectif) => {
                const progressPercentage = getProgressPercentage(objectif.valeurActuelle, objectif.valeurCible);
                return (
                  <div key={objectif.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {getInitials(objectif.employeNom)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {objectif.employeNom}
                          </h3>
                          <p className="text-sm text-gray-600">{objectif.poste}</p>
                          <p className="text-xs text-gray-500">{objectif.departement}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{progressPercentage}%</p>
                        <p className="text-sm text-gray-500">{objectif.valeurActuelle} / {objectif.valeurCible} {objectif.unite}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(objectif.type)}
                      </div>
                      <div>
                        <h4 className="text-md font-semibold text-gray-900">{objectif.titre}</h4>
                        <p className="text-sm text-gray-600">{objectif.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(progressPercentage)}`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Responsable:</span>
                        <span className="font-medium">{objectif.responsable}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Période:</span>
                        <span className="font-medium">{formatDate(objectif.dateDebut)} - {formatDate(objectif.dateFin)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Priorité:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioriteColor(objectif.priorite)}`}>
                          {objectif.priorite}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(objectif.statut)}`}>
                        {objectif.statut}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(objectif.type)}`}>
                        {objectif.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(objectif.departement)}`}>
                        {objectif.departement}
                      </span>
                    </div>

                    {objectif.commentaires && (
                      <div className="bg-white rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">{objectif.commentaires}</p>
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
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredObjectifs.map((objectif) => {
                const progressPercentage = getProgressPercentage(objectif.valeurActuelle, objectif.valeurCible);
                return (
                  <div key={objectif.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {getInitials(objectif.employeNom)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {objectif.employeNom}
                          </h3>
                          <p className="text-sm text-gray-600">{objectif.poste} - {objectif.departement}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">{objectif.titre}</span>
                            <span className="text-sm text-gray-500">{objectif.valeurActuelle} / {objectif.valeurCible} {objectif.unite}</span>
                            <span className="text-sm text-gray-500">{formatDate(objectif.dateDebut)} - {formatDate(objectif.dateFin)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{progressPercentage}%</p>
                          <p className="text-xs text-gray-500">Responsable: {objectif.responsable}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(objectif.statut)}`}>
                            {objectif.statut}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(objectif.type)}`}>
                            {objectif.type}
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
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'objectif</h3>
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

export default Objectifs;
