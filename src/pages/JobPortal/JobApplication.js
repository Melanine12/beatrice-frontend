import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const JobApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    candidat_nom: '',
    candidat_prenom: '',
    candidat_email: '',
    candidat_telephone: '',
    lettre_motivation: '',
    experience_annees: 0
  });

  // Charger l'offre d'emploi
  useEffect(() => {
    fetchOffre();
  }, [id]);

  const fetchOffre = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/offres-emploi/public/${id}`);
      if (response.data.success) {
        setOffre(response.data.data);
      } else {
        toast.error('Offre d\'emploi non trouvée');
        navigate('/job-portal');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'offre:', error);
      
      // Si l'API publique n'est pas encore déployée, utiliser des données de démonstration
      if (error.response?.status === 404) {
        console.log('API publique non disponible, utilisation de données de démonstration');
        // Données de démonstration basées sur l'ID
        const demoOffres = {
          1: {
            id: 1,
            titre_poste: "Réceptionniste",
            description: "Nous recherchons un(e) réceptionniste dynamique pour accueillir nos clients avec le sourire et gérer les réservations. Vous serez responsable de l'accueil des clients, de la gestion des réservations et de l'assistance aux invités.",
            type_contrat: "CDI",
            salaire_min: 25000,
            salaire_max: 30000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          },
          2: {
            id: 2,
            titre_poste: "Chef de Cuisine",
            description: "Rejoignez notre équipe culinaire en tant que Chef de Cuisine pour créer des expériences gastronomiques exceptionnelles. Vous dirigerez notre brigade et créerez des menus innovants.",
            type_contrat: "CDI",
            salaire_min: 45000,
            salaire_max: 55000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          },
          3: {
            id: 3,
            titre_poste: "Agent d'Entretien",
            description: "Nous cherchons un(e) agent d'entretien consciencieux(se) pour maintenir nos espaces dans un état impeccable. Vous serez responsable du nettoyage et de l'entretien des chambres et espaces communs.",
            type_contrat: "CDD",
            salaire_min: 20000,
            salaire_max: 25000,
            devise: "USD",
            lieu_travail: "Paris, France",
            statut: "Ouverte",
            date_creation: new Date().toISOString()
          }
        };
        
        const demoOffre = demoOffres[id] || demoOffres[1];
        setOffre(demoOffre);
        toast.success('Mode démonstration - Cette offre est un exemple');
      } else {
        toast.error('Erreur lors du chargement de l\'offre');
        navigate('/job-portal');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post(`/offres-emploi/${id}/candidater`, formData);
      if (response.data.success) {
        toast.success('Candidature envoyée avec succès !');
        navigate('/job-portal/success');
      } else {
        toast.error(response.data.message || 'Erreur lors de l\'envoi de la candidature');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la candidature:', error);
      
      // Si l'API publique n'est pas encore déployée, simuler un succès
      if (error.response?.status === 404) {
        console.log('API publique non disponible, simulation de candidature réussie');
        toast.success('Candidature simulée avec succès ! (Mode démonstration)');
        navigate('/job-portal/success');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de l\'envoi de la candidature');
      }
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Offre non trouvée</h1>
          <Link to="/job-portal" className="text-primary-600 hover:text-primary-700">
            Retour aux offres d'emploi
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations sur l'offre */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {offre.titre_poste}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeContratColor(offre.type_contrat)}`}>
                    {offre.type_contrat}
                  </span>
                </div>

                {offre.lieu_travail && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {offre.lieu_travail}
                  </div>
                )}

                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {offre.salaire_min && offre.salaire_max 
                    ? `${formatCurrency(offre.salaire_min, offre.devise)} - ${formatCurrency(offre.salaire_max, offre.devise)}`
                    : offre.salaire_min 
                    ? `À partir de ${formatCurrency(offre.salaire_min, offre.devise)}`
                    : 'À négocier'
                  }
                </div>

                {offre.date_limite_candidature && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date limite: {new Date(offre.date_limite_candidature).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description du poste</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {offre.description}
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire de candidature */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Candidature pour {offre.titre_poste}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="candidat_nom"
                      value={formData.candidat_nom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="candidat_prenom"
                      value={formData.candidat_prenom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="candidat_email"
                      value={formData.candidat_email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="candidat_telephone"
                      value={formData.candidat_telephone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Années d'expérience
                  </label>
                  <input
                    type="number"
                    name="experience_annees"
                    value={formData.experience_annees}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lettre de motivation *
                  </label>
                  <textarea
                    name="lettre_motivation"
                    value={formData.lettre_motivation}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Expliquez pourquoi vous êtes intéressé par ce poste et ce que vous pouvez apporter à notre équipe..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Link
                    to="/job-portal"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer ma candidature'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
