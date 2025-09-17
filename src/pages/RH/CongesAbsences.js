import React, { useState, useEffect } from 'react';

const CongesAbsences = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);

  useEffect(() => {
    // Simuler le chargement des demandes
    setTimeout(() => {
      setDemandes([
        {
          id: 1,
          employe: 'Jean Dupont',
          type: 'Congés payés',
          dateDebut: '2024-01-15',
          dateFin: '2024-01-22',
          statut: 'En attente',
          motif: 'Vacances familiales',
          dateDemande: '2024-01-10'
        },
        {
          id: 2,
          employe: 'Marie Martin',
          type: 'Maladie',
          dateDebut: '2024-01-12',
          dateFin: '2024-01-14',
          statut: 'Approuvé',
          motif: 'Grippe',
          dateDemande: '2024-01-12'
        },
        {
          id: 3,
          employe: 'Pierre Durand',
          type: 'Congés payés',
          dateDebut: '2024-02-01',
          dateFin: '2024-02-07',
          statut: 'Rejeté',
          motif: 'Vacances',
          dateDemande: '2024-01-20'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Approuvé':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejeté':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleApprove = (id) => {
    setDemandes(demandes.map(d => 
      d.id === id ? { ...d, statut: 'Approuvé' } : d
    ));
  };

  const handleReject = (id) => {
    setDemandes(demandes.map(d => 
      d.id === id ? { ...d, statut: 'Rejeté' } : d
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Congés et Absences
          </h1>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Nouvelle demande
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {demandes.length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              Total demandes
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
              {demandes.filter(d => d.statut === 'En attente').length}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-300">
              En attente
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">
              {demandes.filter(d => d.statut === 'Approuvé').length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-300">
              Approuvées
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-300">
              {demandes.filter(d => d.statut === 'Rejeté').length}
            </div>
            <div className="text-sm text-red-600 dark:text-red-300">
              Rejetées
            </div>
          </div>
        </div>

        {/* Tableau des demandes */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {demandes.map((demande) => (
                <tr key={demande.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {demande.employe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {demande.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(demande.statut)}`}>
                      {demande.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedDemande(demande)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Voir
                    </button>
                    {demande.statut === 'En attente' && (
                      <>
                        <button
                          onClick={() => handleApprove(demande.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject(demande.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails */}
      {selectedDemande && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Détails de la demande
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Employé
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedDemande.employe}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedDemande.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Période
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedDemande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(selectedDemande.dateFin).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Motif
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedDemande.motif}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date de demande
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedDemande.dateDemande).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setSelectedDemande(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CongesAbsences;
