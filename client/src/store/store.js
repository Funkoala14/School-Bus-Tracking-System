import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage for web
import authReducer from './authSlice/auth.slice';
import notificationReducer from './notificationSlice/notification.slice.js';
import adminReducer from './adminSlice/admin.slice.js';
import routeReducer from './routeSlice/route.slice.js';

const rootReducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
    admin: adminReducer,
    route: routeReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage, // Use localStorage to persist the state
    whitelist: ['auth', 'admin'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer, // Use the persisted root reducer
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for redux-persist
        }),
    devTools: true,
});

// Create the persistor to manage rehydrating the store
export const persistor = persistStore(store);

export default store;
