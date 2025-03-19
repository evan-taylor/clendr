'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, CalendarContextType, ViewType } from './types';
import React from 'react';

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

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

  // Update events when initialEvents changes
  useEffect(() => {
    console.log('CalendarContext: initialEvents updated:', initialEvents);
    setEvents(initialEvents);
  }, [initialEvents]);

  // Debug events on every render
  useEffect(() => {
    console.log('CalendarContext: current events:', events);
  }, [events]);

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
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const value = {
    events,
    view,
    currentDate,
    setView,
    setCurrentDate,
    addEvent,
    updateEvent,
    deleteEvent,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}; 