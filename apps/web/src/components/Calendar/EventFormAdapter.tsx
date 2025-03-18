'use client';

import { useState, useEffect } from 'react';
import { useCalendar } from './CalendarContext';
import OriginalEventForm from './UI/EventForm';
import { EventFormData } from './types';
import { parseISO } from 'date-fns';

type EventFormAdapterProps = {
  isOpen: boolean;
  onClose: () => void;
  event?: any; // Google Calendar event format
  selectedDate?: Date;
  onSuccess?: () => void;
};

// This adapter component bridges the gap between the Google Calendar EventForm and the local calendar context
export default function EventFormAdapter({ isOpen, onClose, event, selectedDate, onSuccess }: EventFormAdapterProps) {
  // Only render if the form is open
  if (!isOpen) return null;
  
  // Convert Google Calendar event to local event format if available
  let initialData: EventFormData | undefined;
  
  if (event?.id) {
    const startTime = event.start?.dateTime ? event.start.dateTime : new Date().toISOString();
    const endTime = event.end?.dateTime ? event.end.dateTime : new Date().toISOString();
    
    initialData = {
      id: event.id,
      title: event.summary || '',
      description: event.description || '',
      location: event.location || '',
      start_time: startTime,
      end_time: endTime,
      is_all_day: false,
      color: '#4285f4', // Default blue
    };
  }
  
  const handleClose = () => {
    onClose();
    if (onSuccess) onSuccess();
  };
  
  // Render the UI EventForm with converted data
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <OriginalEventForm
        initialData={initialData}
        selectedDate={selectedDate}
        onClose={handleClose}
      />
    </div>
  );
} 