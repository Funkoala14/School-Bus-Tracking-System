import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
<<<<<<< Updated upstream
import storage from 'redux-persist/lib/storage'; // Default is localStorage for web
import authReducer from './authSlice/auth.slice';
import notificationReducer from './notificationSlice/notification.slice.js';
import adminReducer from './adminSlice/admin.slice.js';
import routeReducer from './routeSlice/route.slice.js';
import titleReducer from './titleSlice.js';
import parentReuducer from './parentSlice/parent.slice.js';
import driverReducer from './driverSlice/driver.slice.js';
=======
import storage from 'redux-persist/lib/storage'; // 默认使用 localStorage
>>>>>>> Stashed changes

// 引入其他 Reducer
import authReducer from './authSlice/auth.slice';
import notificationReducer from './notificationSlice/notification.slice';
import adminReducer from './adminSlice/admin.slice';
import routeReducer from './routeSlice/route.slice';
import titleReducer from './titleSlice';
import parentReducer from './parentSlice/parent.slice'; // 引入家长管理的 reducer
import busReducer from './busSlice/bus.slice';


// 合并所有 Reducer
const rootReducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
    admin: adminReducer,
    route: routeReducer,
    title: titleReducer,
<<<<<<< Updated upstream
    parent: parentReuducer,
    driver: driverReducer,
=======
    parent: parentReducer, // 添加家长管理的 reducer
    bus: busReducer, // 新增 Bus 管理的 reducer
>>>>>>> Stashed changes
});

// 配置持久化
const persistConfig = {
    key: 'root',
<<<<<<< Updated upstream
    storage, // Use localStorage to persist the state
    whitelist: ['auth', 'notification', 'admin', 'route', 'title', 'parent', 'driver'],
=======
    storage,
    whitelist: ['auth', 'admin', 'route', 'title', 'parent'], // 将 parent 加入持久化白名单
>>>>>>> Stashed changes
};

// 持久化 Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置 Store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;






