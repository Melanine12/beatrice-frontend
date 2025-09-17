import React, { useState, useEffect } from 'react';

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  useEffect(() => {
    // Simuler le chargement des évaluations
    setTimeout(() => {
      setEvaluations([
        {
          id: 1,
          employe: 'Jean Dupont',
          poste: 'Réceptionniste',
          periode: 'Q1 2024',
          statut: 'En cours',
          dateCreation: '2024-01-15',
          dateEcheance: '2024-03-31',
          note: null
        },
        {
          id: 2,
          employe: 'Marie Martin',
          poste: 'Chef de cuisine',
          periode: 'Q1 2024',
          statut: 'Terminée',
          dateCreation: '2024-01-10',
          dateEcheance: '2024-03-31',
          note: 4.2
        },
        {
          id: 3,
          employe: 'Pierre Durand',
          poste: 'Agent de maintenance',
          periode: 'Q1 2024',
          statut: 'En attente',
          dateCreation: '2024-01-20',
          dateEcheance: '2024-03-31',
          note: null
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'En cours':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Terminée':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getNoteColor = (note) => {
    if (note === null) return 'text-gray-500 dark:text-gray-400';
    if (note >= 4) return 'text-green-600 dark:text-green-400';
    if (note >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
            Gestion des Évaluations
          </h1>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Nouvelle évaluation
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {evaluations.length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              Total évaluations
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
              {evaluations.filter(e => e.statut === 'En attente').length}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-300">
              En attente
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {evaluations.filter(e => e.statut === 'En cours').length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              En cours
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">
              {evaluations.filter(e => e.statut === 'Terminée').length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-300">
              Terminées
            </div>
          </div>
        </div>

        {/* Tableau des évaluations */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {evaluation.employe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {evaluation.poste}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {evaluation.periode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(evaluation.statut)}`}>
                      {evaluation.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getNoteColor(evaluation.note)}`}>
                      {evaluation.note ? `${evaluation.note}/5` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedEvaluation(evaluation)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Voir
                    </button>
                    {evaluation.statut === 'En attente' && (
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        Commencer
                      </button>
                    )}
                    {evaluation.statut === 'En cours' && (
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        Continuer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Détails de l'évaluation
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Employé
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedEvaluation.employe}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Poste
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedEvaluation.poste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Période
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedEvaluation.periode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Statut
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEvaluation.statut)}`}>
                    {selectedEvaluation.statut}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date d'échéance
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedEvaluation.dateEcheance).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {selectedEvaluation.note && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Note finale
                    </label>
                    <p className={`text-sm font-medium ${getNoteColor(selectedEvaluation.note)}`}>
                      {selectedEvaluation.note}/5
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setSelectedEvaluation(null)}
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

export default Evaluations;
