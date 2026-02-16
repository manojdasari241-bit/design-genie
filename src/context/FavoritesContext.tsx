import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (templateId: string) => void;
  removeFavorite: (templateId: string) => void;
  toggleFavorite: (templateId: string) => void;
  isFavorite: (templateId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'design-genie-favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (templateId: string) => {
    setFavorites((prev) => {
      if (prev.includes(templateId)) return prev;
      return [...prev, templateId];
    });
  };

  const removeFavorite = (templateId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== templateId));
  };

  const toggleFavorite = (templateId: string) => {
    if (favorites.includes(templateId)) {
      removeFavorite(templateId);
    } else {
      addFavorite(templateId);
    }
  };

  const isFavorite = (templateId: string) => favorites.includes(templateId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
