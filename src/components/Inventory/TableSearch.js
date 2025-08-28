import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TableSearch = ({ 
  placeholder = "Rechercher...", 
  onSearch, 
  debounceMs = 300,
  className = "",
  showClearButton = true 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (onSearch) {
            setIsSearching(true);
            try {
              await onSearch(value);
            } finally {
              setIsSearching(false);
            }
          }
        }, debounceMs);
      };
    })(),
    [onSearch, debounceMs]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Loading spinner */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {/* Clear button */}
        {showClearButton && searchValue && !isSearching && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}

        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          className={`input pl-10 ${isSearching ? 'pr-10' : ''} ${showClearButton && searchValue ? 'pr-10' : ''}`}
        />
      </div>
    </div>
  );
};

export default TableSearch; 