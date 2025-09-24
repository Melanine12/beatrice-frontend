import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AllJobs = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const itemsPerPage = 9;

  // Charger les offres d'emploi
  useEffect(() => {
    fetchOffres();
  }, [currentPage]);

  const fetchOffres = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/offres-emploi/public?page=${currentPage}&limit=${itemsPerPage}`);
      if (response.data.success) {
        setOffres(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      
      // Si l'API publique n'est pas encore déployée, afficher un message d'information
      if (error.response?.status === 404) {
        console.log('API publique non disponible, utilisation de données de démonstration');
        // Données de démonstration
        const demoOffres = [
          {
            id: 1,
            titre_poste: "Réceptionniste",
            description: "Nous recherchons un(e) réceptionniste dynamique pour accueillir nos clients avec le sourire et gérer les réservations.",
            type_contrat: "CDI",
            salaire_min: 25000,
            salaire_max: 30000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          },
          {
            id: 2,
            titre_poste: "Chef de Cuisine",
            description: "Rejoignez notre équipe culinaire en tant que Chef de Cuisine pour créer des expériences gastronomiques exceptionnelles.",
            type_contrat: "CDI",
            salaire_min: 45000,
            salaire_max: 55000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          },
          {
            id: 3,
            titre_poste: "Agent d'Entretien",
            description: "Nous cherchons un(e) agent d'entretien consciencieux(se) pour maintenir nos espaces dans un état impeccable.",
            type_contrat: "CDD",
            salaire_min: 20000,
            salaire_max: 25000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          },
          {
            id: 4,
            titre_poste: "Concierge",
            description: "Rejoignez notre équipe en tant que Concierge pour offrir un service personnalisé et mémorable à nos clients.",
            type_contrat: "CDI",
            salaire_min: 30000,
            salaire_max: 35000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          },
          {
            id: 5,
            titre_poste: "Serveur/Serveuse",
            description: "Nous cherchons des serveurs/serveuses expérimentés pour notre restaurant gastronomique.",
            type_contrat: "CDI",
            salaire_min: 22000,
            salaire_max: 28000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          },
          {
            id: 6,
            titre_poste: "Stagiaire Marketing",
            description: "Stage de 6 mois en marketing hôtelier pour développer nos campagnes digitales et événementielles.",
            type_contrat: "Stage",
            salaire_min: 800,
            salaire_max: 1000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          }
        ];
        setOffres(demoOffres);
        setTotalPages(1);
        toast.success('Mode démonstration - Les offres d\'emploi seront bientôt disponibles');
      } else {
        toast.error('Erreur lors du chargement des offres');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les offres
  const filteredOffres = offres.filter(offre => {
    const matchesSearch = offre.titre_poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offre.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || offre.type_contrat === selectedType;
    const matchesLocation = !selectedLocation || 
                           (offre.lieu_travail && offre.lieu_travail.toLowerCase().includes(selectedLocation.toLowerCase()));
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const formatCurrency = (amount, devise = 'USD') => {
    if (!amount) return 'À négocier';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise
    }).format(amount);
  };

  const getTypeContratColor = (type) => {
    const colors = {
      'CDI': 'bg-blue-100 text-blue-800',
      'CDD': 'bg-orange-100 text-orange-800',
      'Stage': 'bg-purple-100 text-purple-800',
      'Interim': 'bg-pink-100 text-pink-800',
      'Freelance': 'bg-indigo-100 text-indigo-800',
      'Consultant': 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatutColor = (statut) => {
    const colors = {
      'Ouverte': 'bg-green-100 text-green-800',
      'Fermée': 'bg-red-100 text-red-800',
      'Suspendue': 'bg-yellow-100 text-yellow-800',
      'Pourvue': 'bg-blue-100 text-blue-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/job-portal" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Hôtel Beatrice
              </h1>
              <span className="ml-2 text-sm text-gray-600">Portail d'emploi</span>
            </Link>
            <Link
              to="/login"
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Toutes les offres d'emploi
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez toutes les opportunités de carrière disponibles
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Rechercher un poste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les types</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Interim">Intérim</option>
                <option value="Freelance">Freelance</option>
                <option value="Consultant">Consultant</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de travail
              </label>
              <input
                type="text"
                placeholder="Lieu de travail..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setSelectedLocation('');
                }}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredOffres.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune offre trouvée</h3>
            <p className="mt-1 text-gray-500">
              Aucune offre d'emploi ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredOffres.map((offre) => (
                <div key={offre.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                  <div className="p-6">
                    {/* En-tête */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {offre.titre_poste}
                        </h3>
                        {offre.lieu_travail && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {offre.lieu_travail}
                          </div>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(offre.statut)}`}>
                        {offre.statut}
                      </span>
                    </div>

                    {/* Type de contrat */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeContratColor(offre.type_contrat)}`}>
                        {offre.type_contrat}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {offre.description}
                      </p>
                    </div>

                    {/* Salaire */}
                    <div className="mb-4">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        {offre.salaire_min && offre.salaire_max 
                          ? `${formatCurrency(offre.salaire_min, offre.devise)} - ${formatCurrency(offre.salaire_max, offre.devise)}`
                          : offre.salaire_min 
                          ? `À partir de ${formatCurrency(offre.salaire_min, offre.devise)}`
                          : 'À négocier'
                        }
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {offre.date_creation && new Date(offre.date_creation).toLocaleDateString('fr-FR')}
                      </div>
                      <Link
                        to={`/job-portal/apply/${offre.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        Postuler
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> sur{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllJobs;
