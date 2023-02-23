import { useState, useReducer, createContext } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_user': 
      return {
        ...state,
        user: action.user
      };
      break;
    case 'update_pageOffset':
      return {
        ...state,
        pageOffset: action.pageOffset
      }
      break;
  }
};

export const AppContext = createContext(null);
export const AppContextProvider = ({ children }) => {
  return (
    <AppContext.Provider value={useReducer(reducer, {user: null, pageOffset: 0})}>
      {children}
    </AppContext.Provider>
  );
};
