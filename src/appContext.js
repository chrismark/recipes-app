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
export const AppStateContext = createContext(null);
export const AppDispatchContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const appContextValue = useReducer(reducer, {user: null, pageOffset: 0});
  const [state, dispatch] = useReducer(reducer, {user: null, pageOffset: 0});
  return (
    // <AppContext.Provider value={appContextValue}>
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
    // </AppContext.Provider>
  );
};
