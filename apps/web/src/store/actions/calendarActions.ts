import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { addEvent, deleteEvent, setEvents, updateEvent } from '../slices/calendarSlice';
import { CalendarEvent } from '../slices/calendarSlice';
import { offlineStorage } from '@/lib/offlineStorage';
import { addNotification } from '../slices/uiSlice';
import { isOnline, registerBackgroundSync } from '@/utils/serviceWorker';

/**
 * Fetch calendar events from storage and API
 */
export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async ({
    startDate,
    endDate,
    forceRefresh = false
  }: { 
    startDate: Date;
    endDate: Date;
    forceRefresh?: boolean;
  }, { dispatch, rejectWithValue }) => {
    try {
      // First try to get events from IndexedDB
      const storedEvents = await offlineStorage.getAll<CalendarEvent>('events');
      
      // If we have stored events and don't need to refresh, return them
      if (storedEvents.length > 0 && !forceRefresh) {
        // Filter events by date range
        const filteredEvents = storedEvents.filter(event => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return (
            (eventStart >= startDate && eventStart <= endDate) ||
            (eventEnd >= startDate && eventEnd <= endDate) ||
            (eventStart <= startDate && eventEnd >= endDate)
          );
        });
        
        dispatch(setEvents(filteredEvents));
        
        // If we're offline, just return what we have
        if (!isOnline()) {
          dispatch(addNotification({
            type: 'info',
            message: 'You are offline. Showing cached events.',
            autoHide: true,
          }));
          return filteredEvents;
        }
      }
      
      // If we need fresh data and we're online, fetch from API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
        const apiEvents: CalendarEvent[] = [];
        
        // If we got events from the API, store them in IndexedDB
        if (apiEvents.length > 0) {
          for (const event of apiEvents) {
            await offlineStorage.set('events', event.id, event, { syncStatus: 'synced' });
          }
        }
        
        // Return the API events
        dispatch(setEvents(apiEvents));
        return apiEvents;
      }
      
      // If we're offline and have no stored events, return an empty array
      dispatch(setEvents([]));
      dispatch(addNotification({
        type: 'warning',
        message: 'You are offline. Unable to fetch events.',
        autoHide: true,
      }));
      return [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to fetch calendar events.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch events');
    }
  }
);

/**
 * Create a new calendar event
 */
export const createCalendarEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData: Omit<CalendarEvent, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: uuidv4(),
      };
      
      // Store in IndexedDB
      await offlineStorage.set('events', newEvent.id, newEvent, { syncStatus: 'pending' });
      
      // Add to Redux state
      dispatch(addEvent(newEvent));
      
      // If online, sync to API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
        
        // Mark as synced in IndexedDB
        await offlineStorage.set('events', newEvent.id, newEvent, { syncStatus: 'synced' });
      } else {
        // If offline, register for background sync
        await registerBackgroundSync('sync-events');
        
        dispatch(addNotification({
          type: 'info',
          message: 'Event created offline. It will sync when you reconnect.',
          autoHide: true,
        }));
      }
      
      return newEvent;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create event.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create event');
    }
  }
);

/**
 * Update an existing calendar event
 */
export const updateCalendarEvent = createAsyncThunk(
  'calendar/updateEvent',
  async (eventData: CalendarEvent, { dispatch, rejectWithValue }) => {
    try {
      // Store in IndexedDB
      await offlineStorage.set('events', eventData.id, eventData, { syncStatus: 'pending' });
      
      // Update Redux state
      dispatch(updateEvent(eventData));
      
      // If online, sync to API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
        
        // Mark as synced in IndexedDB
        await offlineStorage.set('events', eventData.id, eventData, { syncStatus: 'synced' });
      } else {
        // If offline, register for background sync
        await registerBackgroundSync('sync-events');
        
        dispatch(addNotification({
          type: 'info',
          message: 'Event updated offline. It will sync when you reconnect.',
          autoHide: true,
        }));
      }
      
      return eventData;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update event.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update event');
    }
  }
);

/**
 * Delete a calendar event
 */
export const deleteCalendarEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (eventId: string, { dispatch, rejectWithValue }) => {
    try {
      // Delete from IndexedDB
      await offlineStorage.delete('events', eventId);
      
      // Update Redux state
      dispatch(deleteEvent(eventId));
      
      // If online, sync to API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
      } else {
        // If offline, register for background sync
        await registerBackgroundSync('sync-events');
        
        dispatch(addNotification({
          type: 'info',
          message: 'Event deleted offline. It will sync when you reconnect.',
          autoHide: true,
        }));
      }
      
      return eventId;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete event.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete event');
    }
  }
); 