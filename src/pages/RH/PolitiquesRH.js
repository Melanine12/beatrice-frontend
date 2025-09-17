import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
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
  UserGroupIcon,
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
  EnvelopeIcon,
  PhoneIcon,
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
  ArrowDownRightOnSquareStackIcon,
  LockClosedIcon,
  KeyIcon,
  EyeSlashIcon,
  ShieldExclamationIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const PolitiquesRH = () => {
  // Debug: vérifier que le composant se charge
  console.log('PolitiquesRH component loaded');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterPriorite, setFilterPriorite] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedPolitique, setSelectedPolitique] = useState(null);
  const [viewMode, setViewMode] = useState('masonry');

  // Données de démonstration
  const politiques = [
    {
      id: 1,
      titre: 'Politique de télétravail',
      description: 'Règles et procédures pour le travail à distance',
      contenu: 'Cette politique définit les conditions et procédures pour le télétravail. Elle couvre les aspects légaux, techniques et organisationnels du travail à distance.',
      categorie: 'Télétravail',
      statut: 'Active',
      priorite: 'Haute',
      version: '2.1',
      dateCreation: '2023-01-15',
      dateMiseAJour: '2024-01-10',
      dateExpiration: '2025-01-15',
      auteur: 'Marie Dubois',
      approbateur: 'Jean Dupont',
      pages: 12,
      mots: 3500,
      couleur: 'blue',
      urgent: false,
      tags: ['Télétravail', 'Flexibilité', 'Productivité'],
      sections: ['Définitions', 'Éligibilité', 'Procédures', 'Équipements', 'Sécurité'],
      documents: ['Guide télétravail.pdf', 'Checklist équipements.docx'],
      contact: 'marie.dubois@entreprise.com',
      compliance: 'RGPD, Code du travail'
    },
    {
      id: 2,
      titre: 'Politique de congés et absences',
      description: 'Règlementation des congés payés, RTT et absences',
      contenu: 'Cette politique établit les règles pour la gestion des congés payés, RTT, congés maladie et autres absences. Elle respecte la législation française en vigueur.',
      categorie: 'Congés',
      statut: 'Active',
      priorite: 'Haute',
      version: '1.8',
      dateCreation: '2022-06-01',
      dateMiseAJour: '2023-12-15',
      dateExpiration: '2024-12-31',
      auteur: 'Thomas Moreau',
      approbateur: 'Sophie Garcia',
      pages: 8,
      mots: 2800,
      couleur: 'green',
      urgent: false,
      tags: ['Congés', 'Absences', 'RTT'],
      sections: ['Types de congés', 'Procédures de demande', 'Validation', 'Remboursements'],
      documents: ['Formulaire congés.xlsx', 'Calendrier RTT.pdf'],
      contact: 'thomas.moreau@entreprise.com',
      compliance: 'Code du travail, Convention collective'
    },
    {
      id: 3,
      titre: 'Politique de formation',
      description: 'Développement des compétences et formation continue',
      contenu: 'Cette politique encadre les actions de formation et de développement des compétences. Elle définit les droits et obligations des employés et de l\'entreprise.',
      categorie: 'Formation',
      statut: 'Active',
      priorite: 'Moyenne',
      version: '1.5',
      dateCreation: '2023-03-10',
      dateMiseAJour: '2023-11-20',
      dateExpiration: '2024-11-20',
      auteur: 'Emma Petit',
      approbateur: 'Lucas Rousseau',
      pages: 6,
      mots: 2200,
      couleur: 'purple',
      urgent: false,
      tags: ['Formation', 'Compétences', 'Développement'],
      sections: ['Objectifs', 'Types de formation', 'Financement', 'Suivi'],
      documents: ['Plan formation 2024.pdf', 'Demande formation.docx'],
      contact: 'emma.petit@entreprise.com',
      compliance: 'CPF, OPCO'
    },
    {
      id: 4,
      titre: 'Politique de sécurité informatique',
      description: 'Règles de sécurité et protection des données',
      contenu: 'Cette politique définit les règles de sécurité informatique et de protection des données personnelles. Elle s\'applique à tous les employés et visiteurs.',
      categorie: 'Sécurité',
      statut: 'Active',
      priorite: 'Critique',
      version: '3.0',
      dateCreation: '2022-01-01',
      dateMiseAJour: '2024-01-05',
      dateExpiration: '2025-01-01',
      auteur: 'Pierre Martin',
      approbateur: 'Thomas Moreau',
      pages: 15,
      mots: 4500,
      couleur: 'red',
      urgent: true,
      tags: ['Sécurité', 'RGPD', 'Confidentialité'],
      sections: ['Accès aux systèmes', 'Gestion des mots de passe', 'Protection des données', 'Incidents'],
      documents: ['Guide sécurité.pdf', 'Checklist RGPD.xlsx'],
      contact: 'pierre.martin@entreprise.com',
      compliance: 'RGPD, ISO 27001'
    },
    {
      id: 5,
      titre: 'Politique de recrutement',
      description: 'Processus et critères de recrutement',
      contenu: 'Cette politique établit les procédures de recrutement, les critères de sélection et les bonnes pratiques pour garantir un processus équitable et transparent.',
      categorie: 'Recrutement',
      statut: 'Active',
      priorite: 'Moyenne',
      version: '2.0',
      dateCreation: '2023-05-15',
      dateMiseAJour: '2023-10-30',
      dateExpiration: '2024-10-30',
      auteur: 'Sophie Garcia',
      approbateur: 'Marie Dubois',
      pages: 10,
      mots: 3200,
      couleur: 'orange',
      urgent: false,
      tags: ['Recrutement', 'Équité', 'Transparence'],
      sections: ['Processus', 'Critères', 'Entretiens', 'Décisions'],
      documents: ['Grille d\'évaluation.xlsx', 'Guide entretien.pdf'],
      contact: 'sophie.garcia@entreprise.com',
      compliance: 'Code du travail, Non-discrimination'
    },
    {
      id: 6,
      titre: 'Politique de rémunération',
      description: 'Structure salariale et politique de rémunération',
      contenu: 'Cette politique définit la structure salariale, les critères d\'évolution et les éléments de rémunération variable. Elle garantit l\'équité et la transparence.',
      categorie: 'Rémunération',
      statut: 'Brouillon',
      priorite: 'Haute',
      version: '1.0',
      dateCreation: '2024-01-20',
      dateMiseAJour: '2024-01-20',
      dateExpiration: '2025-01-20',
      auteur: 'Lucas Rousseau',
      approbateur: 'Jean Dupont',
      pages: 14,
      mots: 4200,
      couleur: 'yellow',
      urgent: false,
      tags: ['Rémunération', 'Salaires', 'Primes'],
      sections: ['Structure', 'Évolution', 'Primes', 'Transparence'],
      documents: ['Grille salariale.xlsx', 'Politique primes.pdf'],
      contact: 'lucas.rousseau@entreprise.com',
      compliance: 'Code du travail, Égalité salariale'
    }
  ];

  const categories = ['Télétravail', 'Congés', 'Formation', 'Sécurité', 'Recrutement', 'Rémunération', 'Général'];
  const statuts = ['Active', 'Brouillon', 'Archivée', 'Expirée', 'En révision'];
  const priorites = ['Critique', 'Haute', 'Moyenne', 'Basse'];

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Télétravail':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Congés':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Formation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sécurité':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Recrutement':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Rémunération':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Général':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Brouillon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archivée':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Expirée':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'En révision':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'Critique':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Haute':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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
      case 'Télétravail':
        return <HomeIcon className="h-5 w-5" />;
      case 'Congés':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'Formation':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'Sécurité':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'Recrutement':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'Rémunération':
        return <TrophyIcon className="h-5 w-5" />;
      case 'Général':
        return <DocumentTextIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const filteredPolitiques = politiques.filter(politique => {
    const matchesSearch = !searchTerm || 
      politique.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politique.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politique.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politique.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategorie = filterCategorie === 'tous' || politique.categorie === filterCategorie;
    const matchesStatut = filterStatut === 'tous' || politique.statut === filterStatut;
    const matchesPriorite = filterPriorite === 'tous' || politique.priorite === filterPriorite;
    return matchesSearch && matchesCategorie && matchesStatut && matchesPriorite;
  });

  const stats = {
    totalPolitiques: politiques.length,
    actives: politiques.filter(p => p.statut === 'Active').length,
    brouillons: politiques.filter(p => p.statut === 'Brouillon').length,
    enRevision: politiques.filter(p => p.statut === 'En révision').length,
    totalPages: politiques.reduce((sum, p) => sum + p.pages, 0),
    totalMots: politiques.reduce((sum, p) => sum + p.mots, 0),
    urgentes: politiques.filter(p => p.urgent).length
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

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 min-h-screen">
      {/* Header avec design spécial */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full mb-4">
          <DocumentTextIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-2">
          Politiques RH
        </h1>
        <p className="text-gray-600 text-lg">Règlementation et procédures des ressources humaines</p>
      </div>

      {/* Stats Cards avec design en mosaïque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-slate-500 to-slate-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-100 text-sm font-medium">Total Politiques</p>
              <p className="text-3xl font-bold">{stats.totalPolitiques}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-slate-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Actives</p>
              <p className="text-3xl font-bold">{stats.actives}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Brouillons</p>
              <p className="text-3xl font-bold">{stats.brouillons}</p>
            </div>
            <PencilIcon className="h-8 w-8 text-yellow-200" />
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
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Mots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMots.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Révision</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enRevision}</p>
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
                  className="w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
              >
                <option value="tous">Toutes les catégories</option>
                {categories.map(categorie => (
                  <option key={categorie} value={categorie}>{categorie}</option>
                ))}
              </select>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterPriorite}
                onChange={(e) => setFilterPriorite(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
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
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              {filteredPolitiques.length} politique(s) trouvée(s)
            </p>
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-all ${viewMode === 'masonry' ? 'bg-slate-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Masonry"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-slate-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Timeline"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-slate-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Tableau"
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
          {viewMode === 'masonry' ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredPolitiques.map((politique) => (
                <div key={politique.id} className="break-inside-avoid bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${politique.couleur === 'blue' ? 'bg-blue-100' : politique.couleur === 'green' ? 'bg-green-100' : politique.couleur === 'purple' ? 'bg-purple-100' : politique.couleur === 'red' ? 'bg-red-100' : politique.couleur === 'orange' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                      {getCategorieIcon(politique.categorie)}
                    </div>
                    {politique.urgent && (
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        URGENT
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-slate-600 transition-colors line-clamp-2">
                    {politique.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{politique.description}</p>

                  {/* Version et dates */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Version {politique.version}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      Mise à jour : {formatDate(politique.dateMiseAJour)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Expire : {formatDate(politique.dateExpiration)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{politique.pages}</p>
                      <p className="text-xs text-gray-500">Pages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{politique.mots.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Mots</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {politique.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-700 text-xs rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Sections */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Sections :</h4>
                    <div className="flex flex-wrap gap-1">
                      {politique.sections.slice(0, 3).map((section, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                          {section}
                        </span>
                      ))}
                      {politique.sections.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                          +{politique.sections.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {politique.auteur}
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-slate-600 transition-colors">
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
              {filteredPolitiques.map((politique, index) => (
                <div key={politique.id} className="relative">
                  {/* Timeline line */}
                  {index < filteredPolitiques.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-slate-200 to-gray-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-6">
                    {/* Timeline dot */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                      politique.statut === 'Active' ? 'bg-green-500' :
                      politique.statut === 'Brouillon' ? 'bg-yellow-500' :
                      politique.statut === 'En révision' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      {getCategorieIcon(politique.categorie)}
                    </div>
                    
                    {/* Content card */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{politique.titre}</h3>
                          <p className="text-gray-600 mb-3">{politique.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-1" />
                              {politique.auteur}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {getTimeAgo(politique.dateMiseAJour)}
                            </span>
                            <span className="flex items-center">
                              <DocumentTextIcon className="h-4 w-4 mr-1" />
                              {politique.pages} pages
                            </span>
                          </div>
                        </div>
                        {politique.urgent && (
                          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                            URGENT
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(politique.statut)}`}>
                          {politique.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategorieColor(politique.categorie)}`}>
                          {politique.categorie}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioriteColor(politique.priorite)}`}>
                          {politique.priorite}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <DocumentTextIcon className="h-4 w-4 mr-1" />
                            Version {politique.version}
                          </span>
                          <span className="flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            {formatDate(politique.dateExpiration)}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-slate-600 transition-colors">
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Politique</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mise à jour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPolitiques.map((politique) => (
                    <tr key={politique.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${politique.couleur === 'blue' ? 'bg-blue-100' : politique.couleur === 'green' ? 'bg-green-100' : politique.couleur === 'purple' ? 'bg-purple-100' : politique.couleur === 'red' ? 'bg-red-100' : politique.couleur === 'orange' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                            {getCategorieIcon(politique.categorie)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{politique.titre}</div>
                            <div className="text-sm text-gray-500">{politique.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategorieColor(politique.categorie)}`}>
                          {politique.categorie}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatutColor(politique.statut)}`}>
                          {politique.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {politique.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {politique.auteur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(politique.dateMiseAJour)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-slate-600 hover:text-slate-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la politique</h3>
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

export default PolitiquesRH;
