import { configureStore } from '@reduxjs/toolkit';
import { appSliceReducer } from './App/slices';

export const reduxStore = configureStore({
  reducer: {
    app: appSliceReducer,
  },
});

export type ReduxStoreDispatch = typeof reduxStore.dispatch;
export type ReduxStoreState = ReturnType<typeof reduxStore.getState>;
