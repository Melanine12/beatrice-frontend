import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
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
  AcademicCapIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const BulletinsPaie = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterPeriode, setFilterPeriode] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Données de démonstration
  const bulletinsPaie = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'Validé',
      salaireBase: 3500.00,
      heuresNormales: 151.67,
      heuresSupplementaires: 8.00,
      primeAnciennete: 150.00,
      primePerformance: 200.00,
      primeTransport: 50.00,
      primeRepas: 100.00,
      totalBrut: 4000.00,
      cotisationsSociales: 800.00,
      impots: 400.00,
      retenues: 50.00,
      netAvantImpot: 3200.00,
      netAPayer: 2750.00,
      commentaires: 'Bulletin validé avec prime de performance',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'Validé',
      salaireBase: 3200.00,
      heuresNormales: 121.33,
      heuresSupplementaires: 4.00,
      primeAnciennete: 100.00,
      primePerformance: 150.00,
      primeTransport: 50.00,
      primeRepas: 80.00,
      totalBrut: 3580.00,
      cotisationsSociales: 716.00,
      impots: 358.00,
      retenues: 30.00,
      netAvantImpot: 2864.00,
      netAPayer: 2476.00,
      commentaires: 'Temps partiel avec heures supplémentaires',
      couleur: 'green'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'En attente',
      salaireBase: 4200.00,
      heuresNormales: 151.67,
      heuresSupplementaires: 12.00,
      primeAnciennete: 200.00,
      primePerformance: 300.00,
      primeTransport: 50.00,
      primeRepas: 100.00,
      totalBrut: 4850.00,
      cotisationsSociales: 970.00,
      impots: 485.00,
      retenues: 60.00,
      netAvantImpot: 3880.00,
      netAPayer: 3335.00,
      commentaires: 'En attente de validation des heures supplémentaires',
      couleur: 'orange'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'Validé',
      salaireBase: 3800.00,
      heuresNormales: 151.67,
      heuresSupplementaires: 6.00,
      primeAnciennete: 180.00,
      primePerformance: 250.00,
      primeTransport: 50.00,
      primeRepas: 100.00,
      totalBrut: 4380.00,
      cotisationsSociales: 876.00,
      impots: 438.00,
      retenues: 45.00,
      netAvantImpot: 3504.00,
      netAPayer: 3021.00,
      commentaires: 'Bulletin standard validé',
      couleur: 'green'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'Validé',
      salaireBase: 4000.00,
      heuresNormales: 151.67,
      heuresSupplementaires: 8.00,
      primeAnciennete: 190.00,
      primePerformance: 280.00,
      primeTransport: 50.00,
      primeRepas: 100.00,
      totalBrut: 4620.00,
      cotisationsSociales: 924.00,
      impots: 462.00,
      retenues: 55.00,
      netAvantImpot: 3696.00,
      netAPayer: 3179.00,
      commentaires: 'Développeur mobile avec prime de performance',
      couleur: 'green'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'Validé',
      salaireBase: 4500.00,
      heuresNormales: 151.67,
      heuresSupplementaires: 4.00,
      primeAnciennete: 220.00,
      primePerformance: 350.00,
      primeTransport: 50.00,
      primeRepas: 100.00,
      totalBrut: 5220.00,
      cotisationsSociales: 1044.00,
      impots: 522.00,
      retenues: 70.00,
      netAvantImpot: 4176.00,
      netAPayer: 3584.00,
      commentaires: 'Responsable RH avec prime de performance élevée',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'Brouillon',
      salaireBase: 3600.00,
      heuresNormales: 121.33,
      heuresSupplementaires: 6.00,
      primeAnciennete: 160.00,
      primePerformance: 200.00,
      primeTransport: 50.00,
      primeRepas: 80.00,
      totalBrut: 4090.00,
      cotisationsSociales: 818.00,
      impots: 409.00,
      retenues: 40.00,
      netAvantImpot: 3272.00,
      netAPayer: 2823.00,
      commentaires: 'En cours de finalisation',
      couleur: 'gray'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      periode: 'Janvier 2024',
      dateEmission: '2024-02-01',
      statut: 'Validé',
      salaireBase: 3000.00,
      heuresNormales: 151.67,
      heuresSupplementaires: 2.00,
      primeAnciennete: 120.00,
      primePerformance: 150.00,
      primeTransport: 50.00,
      primeRepas: 100.00,
      totalBrut: 3420.00,
      cotisationsSociales: 684.00,
      impots: 342.00,
      retenues: 35.00,
      netAvantImpot: 2736.00,
      netAPayer: 2359.00,
      commentaires: 'Bulletin standard validé',
      couleur: 'green'
    }
  ];

  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];
  const statuts = ['Validé', 'En attente', 'Brouillon', 'Rejeté'];
  const periodes = ['Janvier 2024', 'Décembre 2023', 'Novembre 2023', 'Octobre 2023', 'Septembre 2023'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Validé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Rejeté':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredBulletins = bulletinsPaie.filter(bulletin => {
    const matchesSearch = !searchTerm || 
      bulletin.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bulletin.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bulletin.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bulletin.periode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || bulletin.statut === filterStatus;
    const matchesPeriode = filterPeriode === 'tous' || bulletin.periode === filterPeriode;
    const matchesDepartement = filterDepartement === 'tous' || bulletin.departement === filterDepartement;
    return matchesSearch && matchesStatus && matchesPeriode && matchesDepartement;
  });

  const stats = {
    totalBulletins: bulletinsPaie.length,
    valides: bulletinsPaie.filter(b => b.statut === 'Validé').length,
    enAttente: bulletinsPaie.filter(b => b.statut === 'En attente').length,
    brouillons: bulletinsPaie.filter(b => b.statut === 'Brouillon').length,
    totalBrut: bulletinsPaie
      .filter(b => b.statut === 'Validé')
      .reduce((sum, b) => sum + b.totalBrut, 0),
    totalNet: bulletinsPaie
      .filter(b => b.statut === 'Validé')
      .reduce((sum, b) => sum + b.netAPayer, 0)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulletins de Paie</h1>
        <p className="text-gray-600">Gestion de la paie, des avantages sociaux et des remboursements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBulletins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Validés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.valides}</p>
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
            <div className="p-3 bg-gray-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.brouillons}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total brut</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBrut)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total net</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalNet)}</p>
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
                  placeholder="Rechercher par employé, poste, période..."
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
                value={filterPeriode}
                onChange={(e) => setFilterPeriode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Toutes les périodes</option>
                {periodes.map(periode => (
                  <option key={periode} value={periode}>{periode}</option>
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
              {filteredBulletins.length} bulletin(s) trouvé(s)
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
              {filteredBulletins.map((bulletin) => (
                <div key={bulletin.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(bulletin.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bulletin.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{bulletin.poste}</p>
                        <p className="text-xs text-gray-500">{bulletin.departement}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(bulletin.netAPayer)}</p>
                      <p className="text-sm text-gray-500">{bulletin.periode}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Salaire brut:</span>
                      <span className="font-medium">{formatCurrency(bulletin.totalBrut)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Heures normales:</span>
                      <span className="font-medium">{bulletin.heuresNormales}h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Heures supp.:</span>
                      <span className="font-medium">{bulletin.heuresSupplementaires}h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Primes:</span>
                      <span className="font-medium">{formatCurrency(bulletin.primeAnciennete + bulletin.primePerformance + bulletin.primeTransport + bulletin.primeRepas)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cotisations:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(bulletin.cotisationsSociales)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Impôts:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(bulletin.impots)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bulletin.statut)}`}>
                      {bulletin.statut}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(bulletin.departement)}`}>
                      {bulletin.departement}
                    </span>
                  </div>

                  {bulletin.commentaires && (
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{bulletin.commentaires}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>Émis le {formatDate(bulletin.dateEmission)}</span>
                    </div>
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
              {filteredBulletins.map((bulletin) => (
                <div key={bulletin.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(bulletin.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bulletin.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{bulletin.poste} - {bulletin.departement}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{bulletin.periode}</span>
                          <span className="text-sm text-gray-500">Brut: {formatCurrency(bulletin.totalBrut)}</span>
                          <span className="text-sm text-gray-500">Net: {formatCurrency(bulletin.netAPayer)}</span>
                          <span className="text-sm text-gray-500">Émis le {formatDate(bulletin.dateEmission)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{bulletin.heuresNormales}h normales</p>
                        <p className="text-xs text-gray-500">{bulletin.heuresSupplementaires}h supplémentaires</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bulletin.statut)}`}>
                          {bulletin.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(bulletin.departement)}`}>
                          {bulletin.departement}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du bulletin de paie</h3>
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

export default BulletinsPaie;
