import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const JobPortalLanding = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Charger les offres d'emploi
  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    setLoading(true);
    try {
      const response = await api.get('/offres-emploi/public?limit=6');
      if (response.data.success) {
        setOffres(response.data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      
      // Si l'API publique n'est pas encore déployée, afficher un message d'information
      if (error.response?.status === 404) {
        console.log('API publique non disponible, utilisation de données de démonstration');
        // Données de démonstration
        setOffres([
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
          }
        ]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Hôtel Beatrice
                </h1>
                <p className="text-sm text-gray-600">Portail d'emploi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rejoignez notre équipe
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Découvrez les opportunités de carrière à l'Hôtel Beatrice
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Rechercher un poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button
                  onClick={() => document.getElementById('offres-section').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les types de contrat</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Interim">Intérim</option>
              <option value="Freelance">Freelance</option>
              <option value="Consultant">Consultant</option>
            </select>
            
            <input
              type="text"
              placeholder="Lieu de travail..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('');
                setSelectedLocation('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </section>

      {/* Offres d'emploi */}
      <section id="offres-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Offres d'emploi disponibles
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les opportunités qui vous correspondent
            </p>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          )}

          {/* Voir toutes les offres */}
          {filteredOffres.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/job-portal/all-jobs"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
              >
                Voir toutes les offres
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hôtel Beatrice</h3>
              <p className="text-gray-400">
                Votre partenaire de confiance pour une carrière enrichissante dans l'hôtellerie.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: recrutement@hotelbeatrice.com<br />
                Téléphone: +33 1 23 45 67 89
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <div className="space-y-2">
                <Link to="/job-portal" className="block text-gray-400 hover:text-white transition-colors">
                  Offres d'emploi
                </Link>
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Connexion
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hôtel Beatrice. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobPortalLanding;
