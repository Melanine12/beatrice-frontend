import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsersTable from '../components/Users/UsersTable';
import UsersStats from '../components/Users/UsersStats';

const Users = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Utilisateurs
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les utilisateurs et leurs permissions
          </p>
        </div>
        <button
          onClick={() => navigate('/assignments')}
          className="btn-primary"
        >
          Gestion des Affectations
        </button>
      </div>
      
      <UsersStats />
      <UsersTable />
    </div>
  );
};

export default Users; 