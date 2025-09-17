import React, { useState, useEffect } from 'react';
import {
  ReceiptRefundIcon,
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
  UserIcon,
  DocumentTextIcon,
  TruckIcon,
  HomeIcon,
  HeartIcon,
  BookOpenIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Remboursements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterDepartement, setFilterDepartement] = useState('tous');
  const [filterPeriode, setFilterPeriode] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedRemboursement, setSelectedRemboursement] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Données de démonstration
  const remboursements = [
    {
      id: 1,
      employeId: 1,
      employeNom: 'Pierre Bernard',
      employeEmail: 'pierre.bernard@email.com',
      departement: 'Finance',
      poste: 'Comptable Senior',
      type: 'Frais de transport',
      statut: 'Approuvé',
      montant: 45.50,
      dateDemande: '2024-01-15',
      dateTraitement: '2024-01-18',
      datePaiement: '2024-01-25',
      description: 'Remboursement frais de transport mensuel',
      justificatifs: ['Ticket de métro', 'Facture taxi'],
      motif: 'Déplacements professionnels',
      approbateur: 'Marie Dubois',
      commentaires: 'Remboursement validé selon la grille tarifaire',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      employeNom: 'Isabella Garcia',
      employeEmail: 'isabella.garcia@email.com',
      departement: 'Design',
      poste: 'Designer UX/UI',
      type: 'Formation',
      statut: 'En attente',
      montant: 250.00,
      dateDemande: '2024-01-20',
      dateTraitement: null,
      datePaiement: null,
      description: 'Formation en design UX/UI avancé',
      justificatifs: ['Facture formation', 'Certificat de participation'],
      motif: 'Développement des compétences',
      approbateur: 'Lucas Rousseau',
      commentaires: 'En cours de validation par le manager',
      couleur: 'orange'
    },
    {
      id: 3,
      employeId: 3,
      employeNom: 'Alexandre Dubois',
      employeEmail: 'alexandre.dubois@email.com',
      departement: 'IT',
      poste: 'Développeur Full Stack',
      type: 'Matériel informatique',
      statut: 'Approuvé',
      montant: 180.00,
      dateDemande: '2024-01-10',
      dateTraitement: '2024-01-12',
      datePaiement: '2024-01-20',
      description: 'Achat clavier et souris ergonomiques',
      justificatifs: ['Facture achat', 'Bon de commande'],
      motif: 'Amélioration conditions de travail',
      approbateur: 'Thomas Moreau',
      commentaires: 'Matériel conforme aux standards de l\'entreprise',
      couleur: 'green'
    },
    {
      id: 4,
      employeId: 4,
      employeNom: 'Sophie Martin',
      employeEmail: 'sophie.martin@email.com',
      departement: 'Marketing',
      poste: 'Chef de Projet Marketing',
      type: 'Repas d\'affaires',
      statut: 'Rejeté',
      montant: 85.00,
      dateDemande: '2024-01-08',
      dateTraitement: '2024-01-15',
      datePaiement: null,
      description: 'Déjeuner avec client potentiel',
      justificatifs: ['Facture restaurant', 'Note de frais'],
      motif: 'Développement commercial',
      approbateur: 'Emma Petit',
      commentaires: 'Montant dépassant le plafond autorisé',
      couleur: 'red'
    },
    {
      id: 5,
      employeId: 5,
      employeNom: 'Thomas Moreau',
      employeEmail: 'thomas.moreau@email.com',
      departement: 'IT',
      poste: 'Développeur Mobile',
      type: 'Télétravail',
      statut: 'Approuvé',
      montant: 30.00,
      dateDemande: '2024-01-05',
      dateTraitement: '2024-01-08',
      datePaiement: '2024-01-15',
      description: 'Indemnité télétravail - frais de bureau',
      justificatifs: ['Attestation télétravail', 'Justificatifs frais'],
      motif: 'Frais de télétravail',
      approbateur: 'Alexandre Dubois',
      commentaires: 'Conforme à la politique télétravail',
      couleur: 'green'
    },
    {
      id: 6,
      employeId: 6,
      employeNom: 'Marie Dubois',
      employeEmail: 'marie.dubois@email.com',
      departement: 'RH',
      poste: 'Responsable RH',
      type: 'Formation',
      statut: 'Approuvé',
      montant: 400.00,
      dateDemande: '2024-01-12',
      dateTraitement: '2024-01-15',
      datePaiement: '2024-01-22',
      description: 'Formation en management d\'équipe',
      justificatifs: ['Facture formation', 'Programme de formation'],
      motif: 'Développement managérial',
      approbateur: 'Sophie Martin',
      commentaires: 'Formation prioritaire pour le poste',
      couleur: 'green'
    },
    {
      id: 7,
      employeId: 7,
      employeNom: 'Lucas Rousseau',
      employeEmail: 'lucas.rousseau@email.com',
      departement: 'Design',
      poste: 'Designer Senior',
      type: 'Logiciels',
      statut: 'En attente',
      montant: 120.00,
      dateDemande: '2024-01-18',
      dateTraitement: null,
      datePaiement: null,
      description: 'Licence Adobe Creative Suite',
      justificatifs: ['Facture logiciel', 'Contrat de licence'],
      motif: 'Outils de travail',
      approbateur: 'Isabella Garcia',
      commentaires: 'En cours de validation du budget',
      couleur: 'orange'
    },
    {
      id: 8,
      employeId: 8,
      employeNom: 'Emma Petit',
      employeEmail: 'emma.petit@email.com',
      departement: 'Marketing',
      poste: 'Chargée de Communication',
      type: 'Événement',
      statut: 'Approuvé',
      montant: 75.00,
      dateDemande: '2024-01-14',
      dateTraitement: '2024-01-16',
      datePaiement: '2024-01-23',
      description: 'Participation salon professionnel',
      justificatifs: ['Facture inscription', 'Attestation de présence'],
      motif: 'Développement réseau professionnel',
      approbateur: 'Sophie Martin',
      commentaires: 'Événement pertinent pour le poste',
      couleur: 'green'
    },
    {
      id: 9,
      employeId: 9,
      employeNom: 'Jean Dupont',
      employeEmail: 'jean.dupont@email.com',
      departement: 'Commercial',
      poste: 'Commercial Senior',
      type: 'Frais de transport',
      statut: 'Approuvé',
      montant: 95.00,
      dateDemande: '2024-01-11',
      dateTraitement: '2024-01-14',
      datePaiement: '2024-01-21',
      description: 'Déplacements clients régionaux',
      justificatifs: ['Tickets de train', 'Factures péage'],
      motif: 'Visites clients',
      approbateur: 'Sophie Martin',
      commentaires: 'Déplacements justifiés par l\'activité commerciale',
      couleur: 'green'
    },
    {
      id: 10,
      employeId: 10,
      employeNom: 'Sarah Johnson',
      employeEmail: 'sarah.johnson@email.com',
      departement: 'Production',
      poste: 'Chef d\'équipe Production',
      type: 'Équipement de sécurité',
      statut: 'Approuvé',
      montant: 65.00,
      dateDemande: '2024-01-09',
      dateTraitement: '2024-01-11',
      datePaiement: '2024-01-18',
      description: 'Chaussures de sécurité et casque',
      justificatifs: ['Facture équipement', 'Certificat de conformité'],
      motif: 'Sécurité au travail',
      approbateur: 'Pierre Bernard',
      commentaires: 'Équipement conforme aux normes de sécurité',
      couleur: 'green'
    }
  ];

  const types = ['Frais de transport', 'Formation', 'Matériel informatique', 'Repas d\'affaires', 'Télétravail', 'Logiciels', 'Événement', 'Équipement de sécurité'];
  const statuts = ['Approuvé', 'En attente', 'Rejeté', 'Brouillon'];
  const departements = ['IT', 'Marketing', 'Finance', 'Design', 'RH', 'Commercial', 'Production'];
  const periodes = ['Janvier 2024', 'Décembre 2023', 'Novembre 2023', 'Octobre 2023', 'Septembre 2023'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Frais de transport':
        return 'bg-blue-100 text-blue-800';
      case 'Formation':
        return 'bg-green-100 text-green-800';
      case 'Matériel informatique':
        return 'bg-purple-100 text-purple-800';
      case 'Repas d\'affaires':
        return 'bg-orange-100 text-orange-800';
      case 'Télétravail':
        return 'bg-pink-100 text-pink-800';
      case 'Logiciels':
        return 'bg-indigo-100 text-indigo-800';
      case 'Événement':
        return 'bg-yellow-100 text-yellow-800';
      case 'Équipement de sécurité':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut) => {
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Frais de transport':
        return <TruckIcon className="h-5 w-5" />;
      case 'Formation':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'Matériel informatique':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'Repas d\'affaires':
        return <HomeIcon className="h-5 w-5" />;
      case 'Télétravail':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'Logiciels':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'Événement':
        return <StarIcon className="h-5 w-5" />;
      case 'Équipement de sécurité':
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <ReceiptRefundIcon className="h-5 w-5" />;
    }
  };

  const filteredRemboursements = remboursements.filter(remboursement => {
    const matchesSearch = !searchTerm || 
      remboursement.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remboursement.employeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remboursement.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remboursement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remboursement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'tous' || remboursement.statut === filterStatut;
    const matchesType = filterType === 'tous' || remboursement.type === filterType;
    const matchesDepartement = filterDepartement === 'tous' || remboursement.departement === filterDepartement;
    return matchesSearch && matchesStatut && matchesType && matchesDepartement;
  });

  const stats = {
    totalRemboursements: remboursements.length,
    approuves: remboursements.filter(r => r.statut === 'Approuvé').length,
    enAttente: remboursements.filter(r => r.statut === 'En attente').length,
    rejetes: remboursements.filter(r => r.statut === 'Rejeté').length,
    totalMontant: remboursements
      .filter(r => r.statut === 'Approuvé')
      .reduce((sum, r) => sum + r.montant, 0),
    montantEnAttente: remboursements
      .filter(r => r.statut === 'En attente')
      .reduce((sum, r) => sum + r.montant, 0)
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Remboursements</h1>
        <p className="text-gray-600">Gestion des remboursements et des notes de frais</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ReceiptRefundIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRemboursements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approuvés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approuves}</p>
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
              <p className="text-sm font-medium text-gray-600">Rejetés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejetes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant approuvé</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalMontant)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.montantEnAttente)}</p>
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
                  placeholder="Rechercher par employé, type, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
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
              {filteredRemboursements.length} remboursement(s) trouvé(s)
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
              {filteredRemboursements.map((remboursement) => (
                <div key={remboursement.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(remboursement.employeNom)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {remboursement.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{remboursement.poste}</p>
                        <p className="text-xs text-gray-500">{remboursement.departement}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(remboursement.montant)}</p>
                      <p className="text-sm text-gray-500">{formatDate(remboursement.dateDemande)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(remboursement.type)}
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-900">{remboursement.type}</h4>
                      <p className="text-sm text-gray-600">{remboursement.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Motif:</span>
                      <span className="font-medium">{remboursement.motif}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Approbateur:</span>
                      <span className="font-medium">{remboursement.approbateur}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Traitement:</span>
                      <span className="font-medium">{formatDate(remboursement.dateTraitement)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Paiement:</span>
                      <span className="font-medium">{formatDate(remboursement.datePaiement)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Justificatifs:</span>
                      <span className="font-medium">{remboursement.justificatifs.length} document(s)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(remboursement.statut)}`}>
                      {remboursement.statut}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(remboursement.type)}`}>
                      {remboursement.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartementColor(remboursement.departement)}`}>
                      {remboursement.departement}
                    </span>
                  </div>

                  {remboursement.commentaires && (
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{remboursement.commentaires}</p>
                    </div>
                  )}

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
              {filteredRemboursements.map((remboursement) => (
                <div key={remboursement.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(remboursement.employeNom)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {remboursement.employeNom}
                        </h3>
                        <p className="text-sm text-gray-600">{remboursement.poste} - {remboursement.departement}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{remboursement.type}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(remboursement.montant)}</span>
                          <span className="text-sm text-gray-500">Demandé le {formatDate(remboursement.dateDemande)}</span>
                          <span className="text-sm text-gray-500">{remboursement.justificatifs.length} justificatif(s)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{remboursement.motif}</p>
                        <p className="text-xs text-gray-500">Approbateur: {remboursement.approbateur}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(remboursement.statut)}`}>
                          {remboursement.statut}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(remboursement.type)}`}>
                          {remboursement.type}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du remboursement</h3>
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

export default Remboursements;
