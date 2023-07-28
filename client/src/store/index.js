import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import auth from './authSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, auth)

export const store = configureStore({
    reducer: {
        persistedAuthReducer
    },
    middleware: [thunk]
});

export const persistor = persistStore(store)