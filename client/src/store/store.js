import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage for web
import authReducer from './authSlice/auth.slice';

const rootReducer = combineReducers({
    auth: authReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage, // Use localStorage to persist the state
    whitelist: ['auth'],
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
