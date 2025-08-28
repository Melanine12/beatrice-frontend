import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mon Profil
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez vos informations personnelles
        </p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Informations personnelles
          </h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom complet
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.prenom} {user?.nom}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rôle
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.role}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Téléphone
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.telephone || 'Non renseigné'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 