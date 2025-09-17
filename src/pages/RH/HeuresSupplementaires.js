import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  CurrencyDollarIcon,
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
  ChevronRightIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const HeuresSupplementaires = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [filterPeriode, setFilterPeriode] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedHeure, setSelectedHeure] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Données de démonstration
  const heuresSupplementaires = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      date: '2024-01-25',
      heureDebut: '17:00',
      heureFin: '20:00',
      duree: '3h00',
      type: 'Heures supplémentaires',
      statut: 'Approuvé',
      tauxHoraire: 25.50,
      montant: 76.50,
      motif: 'Finalisation du rapport mensuel',
      approbateur: 'Marie Dubois',
      dateApprobation: '2024-01-26',
      commentaires: 'Travail urgent pour la clôture mensuelle',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      date: '2024-01-24',
      heureDebut: '18:00',
      heureFin: '22:00',
      duree: '4h00',
      type: 'Heures supplémentaires',
      statut: 'En attente',
      tauxHoraire: 22.00,
      montant: 88.00,
      motif: 'Présentation client urgente',
      approbateur: 'Lucas Rousseau',
      dateApprobation: null,
      commentaires: 'Design final pour la présentation de demain',
      couleur: 'orange'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      date: '2024-01-23',
      heureDebut: '19:00',
      heureFin: '23:00',
      duree: '4h00',
      type: 'Heures supplémentaires',
      statut: 'Approuvé',
      tauxHoraire: 28.00,
      montant: 112.00,
      motif: 'Correction bug critique en production',
      approbateur: 'Thomas Moreau',
      dateApprobation: '2024-01-24',
      commentaires: 'Résolution urgente du problème de connexion',
      couleur: 'green'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      date: '2024-01-22',
      heureDebut: '17:30',
      heureFin: '21:30',
      duree: '4h00',
      type: 'Heures supplémentaires',
      statut: 'Rejeté',
      tauxHoraire: 24.00,
      montant: 96.00,
      motif: 'Préparation campagne publicitaire',
      approbateur: 'Emma Petit',
      dateApprobation: '2024-01-23',
      commentaires: 'Travail non justifié, peut être fait pendant les heures normales',
      couleur: 'red'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      date: '2024-01-21',
      heureDebut: '18:00',
      heureFin: '21:00',
      duree: '3h00',
      type: 'Heures supplémentaires',
      statut: 'Approuvé',
      tauxHoraire: 26.00,
      montant: 78.00,
      motif: 'Déploiement application mobile',
      approbateur: 'Alexandre Dubois',
      dateApprobation: '2024-01-22',
      commentaires: 'Déploiement urgent pour la sortie de l\'app',
      couleur: 'green'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      date: '2024-01-20',
      heureDebut: '17:00',
      heureFin: '20:00',
      duree: '3h00',
      type: 'Heures supplémentaires',
      statut: 'Approuvé',
      tauxHoraire: 30.00,
      montant: 90.00,
      motif: 'Entretiens de recrutement',
      approbateur: 'Sophie Martin',
      dateApprobation: '2024-01-21',
      commentaires: 'Entretiens supplémentaires pour le poste de développeur',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      date: '2024-01-19',
      heureDebut: '18:30',
      heureFin: '22:30',
      duree: '4h00',
      type: 'Heures supplémentaires',
      statut: 'En attente',
      tauxHoraire: 23.50,
      montant: 94.00,
      motif: 'Refonte interface utilisateur',
      approbateur: 'Isabella Garcia',
      dateApprobation: null,
      commentaires: 'Travail sur la nouvelle version de l\'interface',
      couleur: 'orange'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      date: '2024-01-18',
      heureDebut: '17:00',
      heureFin: '19:00',
      duree: '2h00',
      type: 'Heures supplémentaires',
      statut: 'Approuvé',
      tauxHoraire: 20.00,
      montant: 40.00,
      motif: 'Rédaction communiqué de presse',
      approbateur: 'Sophie Martin',
      dateApprobation: '2024-01-19',
      commentaires: 'Communiqué urgent pour l\'annonce du nouveau produit',
      couleur: 'green'
    },
    {
      id: 9,
      employeId: 9,
      employeNom: 'Jean Dupont',
      employeEmail: 'jean.dupont@email.com',
      departement: 'Commercial',
      poste: 'Commercial Senior',
      date: '2024-01-17',
      heureDebut: '18:00',
      heureFin: '21:00',
      duree: '3h00',
      type: 'Heures supplémentaires',
      statut: 'Approuvé',
      tauxHoraire: 27.00,
      montant: 81.00,
      motif: 'Préparation présentation client',
      approbateur: 'Sophie Martin',
      dateApprobation: '2024-01-18',
      commentaires: 'Préparation importante pour la réunion client de demain',
      couleur: 'green'
    },
    {
      id: 10,
      employeId: 10,
      employeNom: 'Sarah Johnson',
      employeEmail: 'sarah.johnson@email.com',
      departement: 'Production',
      poste: 'Chef d\'équipe Production',
      date: '2024-01-16',
      heureDebut: '16:00',
      heureFin: '20:00',
      duree: '4h00',
      type: 'Heures supplémentaires',
      statut: 'Rejeté',
      tauxHoraire: 21.00,
      montant: 84.00,
      motif: 'Contrôle qualité supplémentaire',
      approbateur: 'Pierre Bernard',
      dateApprobation: '2024-01-17',
      commentaires: 'Contrôle non justifié, processus standard suffisant',
      couleur: 'red'
    }
  ];

  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];
  const statuts = ['Approuvé', 'En attente', 'Rejeté', 'Brouillon'];
  const types = ['Heures supplémentaires', 'Heures de nuit', 'Heures de week-end', 'Heures de jour férié'];
  const periodes = ['Cette semaine', 'Ce mois', 'Dernier mois', 'Ce trimestre', 'Cette année'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Approuvé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Rejeté':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Heures supplémentaires':
        return 'bg-blue-100 text-blue-800';
      case 'Heures de nuit':
        return 'bg-purple-100 text-purple-800';
      case 'Heures de week-end':
        return 'bg-orange-100 text-orange-800';
      case 'Heures de jour férié':
        return 'bg-red-100 text-red-800';
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

  const filteredHeures = heuresSupplementaires.filter(heure => {
    const matchesSearch = !searchTerm || 
      heure.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      heure.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      heure.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      heure.motif.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || heure.statut === filterStatus;
    const matchesType = filterType === 'tous' || heure.type === filterType;
    const matchesDepartement = filterDepartement === 'tous' || heure.departement === filterDepartement;
    return matchesSearch && matchesStatus && matchesType && matchesDepartement;
  });

  const stats = {
    totalHeures: heuresSupplementaires.length,
    approuvees: heuresSupplementaires.filter(h => h.statut === 'Approuvé').length,
    enAttente: heuresSupplementaires.filter(h => h.statut === 'En attente').length,
    rejetees: heuresSupplementaires.filter(h => h.statut === 'Rejeté').length,
    totalMontant: heuresSupplementaires
      .filter(h => h.statut === 'Approuvé')
      .reduce((sum, h) => sum + h.montant, 0),
    totalDuree: heuresSupplementaires
      .filter(h => h.statut === 'Approuvé')
      .reduce((sum, h) => sum + parseFloat(h.duree), 0)
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

  const getInitials = (nom) => {
    return nom.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Heures Supplémentaires</h1>
        <p className="text-gray-600">Gestion des heures supplémentaires et de la rémunération</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHeures}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approuvees}</p>
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
              <p className="text-sm font-medium text-gray-600">Rejetées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejetees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalMontant)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heures totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDuree}h</p>
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
                  placeholder="Rechercher par employé, poste, motif..."
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
              <select
                value={filterPeriode}
                onChange={(e) => setFilterPeriode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Toutes les périodes</option>
                {periodes.map(periode => (
                  <option key={periode} value={periode}>{periode}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredHeures.length} heure(s) supplémentaire(s) trouvée(s)
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
              {filteredHeures.map((heure) => (
                <div key={heure.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(heure.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {heure.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{heure.poste}</p>
                        <p className="text-xs text-gray-500">{heure.departement}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(heure.montant)}</p>
                      <p className="text-sm text-gray-500">{heure.duree}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(heure.date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Horaires:</span>
                      <span className="font-medium">{heure.heureDebut} - {heure.heureFin}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Taux horaire:</span>
                      <span className="font-medium">{formatCurrency(heure.tauxHoraire)}/h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Motif:</span>
                      <span className="font-medium text-right max-w-32 truncate" title={heure.motif}>
                        {heure.motif}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(heure.statut)}`}>
                      {heure.statut}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(heure.type)}`}>
                      {heure.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(heure.departement)}`}>
                      {heure.departement}
                    </span>
                  </div>

                  {heure.commentaires && (
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{heure.commentaires}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>Approbateur: {heure.approbateur}</span>
                    </div>
                    {heure.dateApprobation && (
                      <span>Approuvé le {formatDate(heure.dateApprobation)}</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="flex-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="flex-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHeures.map((heure) => (
                <div key={heure.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(heure.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {heure.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{heure.poste} - {heure.departement}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{formatDate(heure.date)}</span>
                          <span className="text-sm text-gray-500">{heure.heureDebut} - {heure.heureFin}</span>
                          <span className="text-sm text-gray-500">{heure.duree}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(heure.montant)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{heure.motif}</p>
                        <p className="text-xs text-gray-500">Approbateur: {heure.approbateur}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(heure.statut)}`}>
                          {heure.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(heure.type)}`}>
                          {heure.type}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails des heures supplémentaires</h3>
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

export default HeuresSupplementaires;
