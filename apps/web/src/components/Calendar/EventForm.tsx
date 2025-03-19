'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { XIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getUserCalendars, createCalendarEvent, updateCalendarEvent } from '@/lib/googleCalendar';
import { CalendarEvent } from '@/store/slices/calendarSlice';
import { format, parseISO, addHours } from 'date-fns';
import { CalendarEvent as GoogleCalendarEvent } from '@/components/Calendar/types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Partial<CalendarEvent>;
  selectedDate?: Date;
  onSuccess?: () => void;
}

export default function EventForm({ isOpen, onClose, event, selectedDate, onSuccess }: EventFormProps) {
  const { user, session } = useAuth();
  const [calendars, setCalendars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [formState, setFormState] = useState({
    calendarId: '',
    summary: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  // Memoize derived event defaults
  const eventDefaults = useMemo(() => {
    if (event?.id) {
      // Edit existing event
      const startDateTime = event.startDate ? new Date(event.startDate) : new Date();
      const endDateTime = event.endDate ? new Date(event.endDate) : addHours(startDateTime, 1);
      
      return {
        calendarId: event.calendarId || '',
        summary: event.title || '',
        description: event.description || '',
        location: event.location || '',
        startDate: format(startDateTime, 'yyyy-MM-dd'),
        startTime: format(startDateTime, 'HH:mm'),
        endDate: format(endDateTime, 'yyyy-MM-dd'),
        endTime: format(endDateTime, 'HH:mm'),
      };
    } else {
      // Create new event
      const start = selectedDate || new Date();
      const end = addHours(start, 1);
      
      return {
        calendarId: '',
        summary: '',
        description: '',
        location: '',
        startDate: format(start, 'yyyy-MM-dd'),
        startTime: format(start, 'HH:mm'),
        endDate: format(end, 'yyyy-MM-dd'),
        endTime: format(end, 'HH:mm'),
      };
    }
  }, [event, selectedDate]);

  // Load user calendars
  useEffect(() => {
    if (isOpen && user?.id) {
      loadUserCalendars();
    }
  }, [isOpen, user?.id]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormState(eventDefaults);
      setFormError(null);
    }
  }, [isOpen, eventDefaults]);

  // Set default calendar when calendars are loaded
  useEffect(() => {
    if (calendars.length > 0 && !formState.calendarId) {
      // Find the calendar associated with this event or use the first available one
      let defaultCalendarId = calendars[0].calendar_id;
      
      // If editing an event, try to match it with the right calendar
      if (event?.id) {
        // This would require additional data fetching to get the calendar ID for the event
        // Ideally done through an API call that gives us event details with the calendar ID
      }
      
      setFormState(prev => ({
        ...prev,
        calendarId: defaultCalendarId
      }));
    }
  }, [calendars, formState.calendarId, event?.id]);

  // Memoized input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handler for loading user calendars
  const loadUserCalendars = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const userCalendars = await getUserCalendars(user.id);
      setCalendars(userCalendars);
    } catch (error) {
      console.error("Error loading user calendars:", error);
      setFormError("Failed to load calendars. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Handler for form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !session?.provider_token) {
      setFormError("You must be signed in to create events");
      return;
    }
    
    if (!formState.calendarId) {
      setFormError("Please select a calendar");
      return;
    }
    
    if (!formState.summary) {
      setFormError("Event title is required");
      return;
    }
    
    try {
      setIsSaving(true);
      setFormError(null);
      
      // Prepare event data
      const startDateTime = `${formState.startDate}T${formState.startTime}:00`;
      const endDateTime = `${formState.endDate}T${formState.endTime}:00`;
      
      // Create event data for Google Calendar API
      const googleEventData: GoogleCalendarEvent = {
        id: event?.id || '',
        title: formState.summary,
        summary: formState.summary,
        description: formState.description,
        location: formState.location,
        start_time: startDateTime,
        end_time: endDateTime,
        start: {
          dateTime: startDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      if (event?.id) {
        // Update existing event
        await updateCalendarEvent(
          user.id,
          formState.calendarId,
          event.id,
          googleEventData
        );
      } else {
        // Create new event
        await createCalendarEvent(
          user.id,
          formState.calendarId,
          googleEventData
        );
      }
      
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving event:", error);
      setFormError("Failed to save event. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formState, event?.id, user?.id, session?.provider_token, onClose, onSuccess]);

  // Memoized loaded state check
  const isCalendarsLoaded = useMemo(() => 
    !isLoading && calendars.length > 0, 
    [isLoading, calendars.length]
  );

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" aria-hidden="true" />
      
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {event?.id ? 'Edit Event' : 'Create Event'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            {isLoading ? (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : calendars.length === 0 ? (
              <div className="mt-4 text-center py-4">
                <p className="text-gray-600 dark:text-gray-400">
                  You don't have any calendars connected.
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg"
                  onClick={loadUserCalendars}
                >
                  Reload Calendars
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {formError && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                    {formError}
                  </div>
                )}
                
                {/* Calendar Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Calendar
                  </label>
                  <select
                    name="calendarId"
                    value={formState.calendarId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="" disabled>Select a calendar</option>
                    {calendars.map(cal => (
                      <option key={cal.id} value={cal.calendar_id}>
                        {cal.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="summary"
                    value={formState.summary}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add title"
                    required
                  />
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add location"
                  />
                </div>
                
                {/* Start Date/Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formState.startDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formState.startTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                
                {/* End Date/Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formState.endDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formState.endTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add description"
                  />
                </div>
                
                {/* Form Actions */}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : event?.id ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
} 