'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader, Calendar } from 'lucide-react';
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
  const { user, session } = useAuth();
  const [availableCalendars, setAvailableCalendars] = useState<GoogleCalendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && session?.provider_token) {
      loadAvailableCalendars();
    }
  }, [isOpen, session?.provider_token]);

  const loadAvailableCalendars = async () => {
    if (!session?.provider_token) {
      setError('No access token found. Please try signing in again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const calendars = await fetchUserCalendars(session.provider_token);
      setAvailableCalendars(calendars);
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError('Failed to load your Google Calendars. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCalendarSelection = (calendarId: string) => {
    setSelectedCalendars(prev => 
      prev.includes(calendarId)
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  const handleConnect = async () => {
    if (!user?.id || !session?.provider_token || !session?.provider_refresh_token) {
      setError('Authentication error. Please try signing in again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get the selected calendars
      const calendarsToConnect = availableCalendars.filter(cal => 
        selectedCalendars.includes(cal.id)
      );

      // Calculate token expiry (usually 1 hour from now)
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 1);

      // Add each selected calendar
      for (const calendar of calendarsToConnect) {
        await addCalendarToUser(
          user.id,
          calendar,
          session.provider_token,
          session.provider_refresh_token,
          tokenExpiry
        );
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Error connecting calendars:', err);
      setError('Failed to connect calendars. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Connect Google Calendars
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader size={32} className="animate-spin text-primary-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your calendars...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4 flex items-center">
              <Check size={20} className="mr-2" />
              Calendars connected successfully!
            </div>
          )}

          {!isLoading && !success && (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select the calendars you want to connect to Clendr. You can change these settings later.
              </p>

              <div className="max-h-60 overflow-y-auto my-4 space-y-2">
                {availableCalendars.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-500 text-center py-4">
                    No calendars found in your Google account.
                  </p>
                ) : (
                  availableCalendars.map(calendar => (
                    <div 
                      key={calendar.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer border ${
                        selectedCalendars.includes(calendar.id)
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => toggleCalendarSelection(calendar.id)}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {calendar.summary}
                        </h3>
                        {calendar.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {calendar.description}
                          </p>
                        )}
                      </div>
                      {selectedCalendars.includes(calendar.id) && (
                        <Check size={20} className="text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            Cancel
          </button>
          {!success && (
            <button
              onClick={handleConnect}
              disabled={selectedCalendars.length === 0 || isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                selectedCalendars.length === 0 || isLoading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin inline-block mr-2" />
                  Connecting...
                </>
              ) : (
                'Connect Calendars'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 