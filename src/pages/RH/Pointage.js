import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ClockIcon as ClockIconSolid,
  PlayIcon,
  PauseIcon,
  StopIcon,
  MapPinIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const Pointage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterDate, setFilterDate] = useState('aujourdhui');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedPointage, setSelectedPointage] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');

  // Données de démonstration
  const pointages = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      date: '2024-01-25',
      heureArrivee: '08:45',
      heureDepart: '17:30',
      pauseDejeuner: '12:00-13:00',
      dureeTravail: '7h45',
      statut: 'Complet',
      localisation: 'Bureau Paris',
      modePointage: 'Badge',
      ip: '192.168.1.100',
      device: 'Ordinateur',
      commentaires: 'Pointage normal',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      date: '2024-01-25',
      heureArrivee: '09:15',
      heureDepart: '18:00',
      pauseDejeuner: '12:30-13:30',
      dureeTravail: '7h45',
      statut: 'Complet',
      localisation: 'Bureau Toulouse',
      modePointage: 'Mobile',
      ip: '192.168.1.101',
      device: 'Smartphone',
      commentaires: 'Télétravail partiel',
      couleur: 'green'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      date: '2024-01-25',
      heureArrivee: '08:30',
      heureDepart: null,
      pauseDejeuner: '12:00-13:00',
      dureeTravail: 'En cours',
      statut: 'En cours',
      localisation: 'Bureau Paris',
      modePointage: 'Badge',
      ip: '192.168.1.102',
      device: 'Ordinateur',
      commentaires: 'Travail en cours',
      couleur: 'blue'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      date: '2024-01-25',
      heureArrivee: '09:00',
      heureDepart: '16:45',
      pauseDejeuner: '12:15-13:15',
      dureeTravail: '6h30',
      statut: 'Partiel',
      localisation: 'Bureau Lyon',
      modePointage: 'Mobile',
      ip: '192.168.1.103',
      device: 'Tablette',
      commentaires: 'Départ anticipé - RDV médical',
      couleur: 'orange'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      date: '2024-01-25',
      heureArrivee: null,
      heureDepart: null,
      pauseDejeuner: null,
      dureeTravail: '0h00',
      statut: 'Absent',
      localisation: 'Non défini',
      modePointage: 'Non défini',
      ip: null,
      device: 'Non défini',
      commentaires: 'Absence non justifiée',
      couleur: 'red'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      date: '2024-01-24',
      heureArrivee: '08:00',
      heureDepart: '17:15',
      pauseDejeuner: '12:00-13:00',
      dureeTravail: '8h15',
      statut: 'Complet',
      localisation: 'Bureau Paris',
      modePointage: 'Badge',
      ip: '192.168.1.104',
      device: 'Ordinateur',
      commentaires: 'Heures supplémentaires',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      date: '2024-01-24',
      heureArrivee: '09:30',
      heureDepart: '18:30',
      pauseDejeuner: '12:30-13:30',
      dureeTravail: '8h00',
      statut: 'Complet',
      localisation: 'Bureau Toulouse',
      modePointage: 'Mobile',
      ip: '192.168.1.105',
      device: 'Smartphone',
      commentaires: 'Pointage normal',
      couleur: 'green'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      date: '2024-01-24',
      heureArrivee: '08:45',
      heureDepart: '17:00',
      pauseDejeuner: '12:00-13:00',
      dureeTravail: '7h15',
      statut: 'Complet',
      localisation: 'Bureau Lyon',
      modePointage: 'Badge',
      ip: '192.168.1.106',
      device: 'Ordinateur',
      commentaires: 'Pointage normal',
      couleur: 'green'
    }
  ];

  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];
  const statuts = ['Complet', 'Partiel', 'En cours', 'Absent', 'Retard'];
  const modesPointage = ['Badge', 'Mobile', 'Ordinateur', 'Biométrique'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Complet':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Partiel':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'En cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Retard':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'Badge':
        return 'bg-blue-100 text-blue-800';
      case 'Mobile':
        return 'bg-green-100 text-green-800';
      case 'Ordinateur':
        return 'bg-purple-100 text-purple-800';
      case 'Biométrique':
        return 'bg-orange-100 text-orange-800';
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

  const filteredPointages = pointages.filter(pointage => {
    const matchesSearch = !searchTerm || 
      pointage.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pointage.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pointage.poste.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || pointage.statut === filterStatus;
    const matchesDepartement = filterDepartement === 'tous' || pointage.departement === filterDepartement;
    return matchesSearch && matchesStatus && matchesDepartement;
  });

  const stats = {
    totalPointages: pointages.length,
    complets: pointages.filter(p => p.statut === 'Complet').length,
    enCours: pointages.filter(p => p.statut === 'En cours').length,
    absents: pointages.filter(p => p.statut === 'Absent').length,
    partiels: pointages.filter(p => p.statut === 'Partiel').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getInitials = (nom) => {
    return nom.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Smartphone':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'Ordinateur':
        return <ComputerDesktopIcon className="h-4 w-4" />;
      case 'Tablette':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pointage</h1>
        <p className="text-gray-600">Gestion du temps de travail et des présences</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPointages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Complets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.complets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIconSolid className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.absents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Partiels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.partiels}</p>
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
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aujourdhui">Aujourd'hui</option>
                <option value="hier">Hier</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="tout">Tout</option>
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
              {filteredPointages.length} pointage(s) trouvé(s)
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
            <div className="space-y-6">
              {filteredPointages.map((pointage) => (
                <div key={pointage.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(pointage.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {pointage.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{pointage.poste}</p>
                        <p className="text-xs text-gray-500">{pointage.employeEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{pointage.dureeTravail}</p>
                        <p className="text-xs text-gray-500">{formatDate(pointage.date)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(pointage.statut)}`}>
                          {pointage.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(pointage.departement)}`}>
                          {pointage.departement}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline des heures */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <PlayIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">Arrivée</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {pointage.heureArrivee || 'Non défini'}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <PauseIcon className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">Pause</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {pointage.pauseDejeuner || 'Non définie'}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <StopIcon className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-900">Départ</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {pointage.heureDepart || 'En cours'}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <ClockIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">Durée</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {pointage.dureeTravail}
                      </p>
                    </div>
                  </div>

                  {/* Informations techniques */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{pointage.localisation}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(pointage.modePointage)}`}>
                        {pointage.modePointage}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {getDeviceIcon(pointage.device)}
                      <span>{pointage.device}</span>
                    </div>
                  </div>

                  {pointage.commentaires && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-700">{pointage.commentaires}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {pointage.ip && (
                        <span>IP: {pointage.ip}</span>
                      )}
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
              {filteredPointages.map((pointage) => (
                <div key={pointage.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(pointage.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {pointage.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{pointage.poste}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{pointage.employeEmail}</span>
                          <span className="text-sm text-gray-500">{formatDate(pointage.date)}</span>
                          <span className="text-sm text-gray-500">{pointage.localisation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{pointage.dureeTravail}</p>
                        <p className="text-xs text-gray-500">
                          {pointage.heureArrivee} - {pointage.heureDepart || 'En cours'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(pointage.statut)}`}>
                          {pointage.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(pointage.departement)}`}>
                          {pointage.departement}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getModeColor(pointage.modePointage)}`}>
                          {pointage.modePointage}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du pointage</h3>
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

export default Pointage;
