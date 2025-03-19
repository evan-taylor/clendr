import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

// Define types for our calendar state
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  calendarId: string;
  color?: string;
  location?: string;
  recurring?: boolean;
  recurrenceRule?: string;
}

type ViewType = 'month' | 'week' | 'day';

interface CalendarState {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[]; // For search/filter functionality
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  view: ViewType;
  calendars: Array<{ id: string; name: string; color: string; visible: boolean }>;
  isLoading: boolean;
  error: string | null;
  lastSynced: string | null; // Timestamp of last sync for offline support
}

// Initial state
const initialState: CalendarState = {
  events: [],
  filteredEvents: [],
  selectedDate: new Date(),
  selectedEvent: null,
  view: 'month',
  calendars: [],
  isLoading: false,
  error: null,
  lastSynced: null,
};

// Async thunk for fetching events
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async ({ startDate, endDate }: { startDate: Date; endDate: Date }, { rejectWithValue }) => {
    try {
      // For now, just mocking the response
      // In a real implementation, this would fetch from the API or IndexedDB
      return [] as CalendarEvent[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch events');
    }
  }
);

// Create the calendar slice
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.events = action.payload;
      state.filteredEvents = action.payload;
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
      state.filteredEvents = state.events;
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      state.filteredEvents = state.events;
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      state.filteredEvents = state.events;
    },
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<CalendarEvent | null>) => {
      state.selectedEvent = action.payload;
    },
    setView: (state, action: PayloadAction<ViewType>) => {
      state.view = action.payload;
    },
    setCalendars: (state, action: PayloadAction<Array<{ id: string; name: string; color: string; visible: boolean }>>) => {
      state.calendars = action.payload;
    },
    toggleCalendarVisibility: (state, action: PayloadAction<string>) => {
      const calendar = state.calendars.find(cal => cal.id === action.payload);
      if (calendar) {
        calendar.visible = !calendar.visible;
      }
      
      // Update filtered events based on visible calendars
      const visibleCalendarIds = state.calendars.filter(cal => cal.visible).map(cal => cal.id);
      state.filteredEvents = state.events.filter(event => visibleCalendarIds.includes(event.calendarId));
    },
    filterEvents: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      const visibleCalendarIds = state.calendars.filter(cal => cal.visible).map(cal => cal.id);
      
      state.filteredEvents = searchTerm 
        ? state.events.filter(event => 
            visibleCalendarIds.includes(event.calendarId) && 
            (event.title.toLowerCase().includes(searchTerm) || 
            (event.description?.toLowerCase().includes(searchTerm) || false))
          )
        : state.events.filter(event => visibleCalendarIds.includes(event.calendarId));
    },
    setLastSynced: (state) => {
      state.lastSynced = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.filteredEvents = action.payload;
        state.isLoading = false;
        state.lastSynced = new Date().toISOString();
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedDate,
  setSelectedEvent,
  setView,
  setCalendars,
  toggleCalendarVisibility,
  filterEvents,
  setLastSynced,
} = calendarSlice.actions;

export default calendarSlice.reducer; 