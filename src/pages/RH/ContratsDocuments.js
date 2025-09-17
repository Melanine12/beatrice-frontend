import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ContratsDocuments = () => {
  const [activeTab, setActiveTab] = useState('contrats');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState(null);

  // Données de démonstration
  const employes = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      departement: 'IT',
      poste: 'Développeur Senior'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Marie',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      departement: 'RH',
      poste: 'Responsable RH'
    },
    {
      id: 3,
      nom: 'Bernard',
      prenom: 'Pierre',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      departement: 'Finance',
      poste: 'Comptable'
    },
    {
      id: 4,
      nom: 'Leroy',
      prenom: 'Sophie',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      departement: 'Marketing',
      poste: 'Chef de Projet'
    },
    {
      id: 5,
      nom: 'Moreau',
      prenom: 'Thomas',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      departement: 'IT',
      poste: 'Développeur'
    }
  ];

  const contrats = [
    {
      id: 1,
      employeId: 1,
      type: 'CDI',
      statut: 'Actif',
      dateDebut: '2023-01-15',
      dateFin: null,
      salaire: '4500€',
      duree: 'Indéterminée',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 2,
      type: 'CDI',
      statut: 'Actif',
      dateDebut: '2022-06-01',
      dateFin: null,
      salaire: '3800€',
      duree: 'Indéterminée',
      couleur: 'green'
    },
    {
      id: 3,
      employeId: 3,
      type: 'CDD',
      statut: 'Expiré',
      dateDebut: '2023-03-01',
      dateFin: '2023-12-31',
      salaire: '3200€',
      duree: '10 mois',
      couleur: 'red'
    },
    {
      id: 4,
      employeId: 4,
      type: 'Stage',
      statut: 'En attente',
      dateDebut: '2024-02-01',
      dateFin: '2024-08-31',
      salaire: '600€',
      duree: '6 mois',
      couleur: 'yellow'
    },
    {
      id: 5,
      employeId: 5,
      type: 'CDI',
      statut: 'Actif',
      dateDebut: '2023-09-01',
      dateFin: null,
      salaire: '2800€',
      duree: 'Indéterminée',
      couleur: 'green'
    }
  ];

  const documents = [
    {
      id: 1,
      employeId: 1,
      nom: 'Contrat de travail',
      type: 'Contrat',
      statut: 'Validé',
      dateCreation: '2023-01-15',
      dateExpiration: null,
      taille: '2.3 MB',
      couleur: 'green'
    },
    {
      id: 2,
      employeId: 1,
      nom: 'CV',
      type: 'CV',
      statut: 'Validé',
      dateCreation: '2023-01-10',
      dateExpiration: null,
      taille: '1.8 MB',
      couleur: 'green'
    },
    {
      id: 3,
      employeId: 2,
      nom: 'Diplôme Master',
      type: 'Diplôme',
      statut: 'En attente',
      dateCreation: '2022-06-01',
      dateExpiration: null,
      taille: '3.1 MB',
      couleur: 'yellow'
    },
    {
      id: 4,
      employeId: 3,
      nom: 'Certificat de formation',
      type: 'Certificat',
      statut: 'Expiré',
      dateCreation: '2023-03-01',
      dateExpiration: '2024-03-01',
      taille: '1.2 MB',
      couleur: 'red'
    },
    {
      id: 5,
      employeId: 4,
      nom: 'Lettre de motivation',
      type: 'Lettre',
      statut: 'Validé',
      dateCreation: '2024-01-15',
      dateExpiration: null,
      taille: '0.8 MB',
      couleur: 'green'
    }
  ];

  const getEmployeById = (id) => employes.find(emp => emp.id === id);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Actif':
      case 'Validé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expiré':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'CDI':
        return 'bg-blue-100 text-blue-800';
      case 'CDD':
        return 'bg-orange-100 text-orange-800';
      case 'Stage':
        return 'bg-purple-100 text-purple-800';
      case 'Contrat':
        return 'bg-green-100 text-green-800';
      case 'CV':
        return 'bg-blue-100 text-blue-800';
      case 'Diplôme':
        return 'bg-purple-100 text-purple-800';
      case 'Certificat':
        return 'bg-yellow-100 text-yellow-800';
      case 'Lettre':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContrats = contrats.filter(contrat => {
    const employe = getEmployeById(contrat.employeId);
    const matchesSearch = !searchTerm || 
      employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || contrat.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredDocuments = documents.filter(doc => {
    const employe = getEmployeById(doc.employeId);
    const matchesSearch = !searchTerm || 
      employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'tous' || doc.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalContrats: contrats.length,
    contratsActifs: contrats.filter(c => c.statut === 'Actif').length,
    contratsExpires: contrats.filter(c => c.statut === 'Expiré').length,
    totalDocuments: documents.length,
    documentsValides: documents.filter(d => d.statut === 'Validé').length,
    documentsExpires: documents.filter(d => d.statut === 'Expiré').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contrats & Documents</h1>
        <p className="text-gray-600">Gestion des contrats et documents RH</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contrats</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContrats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contrats Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.contratsActifs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents Expirés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.documentsExpires}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('contrats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contrats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contrats
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par employé ou document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="En attente">En attente</option>
                <option value="Expiré">Expiré</option>
                <option value="Validé">Validé</option>
              </select>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouveau
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'contrats' && (
            <div className="space-y-4">
              {filteredContrats.map((contrat) => {
                const employe = getEmployeById(contrat.employeId);
                return (
                  <div key={contrat.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employe.avatar}
                          alt={`${employe.prenom} ${employe.nom}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {employe.prenom} {employe.nom}
                          </h3>
                          <p className="text-sm text-gray-600">{employe.poste} - {employe.departement}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(contrat.type)}`}>
                          {contrat.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(contrat.statut)}`}>
                          {contrat.statut}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{contrat.salaire}</p>
                          <p className="text-xs text-gray-500">{contrat.duree}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Début: {new Date(contrat.dateDebut).toLocaleDateString('fr-FR')}</span>
                      {contrat.dateFin && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Fin: {new Date(contrat.dateFin).toLocaleDateString('fr-FR')}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {filteredDocuments.map((document) => {
                const employe = getEmployeById(document.employeId);
                return (
                  <div key={document.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employe.avatar}
                          alt={`${employe.prenom} ${employe.nom}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{document.nom}</h3>
                          <p className="text-sm text-gray-600">{employe.prenom} {employe.nom} - {employe.poste}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(document.type)}`}>
                          {document.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(document.statut)}`}>
                          {document.statut}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{document.taille}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(document.dateCreation).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {document.dateExpiration && (
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>Expire le: {new Date(document.dateExpiration).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveau Document</h3>
            <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement...</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContratsDocuments;
