import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import boardReducer from '../features/boardSlice';
import notificationReducer from '../features/notificationSlice';
import teamReducer from '../features/teamSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
    notification: notificationReducer,
    teams: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
