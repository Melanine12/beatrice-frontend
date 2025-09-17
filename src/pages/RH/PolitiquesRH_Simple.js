import React, { useState } from 'react';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const PolitiquesRH_Simple = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('tous');

  // Données de démonstration simplifiées
  const politiques = [
    {
      id: 1,
      titre: 'Politique de télétravail',
      description: 'Règles et procédures pour le travail à distance',
      categorie: 'Télétravail',
      statut: 'Active',
      version: '2.1',
      dateMiseAJour: '2024-01-10',
      auteur: 'Marie Dubois',
      pages: 12,
      urgent: false
    },
    {
      id: 2,
      titre: 'Politique de congés et absences',
      description: 'Règlementation des congés payés, RTT et absences',
      categorie: 'Congés',
      statut: 'Active',
      version: '1.8',
      dateMiseAJour: '2023-12-15',
      auteur: 'Thomas Moreau',
      pages: 8,
      urgent: false
    },
    {
      id: 3,
      titre: 'Politique de sécurité informatique',
      description: 'Règles de sécurité et protection des données',
      categorie: 'Sécurité',
      statut: 'Active',
      version: '3.0',
      dateMiseAJour: '2024-01-05',
      auteur: 'Pierre Martin',
      pages: 15,
      urgent: true
    }
  ];

  const categories = ['Télétravail', 'Congés', 'Formation', 'Sécurité', 'Recrutement', 'Rémunération'];

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Télétravail': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Congés': return 'bg-green-100 text-green-800 border-green-200';
      case 'Formation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sécurité': return 'bg-red-100 text-red-800 border-red-200';
      case 'Recrutement': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Rémunération': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Brouillon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archivée': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Expirée': return 'bg-red-100 text-red-800 border-red-200';
      case 'En révision': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategorieIcon = (categorie) => {
    switch (categorie) {
      case 'Télétravail': return <UserIcon className="h-5 w-5" />;
      case 'Congés': return <CalendarDaysIcon className="h-5 w-5" />;
      case 'Formation': return <AcademicCapIcon className="h-5 w-5" />;
      case 'Sécurité': return <ShieldCheckIcon className="h-5 w-5" />;
      case 'Recrutement': return <UserGroupIcon className="h-5 w-5" />;
      case 'Rémunération': return <TrophyIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const filteredPolitiques = politiques.filter(politique => {
    const matchesSearch = !searchTerm || 
      politique.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politique.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politique.auteur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie = filterCategorie === 'tous' || politique.categorie === filterCategorie;
    return matchesSearch && matchesCategorie;
  });

  const stats = {
    totalPolitiques: politiques.length,
    actives: politiques.filter(p => p.statut === 'Active').length,
    urgentes: politiques.filter(p => p.urgent).length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full mb-4">
          <DocumentTextIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-2">
          Politiques RH
        </h1>
        <p className="text-gray-600 text-lg">Règlementation et procédures des ressources humaines</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-slate-500 to-slate-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-100 text-sm font-medium">Total Politiques</p>
              <p className="text-3xl font-bold">{stats.totalPolitiques}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-slate-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Actives</p>
              <p className="text-3xl font-bold">{stats.actives}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-0 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Urgentes</p>
              <p className="text-3xl font-bold">{stats.urgentes}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border-0 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
              >
                <option value="tous">Toutes les catégories</option>
                {categories.map(categorie => (
                  <option key={categorie} value={categorie}>{categorie}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPolitiques.map((politique) => (
              <div key={politique.id} className="break-inside-avoid bg-white rounded-2xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    politique.categorie === 'Télétravail' ? 'bg-blue-100' :
                    politique.categorie === 'Congés' ? 'bg-green-100' :
                    politique.categorie === 'Formation' ? 'bg-purple-100' :
                    politique.categorie === 'Sécurité' ? 'bg-red-100' :
                    politique.categorie === 'Recrutement' ? 'bg-orange-100' : 'bg-yellow-100'
                  }`}>
                    {getCategorieIcon(politique.categorie)}
                  </div>
                  {politique.urgent && (
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      URGENT
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-slate-600 transition-colors line-clamp-2">
                  {politique.titre}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{politique.description}</p>

                {/* Version et dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Version {politique.version}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    Mise à jour : {formatDate(politique.dateMiseAJour)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {politique.pages} pages
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatutColor(politique.statut)}`}>
                    {politique.statut}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategorieColor(politique.categorie)}`}>
                    {politique.categorie}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {politique.auteur}
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-slate-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolitiquesRH_Simple;
