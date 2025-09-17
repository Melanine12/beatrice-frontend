import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  UserIcon,
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
  AcademicCapIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Planning = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanning, setSelectedPlanning] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Données de démonstration
  const plannings = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      type: 'Temps plein',
      statut: 'Confirmé',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '35h',
      horaires: [
        { jour: 'Lundi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Mardi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Mercredi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Jeudi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Vendredi', debut: '08:00', fin: '16:00', pause: '12:00-13:00' }
      ],
      localisation: 'Bureau Paris',
      responsable: 'Marie Dubois',
      commentaires: 'Planning standard',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      type: 'Temps partiel',
      statut: 'Confirmé',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '28h',
      horaires: [
        { jour: 'Lundi', debut: '09:00', fin: '17:00', pause: '12:30-13:30' },
        { jour: 'Mardi', debut: '09:00', fin: '17:00', pause: '12:30-13:30' },
        { jour: 'Mercredi', debut: '09:00', fin: '17:00', pause: '12:30-13:30' },
        { jour: 'Jeudi', debut: '09:00', fin: '17:00', pause: '12:30-13:30' },
        { jour: 'Vendredi', debut: null, fin: null, pause: null }
      ],
      localisation: 'Bureau Toulouse',
      responsable: 'Lucas Rousseau',
      commentaires: 'Télétravail possible',
      couleur: 'blue'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      type: 'Temps plein',
      statut: 'En attente',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '40h',
      horaires: [
        { jour: 'Lundi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Mardi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Mercredi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Jeudi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Vendredi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' }
      ],
      localisation: 'Bureau Paris',
      responsable: 'Thomas Moreau',
      commentaires: 'Heures supplémentaires possibles',
      couleur: 'orange'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      type: 'Temps plein',
      statut: 'Confirmé',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '35h',
      horaires: [
        { jour: 'Lundi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Mardi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Mercredi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Jeudi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Vendredi', debut: '08:30', fin: '16:30', pause: '12:00-13:00' }
      ],
      localisation: 'Bureau Lyon',
      responsable: 'Emma Petit',
      commentaires: 'Planning flexible',
      couleur: 'green'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      type: 'Télétravail',
      statut: 'Confirmé',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '35h',
      horaires: [
        { jour: 'Lundi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Mardi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Mercredi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Jeudi', debut: '09:00', fin: '18:00', pause: '12:00-13:00' },
        { jour: 'Vendredi', debut: '09:00', fin: '17:00', pause: '12:00-13:00' }
      ],
      localisation: 'Remote',
      responsable: 'Alexandre Dubois',
      commentaires: '100% télétravail',
      couleur: 'purple'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      type: 'Temps plein',
      statut: 'Confirmé',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '35h',
      horaires: [
        { jour: 'Lundi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Mardi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Mercredi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Jeudi', debut: '08:00', fin: '17:00', pause: '12:00-13:00' },
        { jour: 'Vendredi', debut: '08:00', fin: '16:00', pause: '12:00-13:00' }
      ],
      localisation: 'Bureau Paris',
      responsable: 'Sophie Martin',
      commentaires: 'Planning standard',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      type: 'Temps partiel',
      statut: 'En attente',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '24h',
      horaires: [
        { jour: 'Lundi', debut: '09:00', fin: '17:00', pause: '12:30-13:30' },
        { jour: 'Mardi', debut: '09:00', fin: '17:00', pause: '12:30-13:30' },
        { jour: 'Mercredi', debut: '09:00', fin: '17:00', pause: '12:30-13:30' },
        { jour: 'Jeudi', debut: null, fin: null, pause: null },
        { jour: 'Vendredi', debut: null, fin: null, pause: null }
      ],
      localisation: 'Bureau Toulouse',
      responsable: 'Isabella Garcia',
      commentaires: 'Planning réduit',
      couleur: 'orange'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      type: 'Temps plein',
      statut: 'Confirmé',
      dateDebut: '2024-01-25',
      dateFin: '2024-01-31',
      heuresSemaine: '35h',
      horaires: [
        { jour: 'Lundi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Mardi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Mercredi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Jeudi', debut: '08:30', fin: '17:30', pause: '12:00-13:00' },
        { jour: 'Vendredi', debut: '08:30', fin: '16:30', pause: '12:00-13:00' }
      ],
      localisation: 'Bureau Lyon',
      responsable: 'Sophie Martin',
      commentaires: 'Planning standard',
      couleur: 'green'
    }
  ];

  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];
  const statuts = ['Confirmé', 'En attente', 'Provisoire', 'Annulé'];
  const types = ['Temps plein', 'Temps partiel', 'Télétravail', 'Hybride', 'Flexible'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Confirmé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Provisoire':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Annulé':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Temps plein':
        return 'bg-blue-100 text-blue-800';
      case 'Temps partiel':
        return 'bg-green-100 text-green-800';
      case 'Télétravail':
        return 'bg-purple-100 text-purple-800';
      case 'Hybride':
        return 'bg-orange-100 text-orange-800';
      case 'Flexible':
        return 'bg-pink-100 text-pink-800';
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

  const filteredPlannings = plannings.filter(planning => {
    const matchesSearch = !searchTerm || 
      planning.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planning.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planning.poste.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || planning.statut === filterStatus;
    const matchesType = filterType === 'tous' || planning.type === filterType;
    const matchesDepartement = filterDepartement === 'tous' || planning.departement === filterDepartement;
    return matchesSearch && matchesStatus && matchesType && matchesDepartement;
  });

  const stats = {
    totalPlannings: plannings.length,
    confirmes: plannings.filter(p => p.statut === 'Confirmé').length,
    enAttente: plannings.filter(p => p.statut === 'En attente').length,
    tempsPlein: plannings.filter(p => p.type === 'Temps plein').length,
    tempsPartiel: plannings.filter(p => p.type === 'Temps partiel').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getInitials = (nom) => {
    return nom.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getJoursSemaine = () => {
    return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning</h1>
        <p className="text-gray-600">Gestion des plannings et des horaires de travail</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlannings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmes}</p>
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
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Temps plein</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tempsPlein}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Temps partiel</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tempsPartiel}</p>
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
              {filteredPlannings.length} planning(s) trouvé(s)
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <CalendarIcon className="h-5 w-5" />
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
          {viewMode === 'calendar' ? (
            <div className="space-y-6">
              {filteredPlannings.map((planning) => (
                <div key={planning.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(planning.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {planning.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{planning.poste}</p>
                        <p className="text-xs text-gray-500">{planning.employeEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{planning.heuresSemaine}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(planning.dateDebut)} - {formatDate(planning.dateFin)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(planning.statut)}`}>
                          {planning.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(planning.type)}`}>
                          {planning.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(planning.departement)}`}>
                          {planning.departement}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Planning hebdomadaire */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    {getJoursSemaine().map((jour, index) => {
                      const horaire = planning.horaires[index];
                      return (
                        <div key={jour} className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">{jour}</h4>
                          {horaire && horaire.debut ? (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <ClockIcon className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-gray-900">
                                  {horaire.debut} - {horaire.fin}
                                </span>
                              </div>
                              {horaire.pause && (
                                <div className="flex items-center space-x-2">
                                  <ClockIcon className="h-4 w-4 text-yellow-500" />
                                  <span className="text-xs text-gray-600">
                                    Pause: {horaire.pause}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Repos</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{planning.localisation}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <UserIcon className="h-4 w-4" />
                      <span>Responsable: {planning.responsable}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4" />
                      <span>Type: {planning.type}</span>
                    </div>
                  </div>

                  {planning.commentaires && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-700">{planning.commentaires}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Période: {formatDate(planning.dateDebut)} - {formatDate(planning.dateFin)}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlannings.map((planning) => (
                <div key={planning.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(planning.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {planning.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{planning.poste}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{planning.employeEmail}</span>
                          <span className="text-sm text-gray-500">{planning.localisation}</span>
                          <span className="text-sm text-gray-500">{planning.heuresSemaine}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{planning.type}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(planning.dateDebut)} - {formatDate(planning.dateFin)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(planning.statut)}`}>
                          {planning.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(planning.type)}`}>
                          {planning.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(planning.departement)}`}>
                          {planning.departement}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du planning</h3>
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

export default Planning;
