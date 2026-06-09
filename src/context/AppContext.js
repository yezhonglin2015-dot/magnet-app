import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'magnet_credits';
const REPORT_KEY = 'magnet_last_report';

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
  savedReport: null,
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

    case 'SAVE_REPORT':
      return {
        ...state,
        savedReport: {
          gender: state.gender,
          api1: state.api1,
          api2: state.api2,
          api3: state.api3,
          portraits: state.portraits,
          selectedTypes: state.selectedTypes,
        },
      };

    case 'LOAD_SAVED_REPORT':
      return { ...state, savedReport: action.payload };

    case 'CLEAR_SAVED_REPORT':
      return { ...state, savedReport: null };

    case 'RESET':
      return { ...initialState, credits: state.credits, savedReport: null };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Startup: load credits and last report
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(REPORT_KEY),
    ])
      .then(([creditsVal, reportVal]) => {
        if (creditsVal !== null) {
          const parsed = parseInt(creditsVal, 10);
          if (!isNaN(parsed) && parsed > 0) {
            dispatch({ type: 'ADD_CREDITS', payload: parsed });
          }
        }
        if (reportVal !== null) {
          try {
            const parsedReport = JSON.parse(reportVal);
            if (parsedReport && parsedReport.api2) {
              dispatch({ type: 'LOAD_SAVED_REPORT', payload: parsedReport });
            }
          } catch (_) {}
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, String(state.credits)).catch(() => {});
  }, [state.credits]);

  useEffect(() => {
    if (state.savedReport !== null) {
      AsyncStorage.setItem(REPORT_KEY, JSON.stringify(state.savedReport)).catch(() => {});
    } else {
      AsyncStorage.removeItem(REPORT_KEY).catch(() => {});
    }
  }, [state.savedReport]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
