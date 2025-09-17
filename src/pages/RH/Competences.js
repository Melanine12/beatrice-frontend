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
  SparklesIcon,
  CpuChipIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  PresentationChartLineIcon,
  LanguageIcon,
  CogIcon,
  WrenchIcon,
  BeakerIcon,
  CommandLineIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  ServerIcon,
  DatabaseIcon,
  LockClosedIcon,
  KeyIcon,
  EyeSlashIcon,
  ShieldExclamationIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
  CheckIcon,
  XMarkIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowUturnUpIcon,
  ArrowUturnDownIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';

const Competences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('tous');
  const [filterNiveau, setFilterNiveau] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterEmploye, setFilterEmploye] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState(null);
  const [viewMode, setViewMode] = useState('radar');

  // Données de démonstration
  const competences = [
    {
      id: 1,
      nom: 'React.js',
      description: 'Bibliothèque JavaScript pour la construction d\'interfaces utilisateur',
      categorie: 'Développement Frontend',
      niveau: 'Avancé',
      statut: 'Validée',
      employe: 'Jean Dupont',
      score: 85,
      dateEvaluation: '2024-01-15',
      formateur: 'Alexandre Dubois',
      certification: 'React Certified Developer',
      cout: 1200,
      duree: 40,
      competencesLiees: ['JavaScript', 'HTML/CSS', 'Redux', 'TypeScript'],
      projets: ['Application E-commerce', 'Dashboard Admin', 'App Mobile'],
      couleur: 'blue'
    },
    {
      id: 2,
      nom: 'Leadership',
      description: 'Capacité à diriger et motiver une équipe vers l\'atteinte d\'objectifs',
      categorie: 'Soft Skills',
      niveau: 'Intermédiaire',
      statut: 'En cours',
      employe: 'Marie Dubois',
      score: 70,
      dateEvaluation: '2024-01-20',
      formateur: 'Sophie Martin',
      certification: 'Leadership Essentials',
      cout: 800,
      duree: 24,
      competencesLiees: ['Communication', 'Gestion d\'équipe', 'Motivation'],
      projets: ['Restructuration équipe', 'Formation nouveaux managers'],
      couleur: 'purple'
    },
    {
      id: 3,
      nom: 'Python',
      description: 'Langage de programmation polyvalent pour le développement et l\'analyse de données',
      categorie: 'Développement Backend',
      niveau: 'Expert',
      statut: 'Validée',
      employe: 'Thomas Moreau',
      score: 95,
      dateEvaluation: '2023-12-10',
      formateur: 'Isabella Garcia',
      certification: 'Python Professional',
      cout: 1500,
      duree: 50,
      competencesLiees: ['Django', 'Flask', 'Pandas', 'NumPy', 'Machine Learning'],
      projets: ['API REST', 'Analyse de données', 'Automatisation'],
      couleur: 'green'
    },
    {
      id: 4,
      nom: 'Design UX/UI',
      description: 'Conception d\'expériences utilisateur et d\'interfaces utilisateur',
      categorie: 'Design',
      niveau: 'Avancé',
      statut: 'Validée',
      employe: 'Emma Petit',
      score: 88,
      dateEvaluation: '2024-01-05',
      formateur: 'Lucas Rousseau',
      certification: 'UX/UI Design Master',
      cout: 2000,
      duree: 60,
      competencesLiees: ['Figma', 'Adobe XD', 'Prototypage', 'User Research'],
      projets: ['Redesign site web', 'App mobile', 'Dashboard analytics'],
      couleur: 'pink'
    },
    {
      id: 5,
      nom: 'Gestion de Projet Agile',
      description: 'Méthodologies agiles et outils de gestion de projet',
      categorie: 'Management',
      niveau: 'Intermédiaire',
      statut: 'En cours',
      employe: 'Pierre Martin',
      score: 75,
      dateEvaluation: '2024-01-25',
      formateur: 'Marie Dubois',
      certification: 'Certified Scrum Master',
      cout: 1000,
      duree: 32,
      competencesLiees: ['Scrum', 'Kanban', 'Jira', 'Planning'],
      projets: ['Migration système', 'Développement produit'],
      couleur: 'orange'
    },
    {
      id: 6,
      nom: 'Cybersécurité',
      description: 'Protection des systèmes informatiques contre les menaces',
      categorie: 'Sécurité',
      niveau: 'Avancé',
      statut: 'Validée',
      employe: 'Sophie Garcia',
      score: 82,
      dateEvaluation: '2023-11-30',
      formateur: 'Thomas Moreau',
      certification: 'Certified Ethical Hacker',
      cout: 2500,
      duree: 45,
      competencesLiees: ['Ethical Hacking', 'Audit sécurité', 'Penetration Testing'],
      projets: ['Audit sécurité', 'Formation équipe', 'Mise en place politiques'],
      couleur: 'red'
    },
    {
      id: 7,
      nom: 'Communication',
      description: 'Capacité à communiquer efficacement à l\'oral et à l\'écrit',
      categorie: 'Soft Skills',
      niveau: 'Débutant',
      statut: 'En cours',
      employe: 'Lucas Rousseau',
      score: 60,
      dateEvaluation: '2024-02-01',
      formateur: 'Emma Petit',
      certification: 'Communication Excellence',
      cout: 500,
      duree: 16,
      competencesLiees: ['Présentation', 'Écoute active', 'Négociation'],
      projets: ['Formation équipe', 'Présentations clients'],
      couleur: 'indigo'
    },
    {
      id: 8,
      nom: 'Machine Learning',
      description: 'Algorithmes d\'apprentissage automatique et intelligence artificielle',
      categorie: 'Data Science',
      niveau: 'Expert',
      statut: 'Validée',
      employe: 'Jean Dupont',
      score: 92,
      dateEvaluation: '2023-10-15',
      formateur: 'Isabella Garcia',
      certification: 'ML Engineer Professional',
      cout: 3000,
      duree: 80,
      competencesLiees: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning'],
      projets: ['Modèle prédictif', 'Recommandation système', 'Classification images'],
      couleur: 'blue'
    }
  ];

  const categories = ['Développement Frontend', 'Développement Backend', 'Design', 'Management', 'Sécurité', 'Soft Skills', 'Data Science'];
  const niveaux = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  const statuts = ['Validée', 'En cours', 'À évaluer', 'Expirée'];
  const employes = ['Jean Dupont', 'Marie Dubois', 'Thomas Moreau', 'Emma Petit', 'Pierre Martin', 'Sophie Garcia', 'Lucas Rousseau'];

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Développement Frontend':
        return 'bg-blue-100 text-blue-800';
      case 'Développement Backend':
        return 'bg-green-100 text-green-800';
      case 'Design':
        return 'bg-pink-100 text-pink-800';
      case 'Management':
        return 'bg-orange-100 text-orange-800';
      case 'Sécurité':
        return 'bg-red-100 text-red-800';
      case 'Soft Skills':
        return 'bg-indigo-100 text-indigo-800';
      case 'Data Science':
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
        return 'bg-orange-100 text-orange-800';
      case 'Expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Validée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'À évaluer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expirée':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategorieIcon = (categorie) => {
    switch (categorie) {
      case 'Développement Frontend':
        return <CodeBracketIcon className="h-5 w-5" />;
      case 'Développement Backend':
        return <ServerIcon className="h-5 w-5" />;
      case 'Design':
        return <PaintBrushIcon className="h-5 w-5" />;
      case 'Management':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'Sécurité':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'Soft Skills':
        return <HeartIcon className="h-5 w-5" />;
      case 'Data Science':
        return <CpuChipIcon className="h-5 w-5" />;
      default:
        return <AcademicCapIcon className="h-5 w-5" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    if (score >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const filteredCompetences = competences.filter(competence => {
    const matchesSearch = !searchTerm || 
      competence.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competence.employe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competence.competencesLiees.some(comp => comp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategorie = filterCategorie === 'tous' || competence.categorie === filterCategorie;
    const matchesNiveau = filterNiveau === 'tous' || competence.niveau === filterNiveau;
    const matchesStatut = filterStatut === 'tous' || competence.statut === filterStatut;
    const matchesEmploye = filterEmploye === 'tous' || competence.employe === filterEmploye;
    return matchesSearch && matchesCategorie && matchesNiveau && matchesStatut && matchesEmploye;
  });

  const stats = {
    totalCompetences: competences.length,
    validees: competences.filter(c => c.statut === 'Validée').length,
    enCours: competences.filter(c => c.statut === 'En cours').length,
    aEvaluer: competences.filter(c => c.statut === 'À évaluer').length,
    scoreMoyen: Math.round(competences.reduce((sum, c) => sum + c.score, 0) / competences.length),
    certifications: competences.filter(c => c.certification).length,
    totalCout: competences.reduce((sum, c) => sum + c.cout, 0)
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

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen">
      {/* Header avec design spécial */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4">
          <TrophyIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Compétences
        </h1>
        <p className="text-gray-600 text-lg">Gestion et évaluation des compétences professionnelles</p>
      </div>

      {/* Stats Cards avec design en mosaïque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Compétences</p>
              <p className="text-3xl font-bold">{stats.totalCompetences}</p>
            </div>
            <TrophyIcon className="h-8 w-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Validées</p>
              <p className="text-3xl font-bold">{stats.validees}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">En Cours</p>
              <p className="text-3xl font-bold">{stats.enCours}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Score Moyen</p>
              <p className="text-3xl font-bold">{stats.scoreMoyen}%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.certifications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">À Évaluer</p>
              <p className="text-2xl font-bold text-gray-900">{stats.aEvaluer}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCout)}</p>
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
                  placeholder="Rechercher par nom, employé, compétences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="tous">Toutes les catégories</option>
                {categories.map(categorie => (
                  <option key={categorie} value={categorie}>{categorie}</option>
                ))}
              </select>
              <select
                value={filterNiveau}
                onChange={(e) => setFilterNiveau(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="tous">Tous les niveaux</option>
                {niveaux.map(niveau => (
                  <option key={niveau} value={niveau}>{niveau}</option>
                ))}
              </select>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="tous">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              <select
                value={filterEmploye}
                onChange={(e) => setFilterEmploye(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="tous">Tous les employés</option>
                {employes.map(employe => (
                  <option key={employe} value={employe}>{employe}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle avec design spécial */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              {filteredCompetences.length} compétence(s) trouvée(s)
            </p>
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('radar')}
                className={`p-2 rounded-md transition-all ${viewMode === 'radar' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Radar"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                title="Vue Grille"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
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
          {viewMode === 'radar' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetences.map((competence) => (
                <div key={competence.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  {/* Header avec score */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${competence.couleur === 'blue' ? 'bg-blue-100' : competence.couleur === 'purple' ? 'bg-purple-100' : competence.couleur === 'pink' ? 'bg-pink-100' : competence.couleur === 'green' ? 'bg-green-100' : competence.couleur === 'orange' ? 'bg-orange-100' : competence.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-red-100'}`}>
                      {getCategorieIcon(competence.categorie)}
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(competence.score)} ${getScoreColor(competence.score)}`}>
                        {competence.score}%
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {competence.nom}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{competence.description}</p>

                  {/* Barre de progression du score */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Niveau de maîtrise</span>
                      <span>{competence.niveau}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${competence.score >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' : competence.score >= 80 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : competence.score >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : competence.score >= 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                        style={{ width: `${competence.score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {competence.employe}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {formatDate(competence.dateEvaluation)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BanknotesIcon className="h-4 w-4 mr-2" />
                      {formatCurrency(competence.cout)}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(competence.statut)}`}>
                      {competence.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategorieColor(competence.categorie)}`}>
                      {competence.categorie}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNiveauColor(competence.niveau)}`}>
                      {competence.niveau}
                    </span>
                  </div>

                  {/* Compétences liées */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Compétences liées :</h4>
                    <div className="flex flex-wrap gap-1">
                      {competence.competencesLiees.slice(0, 3).map((comp, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md">
                          {comp}
                        </span>
                      ))}
                      {competence.competencesLiees.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                          +{competence.competencesLiees.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {competence.duree}h de formation
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors">
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
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCompetences.map((competence) => (
                <div key={competence.id} className="bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${competence.couleur === 'blue' ? 'bg-blue-100' : competence.couleur === 'purple' ? 'bg-purple-100' : competence.couleur === 'pink' ? 'bg-pink-100' : competence.couleur === 'green' ? 'bg-green-100' : competence.couleur === 'orange' ? 'bg-orange-100' : competence.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-red-100'}`}>
                      {getCategorieIcon(competence.categorie)}
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${getScoreBgColor(competence.score)} ${getScoreColor(competence.score)}`}>
                        {competence.score}%
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {competence.nom}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{competence.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {competence.employe}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {formatDate(competence.dateEvaluation)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BanknotesIcon className="h-4 w-4 mr-2" />
                      {formatCurrency(competence.cout)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(competence.statut)}`}>
                      {competence.statut}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNiveauColor(competence.niveau)}`}>
                      {competence.niveau}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {competence.duree}h
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors">
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
              {filteredCompetences.map((competence) => (
                <div key={competence.id} className="bg-white rounded-xl p-6 shadow-sm border-0 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${competence.couleur === 'blue' ? 'bg-blue-100' : competence.couleur === 'purple' ? 'bg-purple-100' : competence.couleur === 'pink' ? 'bg-pink-100' : competence.couleur === 'green' ? 'bg-green-100' : competence.couleur === 'orange' ? 'bg-orange-100' : competence.couleur === 'indigo' ? 'bg-indigo-100' : 'bg-red-100'}`}>
                        {getCategorieIcon(competence.categorie)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{competence.nom}</h3>
                        <p className="text-sm text-gray-600">{competence.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{competence.employe}</span>
                          <span className="text-sm text-gray-500">{competence.duree}h</span>
                          <span className="text-sm text-gray-500">{formatCurrency(competence.cout)}</span>
                          <span className={`text-sm font-bold ${getScoreColor(competence.score)}`}>
                            {competence.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{competence.categorie}</p>
                        <p className="text-xs text-gray-500">{formatDate(competence.dateEvaluation)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(competence.statut)}`}>
                          {competence.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getNiveauColor(competence.niveau)}`}>
                          {competence.niveau}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la compétence</h3>
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

export default Competences;
