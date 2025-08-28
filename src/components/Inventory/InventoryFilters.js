import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const InventoryFilters = ({ filters, setFilters, categories, statuses, onSearch }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setFilters({ ...filters, search: value });
          if (onSearch) {
            setIsSearching(true);
            onSearch(value).finally(() => setIsSearching(false));
          }
        }, 300); // 300ms delay
      };
    })(),
    [filters, setFilters, onSearch]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Handle category/status change
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Handle reset
  const handleReset = () => {
    setSearchValue('');
    setFilters({ categorie: '', statut: '', search: '' });
  };

  // Update search value when filters change externally
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recherche
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                </div>
              )}
              <input
                type="text"
                placeholder="Nom, description..."
                value={searchValue}
                onChange={handleSearchChange}
                className={`input pl-10 ${isSearching ? 'pr-10' : ''}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie
            </label>
            <select
              value={filters.categorie}
              onChange={(e) => handleFilterChange('categorie', e.target.value)}
              className="input"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select
              value={filters.statut}
              onChange={(e) => handleFilterChange('statut', e.target.value)}
              className="input"
            >
              <option value="">Tous les statuts</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="btn-outline w-full"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters; 