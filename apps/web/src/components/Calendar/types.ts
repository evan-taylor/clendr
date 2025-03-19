'use client';

export type ViewType = 'month' | 'week' | 'day';

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface CalendarEvent {
  id: string;
  title?: string;
  summary?: string; // Google Calendar uses summary
  description?: string;
  location?: string;
  start_time: string | Date;
  end_time: string | Date;
  is_all_day?: boolean;
  color?: string;
  calendar?: {
    id: string;
    name: string;
    color: string;
  };
  // Google Calendar specific fields
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  colorId?: string; // Google Calendar color ID
  created?: string;
  updated?: string;
  creator?: {
    email?: string;
    displayName?: string;
  };
  organizer?: {
    email?: string;
    displayName?: string;
  };
  status?: string; // confirmed, tentative, cancelled
}

export interface CalendarContextType {
  events: CalendarEvent[];
  view: ViewType;
  currentDate: Date;
  setView: (view: ViewType) => void;
  setCurrentDate: (date: Date) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => string;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
}

export type RecurrenceRule = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  end_date?: string;
  count?: number;
  days_of_week?: number[];
  days_of_month?: number[];
  months_of_year?: number[];
};

export type EventFormData = Omit<CalendarEvent, 'id'> & { id?: string }; 