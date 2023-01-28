import { useState, createContext } from 'react';

export const AppContext = createContext(null);
export const AppContextProvider = ({ children }) => {
  return (
    <AppContext.Provider value={useState(null)}>
      {children}
    </AppContext.Provider>
  );
};
