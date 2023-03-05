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

export const AppStateContext = createContext(null);
export const AppDispatchContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {user: null, pageOffset: 0});
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
