import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ChartPieIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  FlagIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  TrophyIcon,
  GiftIcon,
  CakeIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  WrenchIcon,
  CogIcon,
  PresentationChartLineIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentIcon,
  NewspaperIcon,
  RssIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  CameraIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CheckIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowUturnUpIcon,
  ArrowUturnDownIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';

const Sondages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterCategorie, setFilterCategorie] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedSondage, setSelectedSondage] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard');

  // Données de démonstration
  const sondages = [
    {
      id: 1,
      titre: 'Satisfaction au travail 2024',
      description: 'Évaluation de la satisfaction des employés et identification des axes d\'amélioration',
      contenu: 'Ce sondage vise à évaluer votre niveau de satisfaction au travail et à identifier les domaines d\'amélioration. Vos réponses resteront anonymes et nous aideront à améliorer l\'environnement de travail.',
      categorie: 'Satisfaction',
      type: 'Satisfaction',
      statut: 'Actif',
      auteur: 'Marie Dubois',
      dateCreation: '2024-01-15',
      dateDebut: '2024-01-20',
      dateFin: '2024-02-20',
      participants: 45,
      reponses: 38,
      questions: 15,
      duree: 10,
      anonyme: true,
      couleur: 'blue',
      urgent: false,
      resultats: {
        satisfaction: 78,
        participation: 84,
        recommandation: 82
      }
    },
    {
      id: 2,
      titre: 'Formation et développement',
      description: 'Besoins en formation et préférences de développement professionnel',
      contenu: 'Nous souhaitons connaître vos besoins en formation et vos préférences pour le développement professionnel. Vos réponses nous aideront à planifier les formations de l\'année prochaine.',
      categorie: 'Formation',
      type: 'Besoins',
      statut: 'Actif',
      auteur: 'Thomas Moreau',
      dateCreation: '2024-01-18',
      dateDebut: '2024-01-22',
      dateFin: '2024-02-22',
      participants: 32,
      reponses: 28,
      questions: 12,
      duree: 8,
      anonyme: true,
      couleur: 'green',
      urgent: false,
      resultats: {
        satisfaction: 85,
        participation: 88,
        recommandation: 90
      }
    },
    {
      id: 3,
      titre: 'Événements d\'entreprise',
      description: 'Préférences pour les événements et activités d\'équipe',
      contenu: 'Nous organisons plusieurs événements d\'entreprise cette année. Vos préférences nous aideront à planifier des activités qui vous plaisent vraiment.',
      categorie: 'Événements',
      type: 'Préférences',
      statut: 'Fermé',
      auteur: 'Emma Petit',
      dateCreation: '2023-12-10',
      dateDebut: '2023-12-15',
      dateFin: '2024-01-15',
      participants: 28,
      reponses: 25,
      questions: 8,
      duree: 5,
      anonyme: false,
      couleur: 'purple',
      urgent: false,
      resultats: {
        satisfaction: 92,
        participation: 89,
        recommandation: 88
      }
    },
    {
      id: 4,
      titre: 'Télétravail et flexibilité',
      description: 'Évaluation de la politique de télétravail et suggestions d\'amélioration',
      contenu: 'Nous évaluons notre politique de télétravail actuelle. Vos retours nous aideront à l\'améliorer et à mieux répondre à vos besoins.',
      categorie: 'Politique',
      type: 'Évaluation',
      statut: 'Actif',
      auteur: 'Lucas Rousseau',
      dateCreation: '2024-01-20',
      dateDebut: '2024-01-25',
      dateFin: '2024-02-25',
      participants: 40,
      reponses: 35,
      questions: 18,
      duree: 12,
      anonyme: true,
      couleur: 'orange',
      urgent: true,
      resultats: {
        satisfaction: 76,
        participation: 88,
        recommandation: 79
      }
    },
    {
      id: 5,
      titre: 'Outils et technologies',
      description: 'Évaluation des outils de travail et besoins technologiques',
      contenu: 'Nous souhaitons évaluer l\'efficacité de nos outils de travail actuels et identifier vos besoins technologiques pour améliorer la productivité.',
      categorie: 'Technologie',
      type: 'Évaluation',
      statut: 'Brouillon',
      auteur: 'Pierre Martin',
      dateCreation: '2024-01-25',
      dateDebut: null,
      dateFin: null,
      participants: 0,
      reponses: 0,
      questions: 14,
      duree: 10,
      anonyme: true,
      couleur: 'indigo',
      urgent: false,
      resultats: {
        satisfaction: 0,
        participation: 0,
        recommandation: 0
      }
    },
    {
      id: 6,
      titre: 'Culture d\'entreprise',
      description: 'Évaluation de la culture d\'entreprise et des valeurs partagées',
      contenu: 'Nous évaluons notre culture d\'entreprise et l\'alignement avec nos valeurs. Vos réponses nous aideront à renforcer notre identité d\'entreprise.',
      categorie: 'Culture',
      type: 'Évaluation',
      statut: 'Fermé',
      auteur: 'Sophie Garcia',
      dateCreation: '2023-11-15',
      dateDebut: '2023-11-20',
      dateFin: '2023-12-20',
      participants: 35,
      reponses: 32,
      questions: 20,
      duree: 15,
      anonyme: true,
      couleur: 'pink',
      urgent: false,
      resultats: {
        satisfaction: 88,
        participation: 91,
        recommandation: 85
      }
    }
  ];

  const categories = ['Satisfaction', 'Formation', 'Événements', 'Politique', 'Technologie', 'Culture'];
  const types = ['Satisfaction', 'Besoins', 'Préférences', 'Évaluation', 'Feedback'];
  const statuts = ['Actif', 'Fermé', 'Brouillon', 'Archivé'];

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Satisfaction':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Formation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Événements':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Politique':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Technologie':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Culture':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Fermé':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Brouillon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archivé':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Satisfaction':
        return 'bg-blue-100 text-blue-800';
      case 'Besoins':
        return 'bg-green-100 text-green-800';
      case 'Préférences':
        return 'bg-purple-100 text-purple-800';
      case 'Évaluation':
        return 'bg-orange-100 text-orange-800';
      case 'Feedback':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategorieIcon = (categorie) => {
    switch (categorie) {
      case 'Satisfaction':
        return <HeartIcon className="h-5 w-5" />;
      case 'Formation':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'Événements':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'Politique':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'Technologie':
        return <CogIcon className="h-5 w-5" />;
      case 'Culture':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      default:
        return <ChartBarIcon className="h-5 w-5" />;
    }
  };

  const filteredSondages = sondages.filter(sondage => {
    const matchesSearch = !searchTerm || 
      sondage.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sondage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sondage.auteur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'tous' || sondage.statut === filterStatut;
    const matchesCategorie = filterCategorie === 'tous' || sondage.categorie === filterCategorie;
    const matchesType = filterType === 'tous' || sondage.type === filterType;
    return matchesSearch && matchesStatut && matchesCategorie && matchesType;
  });

  const stats = {
    totalSondages: sondages.length,
    actifs: sondages.filter(s => s.statut === 'Actif').length,
    fermes: sondages.filter(s => s.statut === 'Fermé').length,
    brouillons: sondages.filter(s => s.statut === 'Brouillon').length,
    totalParticipants: sondages.reduce((sum, s) => sum + s.participants, 0),
    totalReponses: sondages.reduce((sum, s) => sum + s.reponses, 0),
    tauxParticipation: sondages.length > 0 ? Math.round(sondages.reduce((sum, s) => sum + s.reponses, 0) / sondages.reduce((sum, s) => sum + s.participants, 0) * 100) : 0
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non programmé';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Non programmé';
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)}sem`;
    return `Il y a ${Math.floor(diffInDays / 30)}mois`;
  };

  const getParticipationColor = (participation) => {
    if (participation >= 90) return 'text-green-600';
    if (participation >= 80) return 'text-blue-600';
    if (participation >= 70) return 'text-yellow-600';
    if (participation >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getParticipationBgColor = (participation) => {
    if (participation >= 90) return 'bg-green-100';
    if (participation >= 80) return 'bg-blue-100';
    if (participation >= 70) return 'bg-yellow-100';
    if (participation >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 min-h-screen">
      {/* Header avec design spécial */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mb-4">
          <ChartBarIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Sondages
        </h1>
        <p className="text-gray-600 text-lg">Collecte d'opinions et évaluation des besoins</p>
      </div>

      {/* Stats Cards avec design en mosaïque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-violet-500 to-violet-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Total Sondages</p>
              <p className="text-3xl font-bold">{stats.totalSondages}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-violet-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Actifs</p>
              <p className="text-3xl font-bold">{stats.actifs}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Participants</p>
              <p className="text-3xl font-bold">{stats.totalParticipants}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Taux Participation</p>
              <p className="text-3xl font-bold">{stats.tauxParticipation}%</p>
            </div>
            <ChartPieIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fermés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.fermes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.brouillons}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-lg">
              <ChatBubbleLeftIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réponses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReponses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters avec design moderne */}
      <div className="bg-white rounded-2xl shadow-lg border-0 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, auteur, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                <option value="tous">Toutes les catégories</option>
                {categories.map(categorie => (
                  <option key={categorie} value={categorie}>{categorie}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                <option value="tous">Tous les types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle avec design spécial */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              {filteredSondages.length} sondage(s) trouvé(s)
            </p>
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`p-2 rounded-md transition-all ${viewMode === 'dashboard' ? 'bg-violet-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Dashboard"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-all ${viewMode === 'cards' ? 'bg-violet-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Cartes"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-violet-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Liste"
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
          {viewMode === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSondages.map((sondage) => (
                <div key={sondage.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${sondage.couleur === 'blue' ? 'bg-blue-100' : sondage.couleur === 'green' ? 'bg-green-100' : sondage.couleur === 'purple' ? 'bg-purple-100' : sondage.couleur === 'orange' ? 'bg-orange-100' : sondage.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-pink-100'}`}>
                      {getCategorieIcon(sondage.categorie)}
                    </div>
                    {sondage.urgent && (
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        URGENT
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                    {sondage.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{sondage.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{sondage.participants}</p>
                      <p className="text-xs text-gray-500">Participants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{sondage.reponses}</p>
                      <p className="text-xs text-gray-500">Réponses</p>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Participation</span>
                      <span>{Math.round((sondage.reponses / sondage.participants) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getParticipationBgColor(Math.round((sondage.reponses / sondage.participants) * 100))} ${getParticipationColor(Math.round((sondage.reponses / sondage.participants) * 100))}`}
                        style={{ width: `${Math.round((sondage.reponses / sondage.participants) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(sondage.statut)}`}>
                      {sondage.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategorieColor(sondage.categorie)}`}>
                      {sondage.categorie}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(sondage.type)}`}>
                      {sondage.type}
                    </span>
                    {sondage.anonyme && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Anonyme
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {sondage.duree} min • {sondage.questions} questions
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-violet-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSondages.map((sondage) => (
                <div key={sondage.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${sondage.couleur === 'blue' ? 'bg-blue-100' : sondage.couleur === 'green' ? 'bg-green-100' : sondage.couleur === 'purple' ? 'bg-purple-100' : sondage.couleur === 'orange' ? 'bg-orange-100' : sondage.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-pink-100'}`}>
                      {getCategorieIcon(sondage.categorie)}
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${getParticipationBgColor(Math.round((sondage.reponses / sondage.participants) * 100))} ${getParticipationColor(Math.round((sondage.reponses / sondage.participants) * 100))}`}>
                        {Math.round((sondage.reponses / sondage.participants) * 100)}%
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                    {sondage.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{sondage.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {sondage.auteur}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {formatDate(sondage.dateDebut)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {sondage.duree} min
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(sondage.statut)}`}>
                      {sondage.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategorieColor(sondage.categorie)}`}>
                      {sondage.categorie}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {sondage.reponses}/{sondage.participants} réponses
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-violet-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSondages.map((sondage) => (
                <div key={sondage.id} className="bg-white rounded-xl p-6 shadow-sm border-0 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${sondage.couleur === 'blue' ? 'bg-blue-100' : sondage.couleur === 'green' ? 'bg-green-100' : sondage.couleur === 'purple' ? 'bg-purple-100' : sondage.couleur === 'orange' ? 'bg-orange-100' : sondage.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-pink-100'}`}>
                        {getCategorieIcon(sondage.categorie)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{sondage.titre}</h3>
                        <p className="text-sm text-gray-600">{sondage.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{sondage.auteur}</span>
                          <span className="text-sm text-gray-500">{formatDate(sondage.dateDebut)}</span>
                          <span className="text-sm text-gray-500">{sondage.duree} min</span>
                          <span className="text-sm text-gray-500">{sondage.reponses}/{sondage.participants} réponses</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{sondage.categorie}</p>
                        <p className="text-xs text-gray-500">{formatDate(sondage.dateFin)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(sondage.statut)}`}>
                          {sondage.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(sondage.type)}`}>
                          {sondage.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <TrashIcon className="h-5 w-5" />
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du sondage</h3>
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

export default Sondages;
