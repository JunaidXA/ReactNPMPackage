import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import commonReducer from "./CommonSlice";
import venueReducer from "./VenueSlice";
import productReducer from "./ProductSlice";
import paymentReducer from "./PaymentSlice";
import chatReducer from "./ChatSlice";

import api from "./api";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
  whitelist: ["auth", "common"],
  blacklist: ["product"],
};

const reducers = combineReducers({
  auth: authReducer,
  common: commonReducer,
  venue: venueReducer,
  product: productReducer,
  payment: paymentReducer,
  chat: chatReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducers = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "mainApi/executeQuery/fulfilled",
        ],
        ignoredPaths: ["mainApi.queries"],
      },
    }).concat([api.middleware]);
  },
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
