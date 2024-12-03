import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './global.scss';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './components/Loading.jsx';
import store, { persistor } from './store/store.js';
import dayjs from 'dayjs';
import 'dayjs/locale/en-nz';
dayjs.locale('en-nz');
createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <PersistGate loading={<Loading />} persistor={persistor}>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </PersistGate>
    // </StrictMode>
);
