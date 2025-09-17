import React, { useState, useEffect } from 'react';
import {
  UserPlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Integration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterPhase, setFilterPhase] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');

  // Données de démonstration
  const integrations = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      poste: 'Comptable Senior',
      departement: 'Finance',
      dateDebut: '2024-02-01',
      dateFin: '2024-02-29',
      statut: 'En cours',
      phaseActuelle: 'Formation métier',
      tuteur: 'Marie Dubois',
      tuteurEmail: 'marie.dubois@email.com',
      score: 4.8,
      priorite: 'Haute',
      etapes: [
        {
          id: 1,
          nom: 'Accueil administratif',
          statut: 'Terminée',
          date: '2024-02-01',
          responsable: 'Sophie Martin',
          commentaire: 'Documents signés, accès créés',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présentation équipe',
          statut: 'Terminée',
          date: '2024-02-02',
          responsable: 'Marie Dubois',
          commentaire: 'Très bonne intégration',
          couleur: 'green'
        },
        {
          id: 3,
          nom: 'Formation outils',
          statut: 'Terminée',
          date: '2024-02-05',
          responsable: 'Thomas Moreau',
          commentaire: 'Formation Sage terminée',
          couleur: 'green'
        },
        {
          id: 4,
          nom: 'Formation métier',
          statut: 'En cours',
          date: '2024-02-08',
          responsable: 'Marie Dubois',
          commentaire: 'Formation comptabilité en cours',
          couleur: 'yellow'
        },
        {
          id: 5,
          nom: 'Mise en pratique',
          statut: 'En attente',
          date: null,
          responsable: 'Marie Dubois',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 6,
          nom: 'Évaluation finale',
          statut: 'En attente',
          date: null,
          responsable: 'Sophie Martin',
          commentaire: '',
          couleur: 'gray'
        }
      ],
      objectifs: [
        'Maîtriser les outils comptables',
        'Comprendre les processus internes',
        'Intégrer l\'équipe Finance',
        'Être autonome sur les tâches courantes'
      ],
      formations: [
        'Formation Sage (8h)',
        'Processus comptables (4h)',
        'Outils internes (2h)'
      ],
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      poste: 'Designer UX/UI',
      departement: 'Design',
      dateDebut: '2024-02-15',
      dateFin: '2024-03-15',
      statut: 'En cours',
      phaseActuelle: 'Mise en pratique',
      tuteur: 'Lucas Rousseau',
      tuteurEmail: 'lucas.rousseau@email.com',
      score: 4.5,
      priorite: 'Haute',
      etapes: [
        {
          id: 1,
          nom: 'Accueil administratif',
          statut: 'Terminée',
          date: '2024-02-15',
          responsable: 'Sophie Martin',
          commentaire: 'Intégration administrative OK',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présentation équipe',
          statut: 'Terminée',
          date: '2024-02-16',
          responsable: 'Lucas Rousseau',
          commentaire: 'Équipe Design très accueillante',
          couleur: 'green'
        },
        {
          id: 3,
          nom: 'Formation outils',
          statut: 'Terminée',
          date: '2024-02-19',
          responsable: 'Lucas Rousseau',
          commentaire: 'Formation Figma et Adobe terminée',
          couleur: 'green'
        },
        {
          id: 4,
          nom: 'Formation métier',
          statut: 'Terminée',
          date: '2024-02-22',
          responsable: 'Lucas Rousseau',
          commentaire: 'Formation UX/UI excellente',
          couleur: 'green'
        },
        {
          id: 5,
          nom: 'Mise en pratique',
          statut: 'En cours',
          date: '2024-02-26',
          responsable: 'Lucas Rousseau',
          commentaire: 'Premier projet en cours',
          couleur: 'yellow'
        },
        {
          id: 6,
          nom: 'Évaluation finale',
          statut: 'En attente',
          date: null,
          responsable: 'Sophie Martin',
          commentaire: '',
          couleur: 'gray'
        }
      ],
      objectifs: [
        'Maîtriser les outils de design',
        'Comprendre la charte graphique',
        'Intégrer l\'équipe Design',
        'Réaliser le premier projet'
      ],
      formations: [
        'Formation Figma (6h)',
        'Charte graphique (2h)',
        'Processus créatifs (4h)'
      ],
      couleur: 'blue'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      poste: 'Développeur Full Stack Senior',
      departement: 'IT',
      dateDebut: '2024-01-15',
      dateFin: '2024-02-15',
      statut: 'Terminée',
      phaseActuelle: 'Évaluation finale',
      tuteur: 'Thomas Moreau',
      tuteurEmail: 'thomas.moreau@email.com',
      score: 4.9,
      priorite: 'Haute',
      etapes: [
        {
          id: 1,
          nom: 'Accueil administratif',
          statut: 'Terminée',
          date: '2024-01-15',
          responsable: 'Sophie Martin',
          commentaire: 'Intégration parfaite',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présentation équipe',
          statut: 'Terminée',
          date: '2024-01-16',
          responsable: 'Thomas Moreau',
          commentaire: 'Très bonne intégration',
          couleur: 'green'
        },
        {
          id: 3,
          nom: 'Formation outils',
          statut: 'Terminée',
          date: '2024-01-19',
          responsable: 'Thomas Moreau',
          commentaire: 'Formation technique excellente',
          couleur: 'green'
        },
        {
          id: 4,
          nom: 'Formation métier',
          statut: 'Terminée',
          date: '2024-01-22',
          responsable: 'Thomas Moreau',
          commentaire: 'Formation complète',
          couleur: 'green'
        },
        {
          id: 5,
          nom: 'Mise en pratique',
          statut: 'Terminée',
          date: '2024-01-29',
          responsable: 'Thomas Moreau',
          commentaire: 'Premier projet réussi',
          couleur: 'green'
        },
        {
          id: 6,
          nom: 'Évaluation finale',
          statut: 'Terminée',
          date: '2024-02-15',
          responsable: 'Sophie Martin',
          commentaire: 'Intégration réussie !',
          couleur: 'green'
        }
      ],
      objectifs: [
        'Maîtriser l\'architecture technique',
        'Comprendre les processus de développement',
        'Intégrer l\'équipe IT',
        'Être autonome sur les projets'
      ],
      formations: [
        'Architecture technique (8h)',
        'Processus de développement (4h)',
        'Outils de collaboration (2h)'
      ],
      couleur: 'green'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      poste: 'Chef de Projet Marketing Digital',
      departement: 'Marketing',
      dateDebut: '2024-01-20',
      dateFin: '2024-02-20',
      statut: 'En attente',
      phaseActuelle: 'Accueil administratif',
      tuteur: 'Emma Petit',
      tuteurEmail: 'emma.petit@email.com',
      score: 4.2,
      priorite: 'Moyenne',
      etapes: [
        {
          id: 1,
          nom: 'Accueil administratif',
          statut: 'En cours',
          date: '2024-01-20',
          responsable: 'Sophie Martin',
          commentaire: 'En cours de finalisation',
          couleur: 'yellow'
        },
        {
          id: 2,
          nom: 'Présentation équipe',
          statut: 'En attente',
          date: null,
          responsable: 'Emma Petit',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 3,
          nom: 'Formation outils',
          statut: 'En attente',
          date: null,
          responsable: 'Emma Petit',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 4,
          nom: 'Formation métier',
          statut: 'En attente',
          date: null,
          responsable: 'Emma Petit',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 5,
          nom: 'Mise en pratique',
          statut: 'En attente',
          date: null,
          responsable: 'Emma Petit',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 6,
          nom: 'Évaluation finale',
          statut: 'En attente',
          date: null,
          responsable: 'Sophie Martin',
          commentaire: '',
          couleur: 'gray'
        }
      ],
      objectifs: [
        'Maîtriser les outils marketing',
        'Comprendre la stratégie digitale',
        'Intégrer l\'équipe Marketing',
        'Lancer le premier projet'
      ],
      formations: [
        'Outils marketing (6h)',
        'Stratégie digitale (4h)',
        'Processus créatifs (2h)'
      ],
      couleur: 'orange'
    }
  ];

  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'Commercial', 'RH', 'Production'];
  const statuts = ['En cours', 'Terminée', 'En attente', 'Reportée'];
  const phases = ['Accueil administratif', 'Présentation équipe', 'Formation outils', 'Formation métier', 'Mise en pratique', 'Évaluation finale'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Terminée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Reportée':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEtapeColor = (statut) => {
    switch (statut) {
      case 'Terminée':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'En attente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      case 'Commercial':
        return 'bg-orange-100 text-orange-800';
      case 'RH':
        return 'bg-indigo-100 text-indigo-800';
      case 'Production':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = !searchTerm || 
      integration.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.poste.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || integration.statut === filterStatus;
    const matchesPhase = filterPhase === 'tous' || integration.phaseActuelle === filterPhase;
    const matchesDepartement = filterDepartement === 'tous' || integration.departement === filterDepartement;
    return matchesSearch && matchesStatus && matchesPhase && matchesDepartement;
  });

  const stats = {
    totalIntegrations: integrations.length,
    enCours: integrations.filter(i => i.statut === 'En cours').length,
    terminees: integrations.filter(i => i.statut === 'Terminée').length,
    enAttente: integrations.filter(i => i.statut === 'En attente').length,
    reportees: integrations.filter(i => i.statut === 'Reportée').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getInitials = (nom) => {
    return nom.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getProgressPercentage = (etapes) => {
    const etapesTerminees = etapes.filter(e => e.statut === 'Terminée').length;
    return Math.round((etapesTerminees / etapes.length) * 100);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Intégration</h1>
        <p className="text-gray-600">Suivi des processus d'intégration des nouveaux employés</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserPlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalIntegrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
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
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.terminees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reportées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reportees}</p>
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
                  placeholder="Rechercher par employé, poste ou département..."
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
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Toutes les phases</option>
                {phases.map(phase => (
                  <option key={phase} value={phase}>{phase}</option>
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
              {filteredIntegrations.length} intégration(s) trouvée(s)
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-lg ${viewMode === 'timeline' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
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
          {viewMode === 'timeline' ? (
            <div className="space-y-8">
              {filteredIntegrations.map((integration) => (
                <div key={integration.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(integration.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {integration.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{integration.poste}</p>
                        <p className="text-xs text-gray-500">{integration.employeEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{integration.phaseActuelle}</p>
                        <p className="text-xs text-gray-500">
                          {getProgressPercentage(integration.etapes)}% terminé
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(integration.statut)}`}>
                          {integration.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioriteColor(integration.priorite)}`}>
                          {integration.priorite}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(integration.departement)}`}>
                          {integration.departement}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Progression</span>
                      <span>{getProgressPercentage(integration.etapes)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(integration.etapes)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                    <div className="space-y-4">
                      {integration.etapes.map((etape, index) => (
                        <div key={etape.id} className="relative flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            etape.statut === 'Terminée' ? 'bg-green-500' :
                            etape.statut === 'En cours' ? 'bg-yellow-500' :
                            'bg-gray-300'
                          }`}>
                            {etape.statut === 'Terminée' ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : etape.statut === 'En cours' ? (
                              <ClockIcon className="h-5 w-5 text-white" />
                            ) : (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{etape.nom}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEtapeColor(etape.statut)}`}>
                                {etape.statut}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {etape.responsable} • {formatDate(etape.date)}
                            </p>
                            {etape.commentaire && (
                              <p className="text-xs text-gray-600 mt-1">{etape.commentaire}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objectifs et Formations */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Objectifs</h4>
                      <ul className="space-y-1">
                        {integration.objectifs.map((objectif, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center">
                            <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2" />
                            {objectif}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Formations</h4>
                      <ul className="space-y-1">
                        {integration.formations.map((formation, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center">
                            <BookOpenIcon className="h-3 w-3 text-blue-500 mr-2" />
                            {formation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Tuteur: {integration.tuteur}</span>
                      <span>Début: {formatDate(integration.dateDebut)}</span>
                      {integration.dateFin && (
                        <span>Fin: {formatDate(integration.dateFin)}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{integration.score}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIntegrations.map((integration) => (
                <div key={integration.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(integration.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {integration.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{integration.poste}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{integration.employeEmail}</span>
                          <span className="text-sm text-gray-500">{integration.phaseActuelle}</span>
                          <span className="text-sm text-gray-500">Tuteur: {integration.tuteur}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {getProgressPercentage(integration.etapes)}% terminé
                        </p>
                        <p className="text-xs text-gray-500">
                          {integration.etapes.filter(e => e.statut === 'Terminée').length}/{integration.etapes.length} étapes
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(integration.statut)}`}>
                          {integration.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioriteColor(integration.priorite)}`}>
                          {integration.priorite}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(integration.departement)}`}>
                          {integration.departement}
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
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'intégration</h3>
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

export default Integration;
