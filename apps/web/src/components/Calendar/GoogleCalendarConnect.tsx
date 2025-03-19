'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { 
  fetchUserCalendars, 
  addCalendarToUser, 
  GoogleCalendar 
} from '@/lib/googleCalendar';

interface GoogleCalendarConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GoogleCalendarConnect({ 
  isOpen, 
  onClose, 
  onSuccess 
}: GoogleCalendarConnectProps) {
  const { user, session, signInWithGoogle, refreshSession } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'fetching' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    if (isOpen && session?.provider_token) {
      fetchCalendars();
    } else {
      // Reset state when dialog is closed
      if (!isOpen) {
        setStatus('idle');
        setCalendars([]);
        setSelectedCalendars([]);
        setErrorMessage('');
      }
    }
  }, [isOpen, session?.provider_token]);
  
  // Reset status when auth changes
  useEffect(() => {
    if (session?.provider_token && status === 'connecting') {
      setStatus('idle');
    }
  }, [session?.provider_token, status]);
  
  async function fetchCalendars() {
    try {
      if (!session?.provider_token) {
        throw new Error('No Google auth token available');
      }
      
      setStatus('fetching');
      const fetchedCalendars = await fetchUserCalendars(session.provider_token);
      
      setCalendars(fetchedCalendars);
      
      // Pre-select primary calendar
      const primaryCalendar = fetchedCalendars.find(cal => cal.primary);
      if (primaryCalendar) {
        setSelectedCalendars([primaryCalendar.id]);
      }
      
      setStatus('idle');
    } catch (error) {
      console.error('Error fetching calendars:', error);
      setErrorMessage('Failed to fetch your Google Calendars. Please try again.');
      setStatus('error');
    }
  }
  
  async function connectGoogleCalendar() {
    try {
      setStatus('connecting');
      await signInWithGoogle();
      // The rest of the flow will continue after redirect and auth callback
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setErrorMessage('Failed to connect to Google Calendar. Please try again.');
      setStatus('error');
    }
  }
  
  async function saveSelectedCalendars() {
    if (!user?.id || !session?.provider_token || !session.provider_refresh_token) {
      setErrorMessage('Missing authentication information. Please try signing in again.');
      setStatus('error');
      return;
    }
    
    try {
      setStatus('saving');
      
      // Create an expiry date for the token (typically 1 hour from now)
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 1);
      
      // Save each selected calendar
      await Promise.all(
        selectedCalendars.map(async (calendarId) => {
          const calendar = calendars.find(c => c.id === calendarId);
          if (calendar) {
            await addCalendarToUser(
              user.id,
              calendar,
              session.provider_token!,
              session.provider_refresh_token!,
              tokenExpiry
            );
          }
        })
      );
      
      setStatus('success');
      
      // Notify parent of success after a short delay to show success state
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving calendars:', error);
      setErrorMessage('Failed to save selected calendars. Please try again.');
      setStatus('error');
    }
  }
  
  function toggleCalendarSelection(calendarId: string) {
    setSelectedCalendars(prev => {
      if (prev.includes(calendarId)) {
        return prev.filter(id => id !== calendarId);
      } else {
        return [...prev, calendarId];
      }
    });
  }
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Connect Google Calendar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{errorMessage || 'An error occurred. Please try again.'}</p>
            </div>
          )}
          
          {!session?.provider_token ? (
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-neutral-200 mb-2">Connect your Google Calendar</h3>
              <p className="text-gray-600 dark:text-neutral-400 mb-4">
                Link your Google Calendar to see all your events in one place.
              </p>
              <button
                onClick={connectGoogleCalendar}
                disabled={status === 'connecting'}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
              >
                {status === 'connecting' ? (
                  <span className="flex items-center justify-center">
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  'Connect to Google Calendar'
                )}
              </button>
            </div>
          ) : calendars.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin mr-3" />
              <span className="text-gray-600 dark:text-neutral-400">Fetching your calendars...</span>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-neutral-400 mb-4">
                Select the calendars you would like to connect to Clendr:
              </p>
              
              <div className="max-h-64 overflow-y-auto mb-4 space-y-2 border border-gray-200 dark:border-neutral-800 rounded-md p-2">
                {calendars.map(calendar => (
                  <div key={calendar.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`calendar-${calendar.id}`}
                      checked={selectedCalendars.includes(calendar.id)}
                      onChange={() => toggleCalendarSelection(calendar.id)}
                      className="h-4 w-4 mr-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`calendar-${calendar.id}`}
                      className="flex-1 flex items-center py-2 cursor-pointer"
                    >
                      <span 
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                      ></span>
                      <span className="text-gray-800 dark:text-neutral-200 font-medium">
                        {calendar.summary}
                        {calendar.primary && <span className="ml-1 text-xs font-normal text-gray-500 dark:text-neutral-500">(Primary)</span>}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md mr-2 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSelectedCalendars}
                  disabled={status === 'saving' || status === 'success' || selectedCalendars.length === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-medium rounded-md transition-colors flex items-center"
                >
                  {status === 'saving' ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : status === 'success' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    'Save Calendars'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 