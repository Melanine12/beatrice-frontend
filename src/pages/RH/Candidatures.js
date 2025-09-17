import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Candidatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterOffre, setFilterOffre] = useState('tous');
  const [filterExperience, setFilterExperience] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Données de démonstration
  const candidatures = [
    {
      id: 1,
      nom: 'Dubois',
      prenom: 'Alexandre',
      email: 'alexandre.dubois@email.com',
      telephone: '06 12 34 56 78',
      offreId: 1,
      offreTitre: 'Développeur Full Stack Senior',
      statut: 'Nouvelle',
      dateCandidature: '2024-01-20',
      experience: '4 ans',
      localisation: 'Paris, France',
      cv: 'CV_Alexandre_Dubois.pdf',
      lettreMotivation: 'Lettre_Motivation_Alexandre_Dubois.pdf',
      competences: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      formation: 'Master Informatique - École Polytechnique',
      note: 4.5,
      commentaires: 'Profil très intéressant, expérience solide',
      couleur: 'blue'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@email.com',
      telephone: '06 23 45 67 89',
      offreId: 2,
      offreTitre: 'Chef de Projet Marketing Digital',
      statut: 'En cours',
      dateCandidature: '2024-01-18',
      experience: '3 ans',
      localisation: 'Lyon, France',
      cv: 'CV_Sophie_Martin.pdf',
      lettreMotivation: 'Lettre_Motivation_Sophie_Martin.pdf',
      competences: ['Google Analytics', 'Facebook Ads', 'SEO', 'Content Marketing'],
      formation: 'Master Marketing Digital - HEC',
      note: 4.2,
      commentaires: 'Entretien téléphonique prévu le 25/01',
      couleur: 'yellow'
    },
    {
      id: 3,
      nom: 'Bernard',
      prenom: 'Pierre',
      email: 'pierre.bernard@email.com',
      telephone: '06 34 56 78 90',
      offreId: 3,
      offreTitre: 'Comptable Senior',
      statut: 'Acceptée',
      dateCandidature: '2024-01-15',
      experience: '5 ans',
      localisation: 'Marseille, France',
      cv: 'CV_Pierre_Bernard.pdf',
      lettreMotivation: 'Lettre_Motivation_Pierre_Bernard.pdf',
      competences: ['Sage', 'Excel', 'Fiscalité', 'Comptabilité générale'],
      formation: 'DCG - Diplôme de Comptabilité et Gestion',
      note: 4.8,
      commentaires: 'Candidat retenu, embauche prévue le 01/02',
      couleur: 'green'
    },
    {
      id: 4,
      nom: 'Leroy',
      prenom: 'Camille',
      email: 'camille.leroy@email.com',
      telephone: '06 45 67 89 01',
      offreId: 4,
      offreTitre: 'Designer UX/UI',
      statut: 'Refusée',
      dateCandidature: '2024-01-12',
      experience: '1 an',
      localisation: 'Toulouse, France',
      cv: 'CV_Camille_Leroy.pdf',
      lettreMotivation: 'Lettre_Motivation_Camille_Leroy.pdf',
      competences: ['Figma', 'Adobe Creative Suite', 'Prototypage'],
      formation: 'Bachelor Design - École de Design',
      note: 3.2,
      commentaires: 'Profil junior, ne correspond pas aux attentes',
      couleur: 'red'
    },
    {
      id: 5,
      nom: 'Moreau',
      prenom: 'Thomas',
      email: 'thomas.moreau@email.com',
      telephone: '06 56 78 90 12',
      offreId: 1,
      offreTitre: 'Développeur Full Stack Senior',
      statut: 'En attente',
      dateCandidature: '2024-01-10',
      experience: '6 ans',
      localisation: 'Paris, France',
      cv: 'CV_Thomas_Moreau.pdf',
      lettreMotivation: 'Lettre_Motivation_Thomas_Moreau.pdf',
      competences: ['React', 'Node.js', 'Python', 'Docker', 'Kubernetes'],
      formation: 'Ingénieur Informatique - École Centrale',
      note: 4.6,
      commentaires: 'Profil excellent, en attente de décision finale',
      couleur: 'orange'
    },
    {
      id: 6,
      nom: 'Petit',
      prenom: 'Emma',
      email: 'emma.petit@email.com',
      telephone: '06 67 89 01 23',
      offreId: 6,
      offreTitre: 'Développeur Mobile React Native',
      statut: 'Nouvelle',
      dateCandidature: '2024-01-22',
      experience: '2 ans',
      localisation: 'Remote',
      cv: 'CV_Emma_Petit.pdf',
      lettreMotivation: 'Lettre_Motivation_Emma_Petit.pdf',
      competences: ['React Native', 'JavaScript', 'iOS', 'Android'],
      formation: 'Master Informatique - Université de Paris',
      note: 4.0,
      commentaires: 'Candidature récente, à examiner',
      couleur: 'blue'
    },
    {
      id: 7,
      nom: 'Rousseau',
      prenom: 'Lucas',
      email: 'lucas.rousseau@email.com',
      telephone: '06 78 90 12 34',
      offreId: 2,
      offreTitre: 'Chef de Projet Marketing Digital',
      statut: 'En cours',
      dateCandidature: '2024-01-16',
      experience: '4 ans',
      localisation: 'Lyon, France',
      cv: 'CV_Lucas_Rousseau.pdf',
      lettreMotivation: 'Lettre_Motivation_Lucas_Rousseau.pdf',
      competences: ['Google Analytics', 'Facebook Ads', 'SEO', 'Project Management'],
      formation: 'Master Marketing - ESSEC',
      note: 4.3,
      commentaires: 'Entretien en cours, profil prometteur',
      couleur: 'yellow'
    },
    {
      id: 8,
      nom: 'Garcia',
      prenom: 'Isabella',
      email: 'isabella.garcia@email.com',
      telephone: '06 89 01 23 45',
      offreId: 4,
      offreTitre: 'Designer UX/UI',
      statut: 'Acceptée',
      dateCandidature: '2024-01-14',
      experience: '3 ans',
      localisation: 'Toulouse, France',
      cv: 'CV_Isabella_Garcia.pdf',
      lettreMotivation: 'Lettre_Motivation_Isabella_Garcia.pdf',
      competences: ['Figma', 'Adobe Creative Suite', 'User Research', 'Design System'],
      formation: 'Master Design - École Boulle',
      note: 4.7,
      commentaires: 'Candidat retenu, intégration prévue le 15/02',
      couleur: 'green'
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

  const statuts = ['Nouvelle', 'En cours', 'En attente', 'Acceptée', 'Refusée'];
  const experiences = ['0-1 an', '1-2 ans', '2-3 ans', '3-5 ans', '5+ ans'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Nouvelle':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En attente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Acceptée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Refusée':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNoteColor = (note) => {
    if (note >= 4.5) return 'text-green-600';
    if (note >= 4.0) return 'text-blue-600';
    if (note >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCandidatures = candidatures.filter(candidat => {
    const matchesSearch = !searchTerm || 
      candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.offreTitre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || candidat.statut === filterStatus;
    const matchesOffre = filterOffre === 'tous' || candidat.offreId.toString() === filterOffre;
    const matchesExperience = filterExperience === 'tous' || candidat.experience === filterExperience;
    return matchesSearch && matchesStatus && matchesOffre && matchesExperience;
  });

  const stats = {
    totalCandidatures: candidatures.length,
    nouvelles: candidatures.filter(c => c.statut === 'Nouvelle').length,
    enCours: candidatures.filter(c => c.statut === 'En cours').length,
    acceptees: candidatures.filter(c => c.statut === 'Acceptée').length,
    refusees: candidatures.filter(c => c.statut === 'Refusée').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures</h1>
        <p className="text-gray-600">Gestion des candidatures et du processus de recrutement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCandidatures}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nouvelles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nouvelles}</p>
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
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.acceptees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refusées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.refusees}</p>
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
                  placeholder="Rechercher par nom, email ou offre..."
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
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Toute expérience</option>
                {experiences.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredCandidatures.length} candidature(s) trouvée(s)
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
              {filteredCandidatures.map((candidat) => (
                <div key={candidat.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(candidat.prenom, candidat.nom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidat.prenom} {candidat.nom}
                        </h3>
                        <p className="text-sm text-gray-600">{candidat.offreTitre}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidat.statut)}`}>
                        {candidat.statut}
                      </span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className={`text-sm font-medium ${getNoteColor(candidat.note)}`}>
                          {candidat.note}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {candidat.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {candidat.telephone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {candidat.localisation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      {candidat.experience} d'expérience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      {candidat.formation}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2">Compétences :</p>
                    <div className="flex flex-wrap gap-1">
                      {candidat.competences.slice(0, 3).map((competence, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {competence}
                        </span>
                      ))}
                      {candidat.competences.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{candidat.competences.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Candidature du {formatDate(candidat.dateCandidature)}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCandidatures.map((candidat) => (
                <div key={candidat.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(candidat.prenom, candidat.nom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidat.prenom} {candidat.nom}
                        </h3>
                        <p className="text-sm text-gray-600">{candidat.offreTitre}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{candidat.email}</span>
                          <span className="text-sm text-gray-500">{candidat.telephone}</span>
                          <span className="text-sm text-gray-500">{candidat.localisation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{candidat.experience}</p>
                        <p className="text-xs text-gray-500">{candidat.formation}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(candidat.statut)}`}>
                          {candidat.statut}
                        </span>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className={`text-sm font-medium ${getNoteColor(candidat.note)}`}>
                            {candidat.note}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {candidat.competences.map((competence, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {competence}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Candidature du {formatDate(candidat.dateCandidature)}</span>
                      {candidat.commentaires && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{candidat.commentaires}</span>
                        </>
                      )}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la candidature</h3>
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

export default Candidatures;
