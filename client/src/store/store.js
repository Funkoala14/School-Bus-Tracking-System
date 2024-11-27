import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage for web
import authReducer from './authSlice/auth.slice';
import notificationReducer from './notificationSlice/notification.slice.js';
import adminReducer from './adminSlice/admin.slice.js';
import routeReducer from './routeSlice/route.slice.js';
import titleReducer from './titleSlice.js';
import parentReuducer from './parentSlice/parent.slice.js';
import driverReducer from './driverSlice/driver.slice.js';

const rootReducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
    admin: adminReducer,
    route: routeReducer,
    title: titleReducer,
    parent: parentReuducer,
    driver: driverReducer,
});

const persistConfig = {
    key: 'root',
    storage, // Use localStorage to persist the state
    whitelist: ['auth', 'notification', 'admin', 'route', 'title', 'parent', 'driver'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;






