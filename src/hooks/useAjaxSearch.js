import { useState, useEffect, useCallback, useRef } from 'react';

const useAjaxSearch = (searchFunction, options = {}) => {
  const {
    debounceMs = 300,
    minSearchLength = 0,
    cacheResults = true,
    maxCacheSize = 50
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Cache for search results
  const cache = useRef(new Map());
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (term) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check minimum search length
      if (term.length < minSearchLength) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      // Check cache first
      if (cacheResults && cache.current.has(term)) {
        setResults(cache.current.get(term));
        setHasSearched(true);
        return;
      }

      // Set timeout for debounced search
      timeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          setError(null);

          // Create new abort controller
          abortControllerRef.current = new AbortController();

          // Perform search
          const searchResults = await searchFunction(term, abortControllerRef.current.signal);

          // Cache results if enabled
          if (cacheResults && searchResults) {
            // Limit cache size
            if (cache.current.size >= maxCacheSize) {
              const firstKey = cache.current.keys().next().value;
              cache.current.delete(firstKey);
            }
            cache.current.set(term, searchResults);
          }

          setResults(searchResults || []);
          setHasSearched(true);
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Search error:', error);
            setError(error.message || 'Erreur lors de la recherche');
          }
        } finally {
          setIsSearching(false);
        }
      }, debounceMs);
    },
    [searchFunction, debounceMs, minSearchLength, cacheResults, maxCacheSize]
  );

  // Handle search term change
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
    setError(null);
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Abort current request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    searchTerm,
    results,
    isSearching,
    error,
    hasSearched,
    handleSearchChange,
    clearSearch,
    clearCache,
    // Additional utilities
    hasResults: results.length > 0,
    isEmpty: hasSearched && results.length === 0,
    isSearchingOrHasResults: isSearching || results.length > 0
  };
};

export default useAjaxSearch; 