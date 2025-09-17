import React, { useState, useEffect } from 'react';
import {
  MegaphoneIcon,
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  TagIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  ShareIcon,
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
  ChartBarIcon,
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
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowLeftTrayIcon,
  ArrowRightTrayIcon,
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
  ArrowDownRightOnSquareStackIcon,
  ArrowUpOnSquareStackIcon as ArrowUpOnSquareStack,
  ArrowDownOnSquareStackIcon as ArrowDownOnSquareStack,
  ArrowLeftOnSquareStackIcon as ArrowLeftOnSquareStack,
  ArrowRightOnSquareStackIcon as ArrowRightOnSquareStack,
  ArrowUpLeftOnSquareStackIcon as ArrowUpLeftOnSquareStack,
  ArrowUpRightOnSquareStackIcon as ArrowUpRightOnSquareStack,
  ArrowDownLeftOnSquareStackIcon as ArrowDownLeftOnSquareStack,
  ArrowDownRightOnSquareStackIcon as ArrowDownRightOnSquareStack
} from '@heroicons/react/24/outline';

const Annonces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterPriorite, setFilterPriorite] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [viewMode, setViewMode] = useState('cards');

  // Données de démonstration
  const annonces = [
    {
      id: 1,
      titre: 'Nouvelle politique de télétravail',
      description: 'Mise à jour des règles de télétravail pour tous les employés. Veuillez consulter le nouveau règlement.',
      contenu: 'Nous sommes ravis de vous annoncer la mise à jour de notre politique de télétravail. Cette nouvelle politique offre plus de flexibilité tout en maintenant la productivité et la collaboration. Les changements principaux incluent :\n\n• Possibilité de télétravailler 3 jours par semaine\n• Nouvelles règles de communication\n• Équipements fournis par l\'entreprise\n• Formation obligatoire sur les outils de collaboration\n\nPour plus d\'informations, contactez votre manager ou les ressources humaines.',
      categorie: 'Politique RH',
      statut: 'Publiée',
      priorite: 'Haute',
      auteur: 'Marie Dubois',
      dateCreation: '2024-01-20',
      datePublication: '2024-01-21',
      dateExpiration: '2024-02-21',
      vues: 156,
      likes: 23,
      commentaires: 8,
      tags: ['Télétravail', 'Politique', 'Flexibilité'],
      image: 'https://images.unsplash.com/photo-1521791136064-7986c8dca8a8?w=400',
      couleur: 'blue',
      urgent: true
    },
    {
      id: 2,
      titre: 'Formation sécurité informatique',
      description: 'Formation obligatoire sur la cybersécurité pour tous les employés. Inscription requise.',
      contenu: 'Dans le cadre de notre engagement envers la sécurité informatique, nous organisons une formation obligatoire pour tous les employés. Cette formation couvrira :\n\n• Identification des menaces de sécurité\n• Bonnes pratiques de mot de passe\n• Gestion des emails suspects\n• Utilisation sécurisée des outils de travail\n\nLa formation aura lieu le 15 février de 9h à 12h en salle de conférence A. L\'inscription est obligatoire avant le 10 février.',
      categorie: 'Formation',
      statut: 'Publiée',
      priorite: 'Moyenne',
      auteur: 'Thomas Moreau',
      dateCreation: '2024-01-18',
      datePublication: '2024-01-19',
      dateExpiration: '2024-02-15',
      vues: 89,
      likes: 12,
      commentaires: 5,
      tags: ['Sécurité', 'Formation', 'Obligatoire'],
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      couleur: 'red',
      urgent: false
    },
    {
      id: 3,
      titre: 'Événement de team building',
      description: 'Sortie d\'équipe prévue le 25 février. Inscription ouverte jusqu\'au 20 février.',
      contenu: 'Nous organisons une sortie d\'équipe pour renforcer les liens entre collègues et créer une meilleure cohésion d\'équipe. Au programme :\n\n• Activités de team building\n• Déjeuner d\'équipe\n• Activités sportives optionnelles\n• Moment de détente et de convivialité\n\nL\'événement aura lieu le 25 février de 9h à 17h au parc des sports. Le transport sera organisé depuis l\'entreprise. L\'inscription est gratuite mais obligatoire.',
      categorie: 'Événement',
      statut: 'Publiée',
      priorite: 'Basse',
      auteur: 'Emma Petit',
      dateCreation: '2024-01-15',
      datePublication: '2024-01-16',
      dateExpiration: '2024-02-25',
      vues: 134,
      likes: 45,
      commentaires: 12,
      tags: ['Team Building', 'Événement', 'Convivialité'],
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
      couleur: 'green',
      urgent: false
    },
    {
      id: 4,
      titre: 'Maintenance système prévue',
      description: 'Maintenance des systèmes informatiques prévue ce weekend. Impact sur l\'accès aux applications.',
      contenu: 'Une maintenance programmée de nos systèmes informatiques est prévue ce weekend pour améliorer les performances et la sécurité. Détails de la maintenance :\n\n• Date : Samedi 27 janvier de 20h à dimanche 28 janvier 6h\n• Impact : Indisponibilité de tous les systèmes\n• Applications concernées : Toutes les applications internes\n• Sauvegarde : Toutes les données seront sauvegardées\n\nNous vous remercions de votre compréhension et vous encourageons à sauvegarder vos travaux en cours avant la maintenance.',
      categorie: 'Maintenance',
      statut: 'Publiée',
      priorite: 'Haute',
      auteur: 'Lucas Rousseau',
      dateCreation: '2024-01-22',
      datePublication: '2024-01-23',
      dateExpiration: '2024-01-28',
      vues: 78,
      likes: 3,
      commentaires: 2,
      tags: ['Maintenance', 'Système', 'Informatique'],
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      couleur: 'orange',
      urgent: true
    },
    {
      id: 5,
      titre: 'Nouveaux équipements de bureau',
      description: 'Arrivée de nouveaux équipements de bureau. Distribution prévue la semaine prochaine.',
      contenu: 'Nous sommes ravis de vous annoncer l\'arrivée de nouveaux équipements de bureau pour améliorer votre confort de travail. Les nouveaux équipements incluent :\n\n• Chaises ergonomiques ajustables\n• Écrans 27 pouces 4K\n• Claviers et souris ergonomiques\n• Lampes de bureau LED\n\nLa distribution commencera lundi 29 janvier par ordre d\'ancienneté. Chaque employé recevra un email avec son créneau de distribution. Les anciens équipements seront recyclés de manière responsable.',
      categorie: 'Équipement',
      statut: 'Publiée',
      priorite: 'Moyenne',
      auteur: 'Pierre Martin',
      dateCreation: '2024-01-19',
      datePublication: '2024-01-20',
      dateExpiration: '2024-02-20',
      vues: 112,
      likes: 28,
      commentaires: 15,
      tags: ['Équipement', 'Bureau', 'Confort'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      couleur: 'purple',
      urgent: false
    },
    {
      id: 6,
      titre: 'Changement d\'horaire d\'été',
      description: 'Passage à l\'horaire d\'été à partir du 31 mars. Ajustement des horaires de travail.',
      contenu: 'Nous vous informons du passage à l\'horaire d\'été qui aura lieu le dimanche 31 mars. Les ajustements suivants s\'appliqueront :\n\n• Décalage d\'une heure en avant\n• Horaires de travail inchangés\n• Pause déjeuner ajustée si nécessaire\n• Communication des nouveaux horaires par email\n\nLes employés en télétravail devront également ajuster leurs horaires. Pour toute question, contactez votre manager direct.',
      categorie: 'Horaire',
      statut: 'Brouillon',
      priorite: 'Basse',
      auteur: 'Sophie Garcia',
      dateCreation: '2024-01-24',
      datePublication: null,
      dateExpiration: '2024-03-31',
      vues: 0,
      likes: 0,
      commentaires: 0,
      tags: ['Horaire', 'Été', 'Ajustement'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      couleur: 'yellow',
      urgent: false
    }
  ];

  const categories = ['Politique RH', 'Formation', 'Événement', 'Maintenance', 'Équipement', 'Horaire', 'Général'];
  const statuts = ['Publiée', 'Brouillon', 'Archivée', 'Supprimée'];
  const priorites = ['Haute', 'Moyenne', 'Basse'];

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Politique RH':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Formation':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Événement':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Équipement':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Horaire':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Général':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Publiée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Brouillon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archivée':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Supprimée':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'Haute':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Basse':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategorieIcon = (categorie) => {
    switch (categorie) {
      case 'Politique RH':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'Formation':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'Événement':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'Maintenance':
        return <WrenchIcon className="h-5 w-5" />;
      case 'Équipement':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'Horaire':
        return <ClockIcon className="h-5 w-5" />;
      case 'Général':
        return <MegaphoneIcon className="h-5 w-5" />;
      default:
        return <MegaphoneIcon className="h-5 w-5" />;
    }
  };

  const filteredAnnonces = annonces.filter(annonce => {
    const matchesSearch = !searchTerm || 
      annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategorie = filterCategorie === 'tous' || annonce.categorie === filterCategorie;
    const matchesStatut = filterStatut === 'tous' || annonce.statut === filterStatut;
    const matchesPriorite = filterPriorite === 'tous' || annonce.priorite === filterPriorite;
    return matchesSearch && matchesCategorie && matchesStatut && matchesPriorite;
  });

  const stats = {
    totalAnnonces: annonces.length,
    publiees: annonces.filter(a => a.statut === 'Publiée').length,
    brouillons: annonces.filter(a => a.statut === 'Brouillon').length,
    urgentes: annonces.filter(a => a.urgent).length,
    totalVues: annonces.reduce((sum, a) => sum + a.vues, 0),
    totalLikes: annonces.reduce((sum, a) => sum + a.likes, 0),
    totalCommentaires: annonces.reduce((sum, a) => sum + a.commentaires, 0)
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non publiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Non publiée';
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

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      {/* Header avec design spécial */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-4">
          <MegaphoneIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Annonces
        </h1>
        <p className="text-gray-600 text-lg">Communication interne et informations importantes</p>
      </div>

      {/* Stats Cards avec design en mosaïque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Total Annonces</p>
              <p className="text-3xl font-bold">{stats.totalAnnonces}</p>
            </div>
            <MegaphoneIcon className="h-8 w-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Publiées</p>
              <p className="text-3xl font-bold">{stats.publiees}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Urgentes</p>
              <p className="text-3xl font-bold">{stats.urgentes}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Vues</p>
              <p className="text-3xl font-bold">{stats.totalVues}</p>
            </div>
            <EyeIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <HeartIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Likes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChatBubbleLeftIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commentaires</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCommentaires}</p>
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
                  placeholder="Rechercher par titre, auteur, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="tous">Toutes les catégories</option>
                {categories.map(categorie => (
                  <option key={categorie} value={categorie}>{categorie}</option>
                ))}
              </select>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterPriorite}
                onChange={(e) => setFilterPriorite(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="tous">Toutes les priorités</option>
                {priorites.map(priorite => (
                  <option key={priorite} value={priorite}>{priorite}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle avec design spécial */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              {filteredAnnonces.length} annonce(s) trouvée(s)
            </p>
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-all ${viewMode === 'cards' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Cartes"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Timeline"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
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
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnonces.map((annonce) => (
                <div key={annonce.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative mb-4">
                    <img
                      src={annonce.image}
                      alt={annonce.titre}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    {annonce.urgent && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        URGENT
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategorieColor(annonce.categorie)}`}>
                        {getCategorieIcon(annonce.categorie)}
                        <span className="ml-1">{annonce.categorie}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {annonce.titre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{annonce.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {annonce.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {annonce.vues}
                      </span>
                      <span className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {annonce.likes}
                      </span>
                      <span className="flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        {annonce.commentaires}
                      </span>
                    </div>
                    <span className="text-xs">{getTimeAgo(annonce.datePublication)}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{annonce.auteur}</p>
                        <p className="text-xs text-gray-500">{formatDate(annonce.datePublication)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-amber-600 transition-colors">
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
          ) : viewMode === 'timeline' ? (
            <div className="space-y-8">
              {filteredAnnonces.map((annonce, index) => (
                <div key={annonce.id} className="relative">
                  {/* Timeline line */}
                  {index < filteredAnnonces.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-amber-200 to-orange-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-6">
                    {/* Timeline dot */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                      annonce.statut === 'Publiée' ? 'bg-green-500' :
                      annonce.statut === 'Brouillon' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}>
                      {getCategorieIcon(annonce.categorie)}
                    </div>
                    
                    {/* Content card */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{annonce.titre}</h3>
                          <p className="text-gray-600 mb-3">{annonce.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-1" />
                              {annonce.auteur}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {getTimeAgo(annonce.datePublication)}
                            </span>
                            <span className="flex items-center">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {annonce.vues} vues
                            </span>
                          </div>
                        </div>
                        {annonce.urgent && (
                          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                            URGENT
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(annonce.statut)}`}>
                          {annonce.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategorieColor(annonce.categorie)}`}>
                          {annonce.categorie}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioriteColor(annonce.priorite)}`}>
                          {annonce.priorite}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <HeartIcon className="h-4 w-4 mr-1" />
                            {annonce.likes} likes
                          </span>
                          <span className="flex items-center">
                            <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                            {annonce.commentaires} commentaires
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnonces.map((annonce) => (
                <div key={annonce.id} className="bg-white rounded-xl p-6 shadow-sm border-0 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${annonce.couleur === 'blue' ? 'bg-blue-100' : annonce.couleur === 'red' ? 'bg-red-100' : annonce.couleur === 'green' ? 'bg-green-100' : annonce.couleur === 'orange' ? 'bg-orange-100' : annonce.couleur === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                        {getCategorieIcon(annonce.categorie)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{annonce.titre}</h3>
                        <p className="text-sm text-gray-600">{annonce.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{annonce.auteur}</span>
                          <span className="text-sm text-gray-500">{getTimeAgo(annonce.datePublication)}</span>
                          <span className="text-sm text-gray-500">{annonce.vues} vues</span>
                          <span className="text-sm text-gray-500">{annonce.likes} likes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{annonce.categorie}</p>
                        <p className="text-xs text-gray-500">{formatDate(annonce.datePublication)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(annonce.statut)}`}>
                          {annonce.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioriteColor(annonce.priorite)}`}>
                          {annonce.priorite}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'annonce</h3>
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

export default Annonces;
