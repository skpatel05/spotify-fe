import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface SearchContextType {
  searchResults: any[];
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
}

// Create context with default value as undefined
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Custom hook to access the context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Props type for the provider
interface SearchProviderProps {
  children: ReactNode;
}

// Context Provider component
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};
