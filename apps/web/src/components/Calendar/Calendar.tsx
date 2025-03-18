'use client';

import { useState, useEffect } from 'react';
import { 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  addDays, 
  subDays, 
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { CalendarProvider, useCalendar } from './CalendarContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import { ViewType } from './types';
import { cn } from '../../utils/cn';
import { useTheme } from 'next-themes';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, ChevronsLeft, ChevronsRight, Moon, Sun } from 'lucide-react';
import Sidebar from '../Navigation/Sidebar';
import { useAuth } from '@/lib/auth';
import { getUserCalendars, fetchCalendarEvents, CalendarEvent } from '@/lib/googleCalendar';

type CalendarProps = {
  initialEvents?: any[];
  initialView?: ViewType;
  initialDate?: Date;
  onEventChange?: (events: any[]) => void;
};

function AppHeader({ sidebarCollapsed, toggleSidebar }: { sidebarCollapsed: boolean; toggleSidebar: () => void }) {
  const { view, setView, currentDate, setCurrentDate } = useCalendar();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navigatePrevious = () => {
    switch (view) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };
  
  const navigateNext = () => {
    switch (view) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? 
            <ChevronsRight size={18} className="text-gray-500 dark:text-gray-400" /> : 
            <ChevronsLeft size={18} className="text-gray-500 dark:text-gray-400" />
          }
        </button>
        
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={goToToday}
          >
            Today
          </button>
          
          <div className="flex">
            <button
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
              onClick={navigatePrevious}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            <button
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800 ml-px"
              onClick={navigateNext}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <h2 className="ml-2 text-base font-medium text-gray-700 dark:text-gray-300">
            {view === 'month' && format(currentDate, 'MMMM yyyy')}
            {view === 'week' && `${format(currentDate, 'MMM d')} - ${format(addDays(currentDate, 6), 'MMM d, yyyy')}`}
            {view === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-0.5">
          <button
            onClick={() => setView('day')}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              view === 'day' 
                ? "bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            )}
          >
            Day
          </button>
          <button
            onClick={() => setView('week')}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              view === 'week' 
                ? "bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            )}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              view === 'month' 
                ? "bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            )}
          >
            Month
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {mounted && theme === 'light' ? (
            <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        <div className="relative">
          <button 
            className="h-8 w-8 rounded-full bg-gray-800 dark:bg-gray-700 text-white flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <span className="text-xs font-medium">ET</span>
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-800">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Settings
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Help & Feedback
              </button>
              <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarContent() {
  const { view } = useCalendar();
  
  return (
    <div className="flex-1 overflow-auto">
      {view === 'month' && <MonthView />}
      {view === 'week' && <WeekView />}
      {view === 'day' && <DayView />}
    </div>
  );
}

function CreateButton() {
  const [showEventForm, setShowEventForm] = useState(false);
  const { events } = useCalendar();
  
  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full p-3 flex items-center justify-center transition-colors"
        aria-label="Create event"
        onClick={() => setShowEventForm(true)}
      >
        <Plus className="h-5 w-5" />
      </button>
    </>
  );
}

export default function Calendar({ 
  initialEvents = [], 
  initialView = 'month',
  initialDate = new Date(),
  onEventChange
}: CalendarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, session } = useAuth();
  const [calendars, setCalendars] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Load user calendars on mount
  useEffect(() => {
    async function loadUserCalendars() {
      try {
        if (!user?.id) return;
        console.log('Loading user calendars for user:', user.id);
        const userCalendars = await getUserCalendars(user.id);
        console.log('Retrieved user calendars:', userCalendars);
        setCalendars(userCalendars);
      } catch (error) {
        console.error('Error loading calendars:', error);
      }
    }
    
    if (user?.id) {
      loadUserCalendars();
    }
  }, [user?.id]);
  
  // Load calendar events when date changes
  useEffect(() => {
    async function loadCalendarEvents() {
      if (!session?.provider_token || calendars.length === 0) {
        console.log('Cannot load events - no provider token or calendars', {
          hasToken: !!session?.provider_token,
          calendarsCount: calendars.length
        });
        return;
      }
      
      setIsLoadingEvents(true);
      const start = startOfMonth(initialDate);
      const end = endOfMonth(initialDate);
      console.log('Fetching events from', start, 'to', end);
      
      try {
        const allEvents: CalendarEvent[] = [];
        
        // Only fetch events for visible calendars
        const visibleCalendars = calendars.filter(cal => cal.is_visible);
        console.log('Visible calendars:', visibleCalendars);
        
        await Promise.all(
          visibleCalendars.map(async (calendar) => {
            try {
              console.log('Fetching events for calendar:', calendar.name, calendar.calendar_id);
              const calendarEvents = await fetchCalendarEvents(
                calendar.calendar_id,
                session.provider_token!,
                start,
                end
              );
              console.log(`Retrieved ${calendarEvents.length} events for calendar ${calendar.name}`);
              
              // Add calendar info to each event
              const eventsWithCalendar = calendarEvents.map(event => ({
                ...event,
                calendar: {
                  id: calendar.id,
                  name: calendar.name,
                  color: calendar.color
                }
              }));
              
              allEvents.push(...eventsWithCalendar);
            } catch (err) {
              console.error(`Error fetching events for calendar ${calendar.name}:`, err);
            }
          })
        );
        
        console.log(`Total events loaded: ${allEvents.length}`);
        setEvents(allEvents);
        if (onEventChange) {
          onEventChange(allEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    }
    
    if (calendars.length > 0 && session?.provider_token) {
      loadCalendarEvents();
    }
  }, [calendars, initialDate, session?.provider_token, onEventChange]);
  
  return (
    <CalendarProvider initialEvents={events} initialView={initialView} initialDate={initialDate}>
      <div className="h-screen w-full flex bg-white dark:bg-gray-950">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
          <CalendarContent />
          <CreateButton />
        </div>
      </div>
    </CalendarProvider>
  );
} 