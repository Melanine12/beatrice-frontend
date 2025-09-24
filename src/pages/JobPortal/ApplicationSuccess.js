import React from 'react';
import { Link } from 'react-router-dom';

const ApplicationSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Icône de succès */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Candidature envoyée !
          </h1>
          
          <p className="text-gray-600 mb-6">
            Votre candidature a été envoyée avec succès. Notre équipe RH examinera votre dossier et vous contactera dans les plus brefs délais.
          </p>

          <div className="space-y-4">
            <Link
              to="/job-portal"
              className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors inline-block"
            >
              Voir d'autres offres
            </Link>
            
            <Link
              to="/login"
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors inline-block"
            >
              Se connecter
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Vous recevrez un email de confirmation à l'adresse fournie.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccess;
