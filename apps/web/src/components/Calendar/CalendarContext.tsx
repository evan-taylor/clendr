'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, CalendarContextType, ViewType } from './types';

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
};

export const CalendarProvider = ({ 
  children, 
  initialEvents = [], 
  initialView = 'month',
  initialDate = new Date()
}: CalendarProviderProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [view, setView] = useState<ViewType>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

  // Update events when initialEvents changes
  useEffect(() => {
    setEvents(initialEvents);
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