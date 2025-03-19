'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Settings, 
  Plus, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getUserCalendars, updateUserCalendar, UserCalendar } from '@/lib/googleCalendar';
import GoogleCalendarConnect from '../Calendar/GoogleCalendarConnect';
import OfflineIndicator from './OfflineIndicator';

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export default function Sidebar({ className = '', collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [calendars, setCalendars] = useState<UserCalendar[]>([]);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<string | null>(null);

  // Standard calendar colors
  const colorOptions = [
    '#4285F4', // Blue
    '#A4BDFC', // Light Blue
    '#7AE7BF', // Turquoise
    '#51B749', // Green
    '#FBD75B', // Yellow
    '#FFB878', // Orange
    '#FF887C', // Red
    '#DC2127', // Dark Red
    '#DBADFF', // Purple
    '#E1E1E1', // Gray
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserCalendars();
    }
  }, [user?.id]);

  const loadUserCalendars = async () => {
    try {
      if (!user?.id) return;
      const userCalendars = await getUserCalendars(user.id);
      setCalendars(userCalendars);
    } catch (error) {
      console.error('Error loading calendars:', error);
    }
  };

  const toggleCalendarVisibility = async (calendarId: string, isCurrentlyVisible: boolean) => {
    try {
      const updated = await updateUserCalendar(calendarId, {
        is_visible: !isCurrentlyVisible
      });
      
      if (updated) {
        setCalendars(prev => 
          prev.map(cal => cal.id === calendarId 
            ? { ...cal, is_visible: !cal.is_visible } 
            : cal
          )
        );
      }
    } catch (error) {
      console.error('Error toggling calendar visibility:', error);
    }
  };

  const changeCalendarColor = async (calendarId: string, color: string) => {
    try {
      const updated = await updateUserCalendar(calendarId, { color });
      
      if (updated) {
        setCalendars(prev => 
          prev.map(cal => cal.id === calendarId 
            ? { ...cal, color } 
            : cal
          )
        );
      }
      setIsColorPickerOpen(null);
    } catch (error) {
      console.error('Error changing calendar color:', error);
    }
  };

  const handleConnectCalendarSuccess = () => {
    loadUserCalendars();
    setIsConnectModalOpen(false);
  };

  return (
    <>
      <div 
        className={`h-screen bg-gray-50 dark:bg-neutral-900/90 border-r border-gray-200 dark:border-neutral-900 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-14' : 'w-60'
        } ${className}`}
      >
        {!collapsed && (
          <div className="px-3 py-4 border-b border-gray-100 dark:border-neutral-900">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
              <h2 className="text-sm font-medium text-gray-700 dark:text-neutral-300">Clendr</h2>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="p-4 flex justify-center border-b border-gray-100 dark:border-neutral-900">
            <Calendar className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
          </div>
        )}

        <nav className={`flex-1 p-2 space-y-1 overflow-y-auto ${collapsed ? 'items-center' : ''}`}>
          <Link href="/calendar" className={`flex items-center px-2 py-1.5 rounded-md ${
            collapsed ? 'justify-center' : ''
          } ${
            pathname === '/calendar' 
              ? 'bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-neutral-100' 
              : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-100'
          }`}>
            <Calendar size={16} className={collapsed ? '' : 'mr-2'} />
            {!collapsed && <span className="text-sm">Calendar</span>}
          </Link>
          
          {!collapsed && (
            <div className="mt-4">
              <div 
                className="flex items-center justify-between px-2 py-1.5 cursor-pointer text-gray-700 dark:text-neutral-400"
                onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
              >
                <span className="text-xs font-medium uppercase tracking-wider">Calendars</span>
                {calendarMenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
              
              {calendarMenuOpen && (
                <div className="ml-2 mt-1 space-y-0.5">
                  {!user ? (
                    <p className="text-xs text-gray-500 dark:text-neutral-500 px-2 py-1.5">
                      Sign in to connect calendars
                    </p>
                  ) : calendars.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-neutral-500 px-2 py-1.5">
                      No calendars connected yet.
                    </p>
                  ) : (
                    calendars.map(calendar => (
                      <div key={calendar.id} className="flex items-center px-2 py-1.5 text-xs rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 group">
                        <div 
                          className="flex-shrink-0 w-2.5 h-2.5 rounded-full mr-2 cursor-pointer"
                          style={{ backgroundColor: calendar.color }}
                          onClick={() => setIsColorPickerOpen(isColorPickerOpen === calendar.id ? null : calendar.id)}
                        />
                        <span className="flex-1 truncate text-gray-700 dark:text-neutral-300">{calendar.name}</span>
                        <button 
                          onClick={() => toggleCalendarVisibility(calendar.id, calendar.is_visible)}
                          className="ml-1 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {calendar.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        {/* Color picker popup */}
                        {isColorPickerOpen === calendar.id && (
                          <div className="absolute z-10 mt-2 ml-6 p-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800 grid grid-cols-5 gap-1">
                            {colorOptions.map(color => (
                              <div 
                                key={color} 
                                className="w-4 h-4 rounded-full cursor-pointer"
                                style={{ backgroundColor: color }}
                                onClick={() => changeCalendarColor(calendar.id, color)}
                              />
                            ))}
                            <button 
                              onClick={() => setIsColorPickerOpen(null)}
                              className="absolute -top-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5 border border-gray-200 dark:border-neutral-800"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  
                  <button 
                    onClick={() => setIsConnectModalOpen(true)}
                    className="flex items-center w-full px-2 py-1.5 text-xs rounded-md text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <Plus size={14} className="mr-1" />
                    Connect Calendar
                  </button>
                </div>
              )}
            </div>
          )}

          {collapsed && (
            <div className="pt-3 pb-2 flex flex-col items-center space-y-3">
              <button 
                className="flex items-center justify-center p-1.5 cursor-pointer text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md"
                onClick={() => setIsConnectModalOpen(true)}
                title="Connect Calendar"
              >
                <Plus size={16} />
              </button>
              
              {calendars.length > 0 && (
                <div className="flex flex-col items-center space-y-2">
                  {calendars.slice(0, 3).map(calendar => (
                    <div 
                      key={calendar.id}
                      className="w-5 h-5 rounded-full cursor-pointer flex items-center justify-center relative"
                      style={{ backgroundColor: calendar.color }}
                      title={calendar.name}
                      onClick={() => toggleCalendarVisibility(calendar.id, calendar.is_visible)}
                    >
                      {!calendar.is_visible && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-40 rounded-full flex items-center justify-center">
                          <EyeOff size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {calendars.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-xs text-gray-500 dark:text-neutral-400">
                      +{calendars.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </nav>

        <div className={`p-2 border-t border-gray-100 dark:border-neutral-900 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          <OfflineIndicator collapsed={collapsed} />
          <Link href="/settings" className={`flex items-center rounded-md ${
            collapsed ? 'justify-center p-1.5' : 'px-2 py-1.5'
          } ${
            pathname === '/settings' 
              ? 'bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-neutral-100' 
              : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-100'
          }`}>
            <Settings size={16} className={collapsed ? '' : 'mr-2'} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </Link>
        </div>
      </div>

      {/* Google Calendar Connect Modal */}
      <GoogleCalendarConnect 
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onSuccess={handleConnectCalendarSuccess}
      />
    </>
  );
} 