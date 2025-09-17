import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
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
  ShieldCheckIcon,
  CalculatorIcon,
  ChartBarSquareIcon,
  TrophyIcon,
  FireIcon,
  PlayIcon,
  VideoCameraIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Formations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [filterModalite, setFilterModalite] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');

  // Données de démonstration
  const formations = [
    {
      id: 1,
      titre: 'Développement Web Full Stack',
      description: 'Formation complète aux technologies web modernes (React, Node.js, MongoDB)',
      type: 'Formation technique',
      modalite: 'Présentiel',
      statut: 'En cours',
      duree: 40,
      dateDebut: '2024-01-15',
      dateFin: '2024-03-15',
      formateur: 'Alexandre Dubois',
      lieu: 'Salle de formation A',
      participants: 12,
      cout: 2500,
      niveau: 'Intermédiaire',
      competences: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      objectifs: ['Maîtriser le développement full stack', 'Créer des applications web complètes'],
      evaluation: 'Projet final + QCM',
      certificat: true,
      couleur: 'blue'
    },
    {
      id: 2,
      titre: 'Leadership et Management d\'équipe',
      description: 'Développer ses compétences managériales et de leadership',
      type: 'Formation managériale',
      modalite: 'Hybride',
      statut: 'Programmée',
      duree: 24,
      dateDebut: '2024-02-01',
      dateFin: '2024-02-28',
      formateur: 'Marie Dubois',
      lieu: 'Salle de conférence + Online',
      participants: 8,
      cout: 1800,
      niveau: 'Avancé',
      competences: ['Leadership', 'Communication', 'Gestion d\'équipe'],
      objectifs: ['Améliorer les compétences managériales', 'Développer le leadership'],
      evaluation: 'Mise en situation + Feedback 360°',
      certificat: true,
      couleur: 'purple'
    },
    {
      id: 3,
      titre: 'Design UX/UI Avancé',
      description: 'Perfectionnement en design d\'expérience utilisateur et interface',
      type: 'Formation créative',
      modalite: 'Distanciel',
      statut: 'Terminée',
      duree: 32,
      dateDebut: '2023-11-01',
      dateFin: '2023-12-15',
      formateur: 'Isabella Garcia',
      lieu: 'Plateforme en ligne',
      participants: 15,
      cout: 1200,
      niveau: 'Avancé',
      competences: ['Figma', 'Adobe XD', 'Prototypage', 'User Research'],
      objectifs: ['Maîtriser les outils de design', 'Créer des expériences utilisateur optimales'],
      evaluation: 'Portfolio de projets',
      certificat: true,
      couleur: 'pink'
    },
    {
      id: 4,
      titre: 'Gestion de Projet Agile',
      description: 'Méthodologies agiles et outils de gestion de projet',
      type: 'Formation méthodologique',
      modalite: 'Présentiel',
      statut: 'En cours',
      duree: 16,
      dateDebut: '2024-01-08',
      dateFin: '2024-01-26',
      formateur: 'Sophie Martin',
      lieu: 'Salle de formation B',
      participants: 10,
      cout: 900,
      niveau: 'Intermédiaire',
      competences: ['Scrum', 'Kanban', 'Jira', 'Planning'],
      objectifs: ['Maîtriser les méthodologies agiles', 'Optimiser la gestion de projet'],
      evaluation: 'Simulation de projet + Certification',
      certificat: true,
      couleur: 'green'
    },
    {
      id: 5,
      titre: 'Marketing Digital et Réseaux Sociaux',
      description: 'Stratégies digitales et gestion des réseaux sociaux',
      type: 'Formation marketing',
      modalite: 'Hybride',
      statut: 'Programmée',
      duree: 20,
      dateDebut: '2024-03-01',
      dateFin: '2024-03-22',
      formateur: 'Emma Petit',
      lieu: 'Salle de formation C + Online',
      participants: 14,
      cout: 1100,
      niveau: 'Débutant',
      competences: ['SEO', 'Google Ads', 'Facebook Ads', 'Analytics'],
      objectifs: ['Développer une stratégie digitale', 'Optimiser la présence en ligne'],
      evaluation: 'Campagne marketing + Rapport d\'analyse',
      certificat: false,
      couleur: 'orange'
    },
    {
      id: 6,
      titre: 'Sécurité Informatique',
      description: 'Bonnes pratiques et outils de sécurité informatique',
      type: 'Formation technique',
      modalite: 'Distanciel',
      statut: 'Terminée',
      duree: 28,
      dateDebut: '2023-10-01',
      dateFin: '2023-11-10',
      formateur: 'Thomas Moreau',
      lieu: 'Plateforme en ligne',
      participants: 18,
      cout: 1500,
      niveau: 'Intermédiaire',
      competences: ['Cybersécurité', 'Ethical Hacking', 'Audit sécurité'],
      objectifs: ['Comprendre les enjeux de sécurité', 'Mettre en place des mesures de protection'],
      evaluation: 'Audit de sécurité + Rapport',
      certificat: true,
      couleur: 'red'
    },
    {
      id: 7,
      titre: 'Communication Interpersonnelle',
      description: 'Améliorer sa communication et ses relations professionnelles',
      type: 'Formation soft skills',
      modalite: 'Présentiel',
      statut: 'En cours',
      duree: 12,
      dateDebut: '2024-01-22',
      dateFin: '2024-02-02',
      formateur: 'Lucas Rousseau',
      lieu: 'Salle de formation D',
      participants: 6,
      cout: 600,
      niveau: 'Débutant',
      competences: ['Communication', 'Écoute active', 'Présentation'],
      objectifs: ['Améliorer la communication', 'Développer l\'écoute active'],
      evaluation: 'Jeux de rôle + Feedback',
      certificat: false,
      couleur: 'indigo'
    },
    {
      id: 8,
      titre: 'Intelligence Artificielle et Machine Learning',
      description: 'Introduction à l\'IA et aux algorithmes de machine learning',
      type: 'Formation technique',
      modalite: 'Hybride',
      statut: 'Programmée',
      duree: 36,
      dateDebut: '2024-04-01',
      dateFin: '2024-05-17',
      formateur: 'Jean Dupont',
      lieu: 'Salle de formation A + Online',
      participants: 20,
      cout: 3000,
      niveau: 'Avancé',
      competences: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science'],
      objectifs: ['Comprendre l\'IA', 'Développer des modèles prédictifs'],
      evaluation: 'Projet d\'IA + Présentation',
      certificat: true,
      couleur: 'blue'
    }
  ];

  const types = ['Formation technique', 'Formation managériale', 'Formation créative', 'Formation méthodologique', 'Formation marketing', 'Formation soft skills'];
  const statuts = ['En cours', 'Programmée', 'Terminée', 'Annulée', 'Reportée'];
  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];
  const modalites = ['Présentiel', 'Distanciel', 'Hybride'];
  const niveaux = ['Débutant', 'Intermédiaire', 'Avancé'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Formation technique':
        return 'bg-blue-100 text-blue-800';
      case 'Formation managériale':
        return 'bg-purple-100 text-purple-800';
      case 'Formation créative':
        return 'bg-pink-100 text-pink-800';
      case 'Formation méthodologique':
        return 'bg-green-100 text-green-800';
      case 'Formation marketing':
        return 'bg-orange-100 text-orange-800';
      case 'Formation soft skills':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Terminée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Programmée':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Annulée':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Reportée':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModaliteColor = (modalite) => {
    switch (modalite) {
      case 'Présentiel':
        return 'bg-green-100 text-green-800';
      case 'Distanciel':
        return 'bg-blue-100 text-blue-800';
      case 'Hybride':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNiveauColor = (niveau) => {
    switch (niveau) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Formation technique':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'Formation managériale':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'Formation créative':
        return <SparklesIcon className="h-5 w-5" />;
      case 'Formation méthodologique':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'Formation marketing':
        return <GlobeAltIcon className="h-5 w-5" />;
      case 'Formation soft skills':
        return <HeartIcon className="h-5 w-5" />;
      default:
        return <BookOpenIcon className="h-5 w-5" />;
    }
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = !searchTerm || 
      formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.formateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.competences.some(comp => comp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatut = filterStatut === 'tous' || formation.statut === filterStatut;
    const matchesType = filterType === 'tous' || formation.type === filterType;
    const matchesDepartement = filterDepartement === 'tous' || true; // Toutes les formations sont ouvertes à tous
    const matchesModalite = filterModalite === 'tous' || formation.modalite === filterModalite;
    return matchesSearch && matchesStatut && matchesType && matchesDepartement && matchesModalite;
  });

  const stats = {
    totalFormations: formations.length,
    enCours: formations.filter(f => f.statut === 'En cours').length,
    programmees: formations.filter(f => f.statut === 'Programmée').length,
    terminees: formations.filter(f => f.statut === 'Terminée').length,
    totalParticipants: formations.reduce((sum, f) => sum + f.participants, 0),
    totalCout: formations.reduce((sum, f) => sum + f.cout, 0),
    certifications: formations.filter(f => f.certificat).length
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

  const getProgressPercentage = (dateDebut, dateFin) => {
    const now = new Date();
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const total = fin.getTime() - debut.getTime();
    const elapsed = now.getTime() - debut.getTime();
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Header avec design spécial */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <AcademicCapIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Formations
        </h1>
        <p className="text-gray-600 text-lg">Développement des compétences et expertise professionnelle</p>
      </div>

      {/* Stats Cards avec design en mosaïque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Formations</p>
              <p className="text-3xl font-bold">{stats.totalFormations}</p>
            </div>
            <BookOpenIcon className="h-8 w-8 text-blue-200" />
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
              <p className="text-purple-100 text-sm font-medium">Programmées</p>
              <p className="text-3xl font-bold">{stats.programmees}</p>
            </div>
            <CalendarDaysIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Terminées</p>
              <p className="text-3xl font-bold">{stats.terminees}</p>
            </div>
            <TrophyIcon className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCout)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.certifications}</p>
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
                  placeholder="Rechercher par titre, formateur, compétences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="tous">Tous les types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filterModalite}
                onChange={(e) => setFilterModalite(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="tous">Toutes les modalités</option>
                {modalites.map(modalite => (
                  <option key={modalite} value={modalite}>{modalite}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle avec design spécial */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              {filteredFormations.length} formation(s) trouvée(s)
            </p>
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
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
          {viewMode === 'timeline' ? (
            <div className="space-y-8">
              {filteredFormations.map((formation, index) => {
                const progressPercentage = formation.statut === 'En cours' ? 
                  getProgressPercentage(formation.dateDebut, formation.dateFin) : 
                  (formation.statut === 'Terminée' ? 100 : 0);
                
                return (
                  <div key={formation.id} className="relative">
                    {/* Timeline line */}
                    {index < filteredFormations.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-blue-200 to-purple-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-6">
                      {/* Timeline dot */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                        formation.statut === 'Terminée' ? 'bg-green-500' :
                        formation.statut === 'En cours' ? 'bg-blue-500' :
                        formation.statut === 'Programmée' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        {getTypeIcon(formation.type)}
                      </div>
                      
                      {/* Content card */}
                      <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{formation.titre}</h3>
                            <p className="text-gray-600 mb-3">{formation.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                {formation.formateur}
                              </span>
                              <span className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {formation.lieu}
                              </span>
                              <span className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {formation.duree}h
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(formation.cout)}</p>
                            <p className="text-sm text-gray-500">{formation.participants} participants</p>
                          </div>
                        </div>

                        {/* Progress bar pour formations en cours */}
                        {formation.statut === 'En cours' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progression</span>
                              <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(formation.statut)}`}>
                            {formation.statut}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(formation.type)}`}>
                            {formation.type}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getModaliteColor(formation.modalite)}`}>
                            {formation.modalite}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getNiveauColor(formation.niveau)}`}>
                            {formation.niveau}
                          </span>
                          {formation.certificat && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <CheckBadgeIcon className="h-4 w-4 inline mr-1" />
                              Certificat
                            </span>
                          )}
                        </div>

                        {/* Compétences */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Compétences visées :</h4>
                          <div className="flex flex-wrap gap-2">
                            {formation.competences.map((competence, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                {competence}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {formatDate(formation.dateDebut)} - {formatDate(formation.dateFin)}
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFormations.map((formation) => (
                <div key={formation.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${formation.couleur === 'blue' ? 'bg-blue-100' : formation.couleur === 'purple' ? 'bg-purple-100' : formation.couleur === 'pink' ? 'bg-pink-100' : formation.couleur === 'green' ? 'bg-green-100' : formation.couleur === 'orange' ? 'bg-orange-100' : formation.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-red-100'}`}>
                      {getTypeIcon(formation.type)}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(formation.cout)}</p>
                      <p className="text-sm text-gray-500">{formation.duree}h</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {formation.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{formation.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {formation.formateur}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {formation.lieu}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      {formation.participants} participants
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(formation.statut)}`}>
                      {formation.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModaliteColor(formation.modalite)}`}>
                      {formation.modalite}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNiveauColor(formation.niveau)}`}>
                      {formation.niveau}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {formatDate(formation.dateDebut)} - {formatDate(formation.dateFin)}
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFormations.map((formation) => (
                <div key={formation.id} className="bg-white rounded-xl p-6 shadow-sm border-0 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${formation.couleur === 'blue' ? 'bg-blue-100' : formation.couleur === 'purple' ? 'bg-purple-100' : formation.couleur === 'pink' ? 'bg-pink-100' : formation.couleur === 'green' ? 'bg-green-100' : formation.couleur === 'orange' ? 'bg-orange-100' : formation.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-red-100'}`}>
                        {getTypeIcon(formation.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{formation.titre}</h3>
                        <p className="text-sm text-gray-600">{formation.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{formation.formateur}</span>
                          <span className="text-sm text-gray-500">{formation.duree}h</span>
                          <span className="text-sm text-gray-500">{formation.participants} participants</span>
                          <span className="text-sm text-gray-500">{formatCurrency(formation.cout)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formation.lieu}</p>
                        <p className="text-xs text-gray-500">{formatDate(formation.dateDebut)} - {formatDate(formation.dateFin)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(formation.statut)}`}>
                          {formation.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(formation.type)}`}>
                          {formation.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la formation</h3>
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

export default Formations;
