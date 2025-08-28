import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

const ExpensesFilters = ({ filters, onFilterChange, onReset }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [tagInput, setTagInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onFilterChange({ ...filters, search: value });
          setIsSearching(false);
        }, 300);
      };
    })(),
    [filters, onFilterChange]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Handle tag addition
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !filters.tags?.includes(tag)) {
      const newTags = [...(filters.tags || []), tag];
      handleFilterChange('tags', newTags);
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    const newTags = filters.tags?.filter(tag => tag !== tagToRemove) || [];
    handleFilterChange('tags', newTags);
  };

  // Handle reset
  const handleReset = () => {
    setSearchValue('');
    setTagInput('');
    onReset();
  };

  // Update search value when filters change externally
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  const categories = [
    'Maintenance',
    'Nettoyage',
    'Équipement',
    'Services',
    'Marketing',
    'Administration',
    'Autre'
  ];

  const statuses = [
    'En attente',
    'Approuvée',
    'Payée',
    'Rejetée'
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="space-y-4">
          {/* Main Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
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
                  placeholder="Titre, description, fournisseur..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  className={`input pl-10 ${isSearching ? 'pr-10' : ''}`}
                />
              </div>
            </div>

            {/* Category */}
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

            {/* Status */}
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

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de début
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de fin
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Reset Button */}
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

          {/* Tags Filter Row */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="input flex-1"
                placeholder="Ajouter un tag pour filtrer"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-outline px-3"
              >
                <TagIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Display active tag filters */}
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesFilters; 