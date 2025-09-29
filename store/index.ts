import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import photoReducer from './photoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    photo: photoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
