import React, { useState, useEffect } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
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
  ArrowPathRoundedSquareIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  ArrowTopLeftOnSquareIcon,
  ArrowBottomRightOnSquareIcon,
  ArrowBottomLeftOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowDownOnSquareIcon,
  ArrowLeftOnSquareIcon,
  ArrowRightOnSquareIcon,
  ArrowUpLeftOnSquareIcon,
  ArrowUpRightOnSquareIcon,
  ArrowDownLeftOnSquareIcon,
  ArrowDownRightOnSquareIcon,
  ArrowUpOnSquareStackIcon,
  ArrowDownOnSquareStackIcon,
  ArrowLeftOnSquareStackIcon,
  ArrowRightOnSquareStackIcon,
  ArrowUpLeftOnSquareStackIcon,
  ArrowUpRightOnSquareStackIcon,
  ArrowDownLeftOnSquareStackIcon,
  ArrowDownRightOnSquareStackIcon
} from '@heroicons/react/24/outline';

const Evenements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterLieu, setFilterLieu] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');

  // Données de démonstration
  const evenements = [
    {
      id: 1,
      titre: 'Séminaire annuel 2024',
      description: 'Séminaire de fin d\'année avec présentation des résultats et perspectives 2024',
      contenu: 'Nous avons le plaisir de vous inviter à notre séminaire annuel qui se déroulera sur deux jours. Au programme : présentation des résultats de l\'année, perspectives 2024, ateliers de travail et moments de convivialité.',
      type: 'Séminaire',
      statut: 'Programmé',
      lieu: 'Hôtel des Congrès',
      adresse: '123 Avenue des Champs-Élysées, 75008 Paris',
      dateDebut: '2024-02-15',
      dateFin: '2024-02-16',
      heureDebut: '09:00',
      heureFin: '18:00',
      organisateur: 'Marie Dubois',
      participants: 45,
      inscrits: 38,
      capacite: 50,
      cout: 2500,
      couleur: 'blue',
      urgent: false,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      tags: ['Séminaire', 'Annuel', 'Présentation'],
      requirements: ['Ordinateur portable', 'Carnet de notes'],
      contact: 'marie.dubois@entreprise.com'
    },
    {
      id: 2,
      titre: 'Formation sécurité informatique',
      description: 'Formation obligatoire sur les bonnes pratiques de sécurité informatique',
      contenu: 'Formation de 4 heures sur les enjeux de sécurité informatique. Au programme : identification des menaces, bonnes pratiques, gestion des mots de passe, et simulation d\'attaques.',
      type: 'Formation',
      statut: 'En cours',
      lieu: 'Salle de formation A',
      adresse: 'Bâtiment principal, 2ème étage',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-25',
      heureDebut: '14:00',
      heureFin: '18:00',
      organisateur: 'Thomas Moreau',
      participants: 20,
      inscrits: 20,
      capacite: 20,
      cout: 800,
      couleur: 'red',
      urgent: true,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      tags: ['Formation', 'Sécurité', 'Obligatoire'],
      requirements: ['Ordinateur portable'],
      contact: 'thomas.moreau@entreprise.com'
    },
    {
      id: 3,
      titre: 'Team building d\'équipe',
      description: 'Activité de cohésion d\'équipe avec escape game et déjeuner',
      contenu: 'Journée de team building pour renforcer les liens entre collègues. Au programme : escape game le matin, déjeuner d\'équipe, et activités de groupe l\'après-midi.',
      type: 'Team Building',
      statut: 'Programmé',
      lieu: 'Escape Game Center',
      adresse: '45 Rue de la Paix, 75002 Paris',
      dateDebut: '2024-02-10',
      dateFin: '2024-02-10',
      heureDebut: '09:30',
      heureFin: '17:00',
      organisateur: 'Emma Petit',
      participants: 15,
      inscrits: 12,
      capacite: 15,
      cout: 1200,
      couleur: 'green',
      urgent: false,
      image: 'https://images.unsplash.com/photo-1521791136064-7986c8dca8a8?w=400',
      tags: ['Team Building', 'Cohésion', 'Ludique'],
      requirements: ['Tenue décontractée', 'Bonne humeur'],
      contact: 'emma.petit@entreprise.com'
    },
    {
      id: 4,
      titre: 'Conférence innovation',
      description: 'Conférence sur les dernières tendances technologiques et innovations',
      contenu: 'Conférence de 3 heures sur les innovations technologiques qui transforment notre secteur. Intervenants externes et présentation de cas d\'usage concrets.',
      type: 'Conférence',
      statut: 'Terminé',
      lieu: 'Auditorium principal',
      adresse: 'Bâtiment principal, Rez-de-chaussée',
      dateDebut: '2024-01-15',
      dateFin: '2024-01-15',
      heureDebut: '10:00',
      heureFin: '13:00',
      organisateur: 'Lucas Rousseau',
      participants: 80,
      inscrits: 75,
      capacite: 100,
      cout: 1500,
      couleur: 'purple',
      urgent: false,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      tags: ['Conférence', 'Innovation', 'Technologie'],
      requirements: ['Inscription obligatoire'],
      contact: 'lucas.rousseau@entreprise.com'
    },
    {
      id: 5,
      titre: 'Atelier créatif',
      description: 'Atelier de design thinking et créativité pour l\'équipe marketing',
      contenu: 'Atelier de 6 heures sur les méthodes de design thinking et de créativité. Exercices pratiques, brainstorming et prototypage rapide.',
      type: 'Atelier',
      statut: 'Programmé',
      lieu: 'Salle créative',
      adresse: 'Bâtiment annexe, 1er étage',
      dateDebut: '2024-02-20',
      dateFin: '2024-02-20',
      heureDebut: '09:00',
      heureFin: '17:00',
      organisateur: 'Pierre Martin',
      participants: 12,
      inscrits: 8,
      capacite: 12,
      cout: 600,
      couleur: 'orange',
      urgent: false,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      tags: ['Atelier', 'Créativité', 'Design'],
      requirements: ['Matériel de dessin', 'Ordinateur portable'],
      contact: 'pierre.martin@entreprise.com'
    },
    {
      id: 6,
      titre: 'Cérémonie de remise de prix',
      description: 'Cérémonie de remise des prix annuels et reconnaissance des employés',
      contenu: 'Cérémonie officielle de remise des prix annuels. Reconnaissance des performances exceptionnelles et des contributions remarquables de nos employés.',
      type: 'Cérémonie',
      statut: 'Programmé',
      lieu: 'Grande salle de réception',
      adresse: 'Hôtel des Congrès, Salle des Fêtes',
      dateDebut: '2024-03-15',
      dateFin: '2024-03-15',
      heureDebut: '19:00',
      heureFin: '23:00',
      organisateur: 'Sophie Garcia',
      participants: 60,
      inscrits: 45,
      capacite: 60,
      cout: 3000,
      couleur: 'gold',
      urgent: false,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
      tags: ['Cérémonie', 'Prix', 'Reconnaissance'],
      requirements: ['Tenue de soirée', 'RSVP obligatoire'],
      contact: 'sophie.garcia@entreprise.com'
    }
  ];

  const types = ['Séminaire', 'Formation', 'Team Building', 'Conférence', 'Atelier', 'Cérémonie', 'Réunion'];
  const statuts = ['Programmé', 'En cours', 'Terminé', 'Annulé', 'Reporté'];
  const lieux = ['Hôtel des Congrès', 'Salle de formation A', 'Escape Game Center', 'Auditorium principal', 'Salle créative', 'Grande salle de réception'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Séminaire':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Formation':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Team Building':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Conférence':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Atelier':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cérémonie':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Réunion':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Programmé':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En cours':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Terminé':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Annulé':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Reporté':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Séminaire':
        return <PresentationChartLineIcon className="h-5 w-5" />;
      case 'Formation':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'Team Building':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'Conférence':
        return <MicrophoneIcon className="h-5 w-5" />;
      case 'Atelier':
        return <WrenchIcon className="h-5 w-5" />;
      case 'Cérémonie':
        return <TrophyIcon className="h-5 w-5" />;
      case 'Réunion':
        return <CalendarDaysIcon className="h-5 w-5" />;
      default:
        return <CalendarDaysIcon className="h-5 w-5" />;
    }
  };

  const filteredEvenements = evenements.filter(evenement => {
    const matchesSearch = !searchTerm || 
      evenement.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evenement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evenement.organisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evenement.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'tous' || evenement.type === filterType;
    const matchesStatut = filterStatut === 'tous' || evenement.statut === filterStatut;
    const matchesLieu = filterLieu === 'tous' || evenement.lieu === filterLieu;
    return matchesSearch && matchesType && matchesStatut && matchesLieu;
  });

  const stats = {
    totalEvenements: evenements.length,
    programmes: evenements.filter(e => e.statut === 'Programmé').length,
    enCours: evenements.filter(e => e.statut === 'En cours').length,
    termines: evenements.filter(e => e.statut === 'Terminé').length,
    totalParticipants: evenements.reduce((sum, e) => sum + e.participants, 0),
    totalInscrits: evenements.reduce((sum, e) => sum + e.inscrits, 0),
    totalCout: evenements.reduce((sum, e) => sum + e.cout, 0)
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getTimeAgo = (dateString) => {
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

  const getParticipationColor = (inscrits, capacite) => {
    const percentage = (inscrits / capacite) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getParticipationBgColor = (inscrits, capacite) => {
    const percentage = (inscrits / capacite) * 100;
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 80) return 'bg-blue-100';
    if (percentage >= 70) return 'bg-yellow-100';
    if (percentage >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 min-h-screen">
      {/* Header avec design spécial */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mb-4">
          <CalendarDaysIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Événements
        </h1>
        <p className="text-gray-600 text-lg">Gestion des événements d'entreprise et activités</p>
      </div>

      {/* Stats Cards avec design en mosaïque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Événements</p>
              <p className="text-3xl font-bold">{stats.totalEvenements}</p>
            </div>
            <CalendarDaysIcon className="h-8 w-8 text-rose-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Programmés</p>
              <p className="text-3xl font-bold">{stats.programmes}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">En Cours</p>
              <p className="text-3xl font-bold">{stats.enCours}</p>
            </div>
            <PlayIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Participants</p>
              <p className="text-3xl font-bold">{stats.totalParticipants}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.termines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inscrits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInscrits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Total</p>
              <p className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalCout)}</p>
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
                  placeholder="Rechercher par titre, organisateur, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="tous">Tous les types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterLieu}
                onChange={(e) => setFilterLieu(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="tous">Tous les lieux</option>
                {lieux.map(lieu => (
                  <option key={lieu} value={lieu}>{lieu}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle avec design spécial */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              {filteredEvenements.length} événement(s) trouvé(s)
            </p>
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Calendrier"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-all ${viewMode === 'cards' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Cartes"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
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
          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvenements.map((evenement) => (
                <div key={evenement.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative mb-4">
                    <img
                      src={evenement.image}
                      alt={evenement.titre}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    {evenement.urgent && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        URGENT
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(evenement.type)}`}>
                        {getTypeIcon(evenement.type)}
                        <span className="ml-1">{evenement.type}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {evenement.titre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{evenement.description}</p>
                    
                    {/* Date et heure */}
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {formatDate(evenement.dateDebut)} {evenement.dateFin !== evenement.dateDebut && `- ${formatDate(evenement.dateFin)}`}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {evenement.heureDebut} - {evenement.heureFin}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {evenement.lieu}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {evenement.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-rose-50 text-rose-700 text-xs rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {evenement.inscrits}/{evenement.capacite}
                      </span>
                      <span className="flex items-center">
                        <TrophyIcon className="h-4 w-4 mr-1" />
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(evenement.cout)}
                      </span>
                    </div>
                    <span className="text-xs">{getTimeAgo(evenement.dateDebut)}</span>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Inscriptions</span>
                      <span>{Math.round((evenement.inscrits / evenement.capacite) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getParticipationBgColor(evenement.inscrits, evenement.capacite)} ${getParticipationColor(evenement.inscrits, evenement.capacite)}`}
                        style={{ width: `${Math.round((evenement.inscrits / evenement.capacite) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{evenement.organisateur}</p>
                        <p className="text-xs text-gray-500">{evenement.contact}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-rose-600 transition-colors">
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
              {filteredEvenements.map((evenement) => (
                <div key={evenement.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${evenement.couleur === 'blue' ? 'bg-blue-100' : evenement.couleur === 'red' ? 'bg-red-100' : evenement.couleur === 'green' ? 'bg-green-100' : evenement.couleur === 'purple' ? 'bg-purple-100' : evenement.couleur === 'orange' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                      {getTypeIcon(evenement.type)}
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${getParticipationBgColor(evenement.inscrits, evenement.capacite)} ${getParticipationColor(evenement.inscrits, evenement.capacite)}`}>
                        {Math.round((evenement.inscrits / evenement.capacite) * 100)}%
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {evenement.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{evenement.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {formatDate(evenement.dateDebut)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {evenement.heureDebut} - {evenement.heureFin}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {evenement.lieu}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(evenement.statut)}`}>
                      {evenement.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(evenement.type)}`}>
                      {evenement.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {evenement.inscrits}/{evenement.capacite} inscrits
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-rose-600 transition-colors">
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
              {filteredEvenements.map((evenement) => (
                <div key={evenement.id} className="bg-white rounded-xl p-6 shadow-sm border-0 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${evenement.couleur === 'blue' ? 'bg-blue-100' : evenement.couleur === 'red' ? 'bg-red-100' : evenement.couleur === 'green' ? 'bg-green-100' : evenement.couleur === 'purple' ? 'bg-purple-100' : evenement.couleur === 'orange' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                        {getTypeIcon(evenement.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{evenement.titre}</h3>
                        <p className="text-sm text-gray-600">{evenement.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{evenement.organisateur}</span>
                          <span className="text-sm text-gray-500">{formatDate(evenement.dateDebut)}</span>
                          <span className="text-sm text-gray-500">{evenement.heureDebut} - {evenement.heureFin}</span>
                          <span className="text-sm text-gray-500">{evenement.inscrits}/{evenement.capacite} inscrits</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{evenement.lieu}</p>
                        <p className="text-xs text-gray-500">{evenement.type}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(evenement.statut)}`}>
                          {evenement.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(evenement.type)}`}>
                          {evenement.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-rose-600 transition-colors">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'événement</h3>
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

export default Evenements;
