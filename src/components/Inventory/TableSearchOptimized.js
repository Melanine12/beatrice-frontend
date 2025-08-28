import React, { useState, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import useAjaxSearch from '../../hooks/useAjaxSearch';

const TableSearchOptimized = ({ 
  onSearch,
  placeholder = "Rechercher...",
  debounceMs = 300,
  minSearchLength = 2,
  showFilters = true,
  filters = {},
  onFilterChange,
  className = ""
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Optimized search function with cache
  const searchFunction = useCallback(async (term, signal) => {
    if (!onSearch) return [];
    
    try {
      const results = await onSearch(term, signal);
      return results;
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    }
  }, [onSearch]);

  // Use the optimized search hook
  const {
    searchTerm,
    isSearching,
    error,
    handleSearchChange,
    clearSearch
  } = useAjaxSearch(searchFunction, {
    debounceMs,
    minSearchLength,
    cacheResults: true,
    maxCacheSize: 100
  });

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [localFilters, onFilterChange]);

  // Handle filter reset
  const handleFilterReset = useCallback(() => {
    const resetFilters = {};
    Object.keys(localFilters).forEach(key => {
      resetFilters[key] = '';
    });
    setLocalFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  }, [localFilters, onFilterChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Loading spinner */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {/* Clear button */}
        {searchTerm && !isSearching && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Effacer la recherche"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}

        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`input pl-10 ${isSearching ? 'pr-10' : ''} ${searchTerm ? 'pr-10' : ''}`}
        />

        {/* Error message */}
        {error && (
          <div className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(localFilters).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={value}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="input"
              >
                <option value="">Tous</option>
                {/* Add options based on filter type */}
                {key === 'categorie' && (
                  <>
                    <option value="Linge">Linge</option>
                    <option value="Hygiène">Hygiène</option>
                    <option value="Équipement">Équipement</option>
                    <option value="Nourriture">Nourriture</option>
                  </>
                )}
                {key === 'statut' && (
                  <>
                    <option value="En stock">En stock</option>
                    <option value="Rupture">Rupture</option>
                    <option value="Faible">Faible</option>
                  </>
                )}
              </select>
            </div>
          ))}
          
          <div className="flex items-end">
            <button
              onClick={handleFilterReset}
              className="btn-outline w-full"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Search status */}
      {searchTerm && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {isSearching ? (
            <span>Recherche en cours...</span>
          ) : (
            <span>Résultats pour "{searchTerm}"</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TableSearchOptimized; 