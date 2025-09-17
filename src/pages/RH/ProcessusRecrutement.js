import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  StarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const ProcessusRecrutement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterOffre, setFilterOffre] = useState('tous');
  const [filterEtape, setFilterEtape] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedProcessus, setSelectedProcessus] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');

  // Données de démonstration
  const processusRecrutement = [
    {
      id: 1,
      candidatId: 1,
      candidatNom: 'Alexandre Dubois',
      candidatEmail: 'alexandre.dubois@email.com',
      offreId: 1,
      offreTitre: 'Développeur Full Stack Senior',
      statut: 'En cours',
      etapeActuelle: 'Entretien technique',
      dateDebut: '2024-01-20',
      dateFin: null,
      etapes: [
        {
          id: 1,
          nom: 'Réception CV',
          statut: 'Terminée',
          date: '2024-01-20',
          responsable: 'Marie Martin',
          commentaire: 'CV reçu et analysé',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présélection',
          statut: 'Terminée',
          date: '2024-01-22',
          responsable: 'Marie Martin',
          commentaire: 'Profil retenu pour la suite',
          couleur: 'green'
        },
        {
          id: 3,
          nom: 'Entretien téléphonique',
          statut: 'Terminée',
          date: '2024-01-25',
          responsable: 'Pierre Bernard',
          commentaire: 'Entretien très positif',
          couleur: 'green'
        },
        {
          id: 4,
          nom: 'Entretien technique',
          statut: 'En cours',
          date: '2024-01-28',
          responsable: 'Thomas Moreau',
          commentaire: 'Test technique en cours',
          couleur: 'yellow'
        },
        {
          id: 5,
          nom: 'Entretien final',
          statut: 'En attente',
          date: null,
          responsable: 'Sophie Leroy',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 6,
          nom: 'Décision finale',
          statut: 'En attente',
          date: null,
          responsable: 'Marie Martin',
          commentaire: '',
          couleur: 'gray'
        }
      ],
      score: 4.5,
      priorite: 'Haute',
      couleur: 'blue'
    },
    {
      id: 2,
      candidatId: 2,
      candidatNom: 'Sophie Martin',
      candidatEmail: 'sophie.martin@email.com',
      offreId: 2,
      offreTitre: 'Chef de Projet Marketing Digital',
      statut: 'En cours',
      etapeActuelle: 'Entretien final',
      dateDebut: '2024-01-18',
      dateFin: null,
      etapes: [
        {
          id: 1,
          nom: 'Réception CV',
          statut: 'Terminée',
          date: '2024-01-18',
          responsable: 'Marie Martin',
          commentaire: 'CV excellent',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présélection',
          statut: 'Terminée',
          date: '2024-01-19',
          responsable: 'Marie Martin',
          commentaire: 'Profil très intéressant',
          couleur: 'green'
        },
        {
          id: 3,
          nom: 'Entretien téléphonique',
          statut: 'Terminée',
          date: '2024-01-22',
          responsable: 'Pierre Bernard',
          commentaire: 'Très bonne communication',
          couleur: 'green'
        },
        {
          id: 4,
          nom: 'Test pratique',
          statut: 'Terminée',
          date: '2024-01-25',
          responsable: 'Thomas Moreau',
          commentaire: 'Résultats excellents',
          couleur: 'green'
        },
        {
          id: 5,
          nom: 'Entretien final',
          statut: 'En cours',
          date: '2024-01-30',
          responsable: 'Sophie Leroy',
          commentaire: 'Entretien prévu demain',
          couleur: 'yellow'
        },
        {
          id: 6,
          nom: 'Décision finale',
          statut: 'En attente',
          date: null,
          responsable: 'Marie Martin',
          commentaire: '',
          couleur: 'gray'
        }
      ],
      score: 4.7,
      priorite: 'Haute',
      couleur: 'green'
    },
    {
      id: 3,
      candidatId: 3,
      candidatNom: 'Pierre Bernard',
      candidatEmail: 'pierre.bernard@email.com',
      offreId: 3,
      offreTitre: 'Comptable Senior',
      statut: 'Terminé',
      etapeActuelle: 'Décision finale',
      dateDebut: '2024-01-15',
      dateFin: '2024-01-28',
      etapes: [
        {
          id: 1,
          nom: 'Réception CV',
          statut: 'Terminée',
          date: '2024-01-15',
          responsable: 'Marie Martin',
          commentaire: 'CV très complet',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présélection',
          statut: 'Terminée',
          date: '2024-01-16',
          responsable: 'Marie Martin',
          commentaire: 'Profil parfait',
          couleur: 'green'
        },
        {
          id: 3,
          nom: 'Entretien téléphonique',
          statut: 'Terminée',
          date: '2024-01-18',
          responsable: 'Pierre Bernard',
          commentaire: 'Entretien excellent',
          couleur: 'green'
        },
        {
          id: 4,
          nom: 'Test technique',
          statut: 'Terminée',
          date: '2024-01-22',
          responsable: 'Thomas Moreau',
          commentaire: 'Résultats parfaits',
          couleur: 'green'
        },
        {
          id: 5,
          nom: 'Entretien final',
          statut: 'Terminée',
          date: '2024-01-25',
          responsable: 'Sophie Leroy',
          commentaire: 'Entretien très positif',
          couleur: 'green'
        },
        {
          id: 6,
          nom: 'Décision finale',
          statut: 'Terminée',
          date: '2024-01-28',
          responsable: 'Marie Martin',
          commentaire: 'Candidat retenu !',
          couleur: 'green'
        }
      ],
      score: 4.9,
      priorite: 'Haute',
      couleur: 'green'
    },
    {
      id: 4,
      candidatId: 4,
      candidatNom: 'Camille Leroy',
      candidatEmail: 'camille.leroy@email.com',
      offreId: 4,
      offreTitre: 'Designer UX/UI',
      statut: 'Abandonné',
      etapeActuelle: 'Entretien téléphonique',
      dateDebut: '2024-01-12',
      dateFin: '2024-01-20',
      etapes: [
        {
          id: 1,
          nom: 'Réception CV',
          statut: 'Terminée',
          date: '2024-01-12',
          responsable: 'Marie Martin',
          commentaire: 'CV correct',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présélection',
          statut: 'Terminée',
          date: '2024-01-13',
          responsable: 'Marie Martin',
          commentaire: 'Profil junior mais intéressant',
          couleur: 'green'
        },
        {
          id: 3,
          nom: 'Entretien téléphonique',
          statut: 'Abandonné',
          date: '2024-01-20',
          responsable: 'Pierre Bernard',
          commentaire: 'Candidat a retiré sa candidature',
          couleur: 'red'
        },
        {
          id: 4,
          nom: 'Test pratique',
          statut: 'Annulée',
          date: null,
          responsable: 'Thomas Moreau',
          commentaire: 'Test annulé',
          couleur: 'gray'
        },
        {
          id: 5,
          nom: 'Entretien final',
          statut: 'Annulée',
          date: null,
          responsable: 'Sophie Leroy',
          commentaire: 'Entretien annulé',
          couleur: 'gray'
        },
        {
          id: 6,
          nom: 'Décision finale',
          statut: 'Annulée',
          date: null,
          responsable: 'Marie Martin',
          commentaire: 'Processus arrêté',
          couleur: 'gray'
        }
      ],
      score: 3.2,
      priorite: 'Moyenne',
      couleur: 'red'
    },
    {
      id: 5,
      candidatId: 5,
      candidatNom: 'Thomas Moreau',
      candidatEmail: 'thomas.moreau@email.com',
      offreId: 1,
      offreTitre: 'Développeur Full Stack Senior',
      statut: 'En attente',
      etapeActuelle: 'Présélection',
      dateDebut: '2024-01-10',
      dateFin: null,
      etapes: [
        {
          id: 1,
          nom: 'Réception CV',
          statut: 'Terminée',
          date: '2024-01-10',
          responsable: 'Marie Martin',
          commentaire: 'CV reçu',
          couleur: 'green'
        },
        {
          id: 2,
          nom: 'Présélection',
          statut: 'En cours',
          date: '2024-01-15',
          responsable: 'Marie Martin',
          commentaire: 'Analyse en cours',
          couleur: 'yellow'
        },
        {
          id: 3,
          nom: 'Entretien téléphonique',
          statut: 'En attente',
          date: null,
          responsable: 'Pierre Bernard',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 4,
          nom: 'Entretien technique',
          statut: 'En attente',
          date: null,
          responsable: 'Thomas Moreau',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 5,
          nom: 'Entretien final',
          statut: 'En attente',
          date: null,
          responsable: 'Sophie Leroy',
          commentaire: '',
          couleur: 'gray'
        },
        {
          id: 6,
          nom: 'Décision finale',
          statut: 'En attente',
          date: null,
          responsable: 'Marie Martin',
          commentaire: '',
          couleur: 'gray'
        }
      ],
      score: 4.1,
      priorite: 'Moyenne',
      couleur: 'orange'
    }
  ];

  const offres = [
    { id: 1, titre: 'Développeur Full Stack Senior' },
    { id: 2, titre: 'Chef de Projet Marketing Digital' },
    { id: 3, titre: 'Comptable Senior' },
    { id: 4, titre: 'Designer UX/UI' },
    { id: 5, titre: 'Responsable Commercial' },
    { id: 6, titre: 'Développeur Mobile React Native' }
  ];

  const statuts = ['En cours', 'Terminé', 'Abandonné', 'En attente'];
  const etapes = ['Réception CV', 'Présélection', 'Entretien téléphonique', 'Test pratique', 'Entretien final', 'Décision finale'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Terminé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Abandonné':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'En attente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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
      case 'Abandonné':
      case 'Annulée':
        return 'bg-red-100 text-red-800';
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

  const filteredProcessus = processusRecrutement.filter(processus => {
    const matchesSearch = !searchTerm || 
      processus.candidatNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processus.candidatEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processus.offreTitre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || processus.statut === filterStatus;
    const matchesOffre = filterOffre === 'tous' || processus.offreId.toString() === filterOffre;
    const matchesEtape = filterEtape === 'tous' || processus.etapeActuelle === filterEtape;
    return matchesSearch && matchesStatus && matchesOffre && matchesEtape;
  });

  const stats = {
    totalProcessus: processusRecrutement.length,
    enCours: processusRecrutement.filter(p => p.statut === 'En cours').length,
    termines: processusRecrutement.filter(p => p.statut === 'Terminé').length,
    abandonnes: processusRecrutement.filter(p => p.statut === 'Abandonné').length,
    enAttente: processusRecrutement.filter(p => p.statut === 'En attente').length
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Processus de Recrutement</h1>
        <p className="text-gray-600">Suivi des processus de recrutement et des étapes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProcessus}</p>
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
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.termines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abandonnés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.abandonnes}</p>
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
                  placeholder="Rechercher par candidat, email ou offre..."
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
                value={filterOffre}
                onChange={(e) => setFilterOffre(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Toutes les offres</option>
                {offres.map(offre => (
                  <option key={offre.id} value={offre.id}>{offre.titre}</option>
                ))}
              </select>
              <select
                value={filterEtape}
                onChange={(e) => setFilterEtape(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Toutes les étapes</option>
                {etapes.map(etape => (
                  <option key={etape} value={etape}>{etape}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredProcessus.length} processus trouvé(s)
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
              {filteredProcessus.map((processus) => (
                <div key={processus.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(processus.candidatNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {processus.candidatNom}
                        </h3>
                        <p className="text-sm text-gray-600">{processus.offreTitre}</p>
                        <p className="text-xs text-gray-500">{processus.candidatEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{processus.etapeActuelle}</p>
                        <p className="text-xs text-gray-500">
                          {getProgressPercentage(processus.etapes)}% terminé
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(processus.statut)}`}>
                          {processus.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioriteColor(processus.priorite)}`}>
                          {processus.priorite}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Progression</span>
                      <span>{getProgressPercentage(processus.etapes)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(processus.etapes)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                    <div className="space-y-4">
                      {processus.etapes.map((etape, index) => (
                        <div key={etape.id} className="relative flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            etape.statut === 'Terminée' ? 'bg-green-500' :
                            etape.statut === 'En cours' ? 'bg-yellow-500' :
                            etape.statut === 'Abandonné' || etape.statut === 'Annulée' ? 'bg-red-500' :
                            'bg-gray-300'
                          }`}>
                            {etape.statut === 'Terminée' ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : etape.statut === 'En cours' ? (
                              <ClockIcon className="h-5 w-5 text-white" />
                            ) : etape.statut === 'Abandonné' || etape.statut === 'Annulée' ? (
                              <XCircleIcon className="h-5 w-5 text-white" />
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

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Début: {formatDate(processus.dateDebut)}</span>
                      {processus.dateFin && (
                        <span>Fin: {formatDate(processus.dateFin)}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{processus.score}</span>
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
              {filteredProcessus.map((processus) => (
                <div key={processus.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(processus.candidatNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {processus.candidatNom}
                        </h3>
                        <p className="text-sm text-gray-600">{processus.offreTitre}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{processus.candidatEmail}</span>
                          <span className="text-sm text-gray-500">{processus.etapeActuelle}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {getProgressPercentage(processus.etapes)}% terminé
                        </p>
                        <p className="text-xs text-gray-500">
                          {processus.etapes.filter(e => e.statut === 'Terminée').length}/{processus.etapes.length} étapes
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(processus.statut)}`}>
                          {processus.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioriteColor(processus.priorite)}`}>
                          {processus.priorite}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du processus</h3>
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

export default ProcessusRecrutement;
