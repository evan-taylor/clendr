'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, CalendarContextType, ViewType } from './types';
import React from 'react';

// Extend the context type to include edit state and setEvents
interface ExtendedCalendarContextType extends CalendarContextType {
  isEditing: boolean;
  eventToEdit: CalendarEvent | null;
  startEditing: (event: CalendarEvent) => void;
  stopEditing: () => void;
  setEvents: (events: CalendarEvent[]) => void;
}

const CalendarContext = createContext<ExtendedCalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

type CalendarProviderProps = {
  children: ReactNode;
  initialEvents?: CalendarEvent[];
  initialView?: ViewType;
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
};

export const CalendarProvider = ({ 
  children, 
  initialEvents = [], 
  initialView = 'month',
  initialDate = new Date(),
  onDateChange
}: CalendarProviderProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [view, setView] = useState<ViewType>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [mounted, setMounted] = useState(false);
  const lastNotifiedDateRef = React.useRef<string>(initialDate.toISOString());

  // State for event editing modal
  const [isEditing, setIsEditing] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  // On mount, check localStorage for saved view preference
  useEffect(() => {
    // This ensures the code only runs on the client side
    setMounted(true);
    try {
      const savedView = localStorage.getItem('preferredView');
      if (savedView && ['month', 'week', 'day'].includes(savedView)) {
        setView(savedView as ViewType);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Save view preference to localStorage when it changes
  useEffect(() => {
    if (!mounted) return;
    
    try {
      localStorage.setItem('preferredView', view);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [view, mounted]);

  // Notify parent when currentDate changes
  useEffect(() => {
    if (onDateChange) {
      // Get current date string for comparison
      const dateString = currentDate.toISOString();
      
      // Only notify if the date actually changed
      if (lastNotifiedDateRef.current !== dateString) {
        lastNotifiedDateRef.current = dateString;
        onDateChange(currentDate);
      }
    }
  }, [currentDate, onDateChange]);

  // Update events when initialEvents changes, but avoid unnecessary rerenders
  useEffect(() => {
    // Only set events if they're different from current events
    if (initialEvents.length > 0) {
      // Only set events if they're different from current events
      // by comparing JSON strings (simple but effective for this use case)
      const currentEventsJSON = JSON.stringify(events.map(e => e.id).sort());
      const newEventsJSON = JSON.stringify(initialEvents.map(e => e.id).sort());
      
      if (currentEventsJSON !== newEventsJSON) {
        setEvents(initialEvents);
      }
    }
  }, [initialEvents]);

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...eventData,
      id: uuidv4(),
    };
    setEvents([...events, newEvent]);
    return newEvent.id;
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    stopEditing(); // Close modal on successful update
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Functions to control editing state
  const startEditing = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsEditing(true);
  };

  const stopEditing = () => {
    setEventToEdit(null);
    setIsEditing(false);
  };

  const value: ExtendedCalendarContextType = {
    events,
    view,
    currentDate,
    setView,
    setCurrentDate,
    addEvent,
    updateEvent,
    deleteEvent,
    // Add editing state and functions to context value
    isEditing,
    eventToEdit,
    startEditing,
    stopEditing,
    setEvents,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}; 