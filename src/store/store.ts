import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import signin from './slices/signin'
import signup from './slices/signup'
import getAccounts from './slices/Accounts/getAccounts'
import createAccount from './slices/Accounts/createAccount'
import updateAccount from './slices/Accounts/updateAccount'
import deleteAccount from './slices/Accounts/deleteAccount'
import getTransactions from './slices/Transactions/getTransactions'
import createTransaction from './slices/Transactions/createTransactions'
import updateTransaction from './slices/Transactions/updateTransaction'
import deleteTransaction from './slices/Transactions/deleteTransaction'
import getCategories from './slices/Categories/getCategories'
import createCategory from './slices/Categories/createCategory'
import updateCategory from './slices/Categories/updateCategory'
import deleteCategory from './slices/Categories/deleteCategory'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const reducer = combineReducers({
  signin,
  signup,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
