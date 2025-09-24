import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import locationSlice from './slices/locationSlice';
import routeSlice from './slices/routeSlice';
import activitySlice from './slices/activitySlice';
import forumSlice from './slices/forumSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    location: locationSlice,
    route: routeSlice,
    activity: activitySlice,
    forum: forumSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;