import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'magnet_credits';

const initialState = {
  gender: null,
  images: [null, null, null],
  sessionId: null,
  api1: null,
  api2: null,
  api3: null,
  portraits: null,
  selectedTypes: [],
  credits: 0,
  demoMode: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_GENDER':
      return { ...state, gender: action.payload };

    case 'SET_IMAGE': {
      const images = [...state.images];
      images[action.index] = action.payload;
      return { ...state, images };
    }

    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };

    case 'SET_API1':
      return { ...state, api1: action.payload };

    case 'SET_API2':
      return { ...state, api2: action.payload };

    case 'SET_API3':
      return { ...state, api3: action.payload };

    case 'SET_PORTRAITS':
      return { ...state, portraits: action.payload };

    case 'SET_TYPES':
      return { ...state, selectedTypes: action.payload };

    case 'ADD_CREDITS':
      return { ...state, credits: state.credits + action.payload };

    case 'USE_CREDIT':
      return { ...state, credits: Math.max(0, state.credits - 1) };

    case 'SET_DEMO':
      return { ...state, demoMode: action.payload };

    case 'RESET':
      return { ...initialState, credits: state.credits };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val !== null) {
          const parsed = parseInt(val, 10);
          if (!isNaN(parsed) && parsed > 0) {
            dispatch({ type: 'ADD_CREDITS', payload: parsed });
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, String(state.credits)).catch(() => {});
  }, [state.credits]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
