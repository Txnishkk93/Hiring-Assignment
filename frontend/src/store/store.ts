import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// Use a safe wrapper for web storage to avoid errors when `localStorage`
// is unavailable (e.g. some browsers, private mode, or non-browser envs).
const createWebStorage = (type: 'localStorage' | 'sessionStorage') => {
  return {
    getItem: (key: string) => {
      try {
        if (typeof window === 'undefined') return Promise.resolve(null);
        const store = (window as any)[type];
        return Promise.resolve(store ? store.getItem(key) : null);
      } catch (e) {
        return Promise.resolve(null);
      }
    },
    setItem: (key: string, value: string) => {
      try {
        if (typeof window === 'undefined') return Promise.resolve();
        const store = (window as any)[type];
        store && store.setItem(key, value);
        return Promise.resolve();
      } catch (e) {
        return Promise.resolve();
      }
    },
    removeItem: (key: string) => {
      try {
        if (typeof window === 'undefined') return Promise.resolve();
        const store = (window as any)[type];
        store && store.removeItem(key);
        return Promise.resolve();
      } catch (e) {
        return Promise.resolve();
      }
    },
  };
};

const storage = createWebStorage('localStorage');
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import { api } from './api';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import { logout } from './authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'booking'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Keep axios client token in sync with Redux auth state.
store.subscribe(() => {
  const token = store.getState().auth.token;
  setAuthToken(token);
});

setUnauthorizedHandler(() => {
  store.dispatch(logout());
  setAuthToken(null);
});

// Sync token on boot after rehydration.
persistor.subscribe(() => {
  const state = store.getState();
  if (state.auth.token) setAuthToken(state.auth.token);
});
