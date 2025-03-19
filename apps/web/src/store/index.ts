import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers (will add these in subsequent steps)
import calendarReducer from './slices/calendarSlice';
import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    tasks: tasksReducer,
    ui: uiReducer,
  },
  // Adding middleware for development tools
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date objects in our state which might cause serialization warnings
        ignoredActionPaths: ['payload.date', 'payload.startDate', 'payload.endDate'],
        ignoredPaths: [
          'calendar.events.*.startDate',
          'calendar.events.*.endDate',
          'calendar.selectedDate',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional listener setup for RTK Query (will be useful if we add API endpoints later)
setupListeners(store.dispatch);

// Export types for typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 