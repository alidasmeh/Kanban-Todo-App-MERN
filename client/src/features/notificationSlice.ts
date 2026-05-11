import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotificationState, NotificationType } from '../types';

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type: NotificationType }>
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.notifications.push({
        id,
        message: action.payload.message,
        type: action.payload.type,
      });
    },
    hideNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
