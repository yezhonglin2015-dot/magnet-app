import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../services/userId';
import { initIAP, buyCredits, teardownIAP } from '../services/iap';
import { fetchCredits } from '../api';

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
  userId: null,
  credits: 0,
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

    case 'SET_USER_ID':
      return { ...state, userId: action.payload };

    // credits 真相源 = 服务端，覆盖式设置
    case 'SET_CREDITS':
      return { ...state, credits: action.payload };

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
      return { ...initialState, userId: state.userId, credits: state.credits, savedReport: null };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // 购买异步结果转 Promise：listener 回调里 resolve/reject
  const purchaseResolver = useRef(null);

  // Startup: 加载上次报告 + 拿 user_id + 查服务端余额 + 连 StoreKit
  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(REPORT_KEY)
      .then((reportVal) => {
        if (!mounted || reportVal == null) return;
        try {
          const parsed = JSON.parse(reportVal);
          if (parsed && parsed.api2) {
            dispatch({ type: 'LOAD_SAVED_REPORT', payload: parsed });
          }
        } catch (_) {}
      })
      .catch(() => {});

    (async () => {
      const uid = await getUserId();
      if (!mounted) return;
      dispatch({ type: 'SET_USER_ID', payload: uid });
      try {
        const c = await fetchCredits(uid);
        if (mounted) dispatch({ type: 'SET_CREDITS', payload: c });
      } catch (_) {}
      if (Platform.OS === 'ios') {
        initIAP(
          uid,
          (balance) => {
            dispatch({ type: 'SET_CREDITS', payload: balance });
            purchaseResolver.current?.resolve(balance);
            purchaseResolver.current = null;
          },
          (msg) => {
            purchaseResolver.current?.reject(new Error(msg));
            purchaseResolver.current = null;
          }
        );
      }
    })();

    return () => {
      mounted = false;
      teardownIAP();
    };
  }, []);

  // 报告持久化（credits 不再本地存，以服务端为准）
  useEffect(() => {
    if (state.savedReport !== null) {
      AsyncStorage.setItem(REPORT_KEY, JSON.stringify(state.savedReport)).catch(() => {});
    } else {
      AsyncStorage.removeItem(REPORT_KEY).catch(() => {});
    }
  }, [state.savedReport]);

  // 发起购买，Promise 在验证成功(resolve 新余额)或失败(reject)时结束
  async function buy(sku) {
    return new Promise((resolve, reject) => {
      purchaseResolver.current = { resolve, reject };
      buyCredits(sku).catch((e) => {
        purchaseResolver.current = null;
        reject(e);
      });
    });
  }

  // 重新拉服务端余额（扣费后校正）
  async function refreshCredits() {
    try {
      const uid = await getUserId();
      const c = await fetchCredits(uid);
      dispatch({ type: 'SET_CREDITS', payload: c });
    } catch (_) {}
  }

  return (
    <AppContext.Provider value={{ state, dispatch, buy, refreshCredits }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
