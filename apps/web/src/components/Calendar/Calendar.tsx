'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths as dateAddMonths,
  setMonth,
  setDate
} from 'date-fns';
import { CalendarProvider, useCalendar } from './CalendarContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import { ViewType, CalendarEvent } from './types';
import { cn } from '../../utils/cn';
import { useTheme } from 'next-themes';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronsLeft, 
  ChevronsRight, 
  Moon, 
  Sun,
  MoreVertical,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import Sidebar from '../Navigation/Sidebar';
import { useAuth } from '@/lib/auth';
import { 
  fetchAllVisibleEvents,
  fetchEventsFromMultipleCalendars,
  getUserCalendars
} from '@/lib/googleCalendar';
import GoogleCalendarConnect from './GoogleCalendarConnect';
import CalendarSkeleton from './CalendarSkeleton';
import Image from 'next/image';

type CalendarProps = {
  initialView?: ViewType;
  initialDate?: Date;
  onEventChange?: (events: CalendarEvent[]) => void;
};

function AppHeader({ 
  sidebarCollapsed, 
  toggleSidebar, 
  onConnectCalendar,
  onSignOut
}: { 
  sidebarCollapsed: boolean; 
  toggleSidebar: () => void;
  onConnectCalendar?: () => void;
  onSignOut: () => void;
}) {
  const { view, setView, currentDate, setCurrentDate } = useCalendar();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside of the user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Track if component is mounted for theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const goBack = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };
  
  const goForward = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  // Determine logo based on theme
  const logoSrc = mounted && theme === 'dark' ? '/clendr-white.png' : '/clendr-black.png';

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-900 bg-white dark:bg-neutral-950">
      <div className="flex items-center">
        {mounted && (
          <div className="mr-4 flex items-center"> 
             <Image 
               src={logoSrc} 
               alt="Clendr Logo" 
               width={80}
               height={24}
               priority
             />
          </div>
        )}
        <div className="flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200 dark:border-neutral-900 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Today
          </button>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={goBack}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
            </button>
            <button
              onClick={goForward}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
            </button>
          </div>
          
          <h2 className="ml-2 text-base font-medium text-gray-700 dark:text-neutral-300">
            {view === 'month' && format(currentDate, 'MMMM yyyy')}
            {view === 'week' && `${format(currentDate, 'MMM d')} - ${format(addDays(currentDate, 6), 'MMM d, yyyy')}`}
            {view === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {onConnectCalendar && (
          <button
            onClick={onConnectCalendar}
            className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200 dark:border-neutral-900 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <CalendarIcon size={16} className="mr-1.5" />
            Connect Calendar
          </button>
        )}
        
        <div className="flex items-center bg-gray-50 dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-900 p-0.5">
          <button
            onClick={() => setView('day')}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              view === 'day' 
                ? "bg-white dark:bg-neutral-800 shadow-sm text-gray-800 dark:text-neutral-100" 
                : "text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-100"
            )}
          >
            Day
          </button>
          <button
            onClick={() => setView('week')}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              view === 'week' 
                ? "bg-white dark:bg-neutral-800 shadow-sm text-gray-800 dark:text-neutral-100" 
                : "text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-100"
            )}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              view === 'month' 
                ? "bg-white dark:bg-neutral-800 shadow-sm text-gray-800 dark:text-neutral-100" 
                : "text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-100"
            )}
          >
            Month
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors border border-gray-200 dark:border-neutral-900"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {mounted && theme === 'light' ? (
            <Moon className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
          ) : (
            <Sun className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
          )}
        </button>

        <div className="relative" ref={userMenuRef}>
          <button 
            className="h-8 w-8 rounded-full bg-gray-800 dark:bg-neutral-700 text-white flex items-center justify-center hover:bg-gray-700 dark:hover:bg-neutral-600 transition-colors"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <span className="text-xs font-medium">ET</span>
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-neutral-800">
              <button className="flex w-full items-center text-left px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button className="flex w-full items-center text-left px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Feedback
              </button>
              <div className="border-t border-gray-100 dark:border-neutral-800 my-1"></div>
              <button 
                onClick={onSignOut}
                className="flex w-full items-center text-left px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
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
  const { view, currentDate, addEvent } = useCalendar();

  const handleAddEvent = () => {
    // Determine default start and end times based on the current view and date
    const now = new Date();
    let startTime = new Date(currentDate);
    startTime.setHours(now.getHours());
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    
    let endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    // Create a default event
    const eventId = addEvent({
      title: '',
      description: '',
      start_time: startTime,
      end_time: endTime,
      is_all_day: false,
    });
    
    // TODO: Open event editor with this new event
    console.log('Created new event with ID', eventId);
  };

  return (
    <button
      onClick={handleAddEvent}
      className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg transition-colors z-10"
      aria-label="Create new event"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}

export default function Calendar({ 
  initialView = 'month',
  initialDate = new Date(),
  onEventChange
}: CalendarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [effectiveView, setEffectiveView] = useState<ViewType>(initialView);
  const { user, session, signOut, refreshSession } = useAuth();
  
  // Get setEvents from the context to update it directly
  const calendarContext = useCalendar(); 
  
  // Track the displayed date range
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(initialDate),
    end: endOfMonth(initialDate)
  });
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Handle date changes and load events for the new date range
  const handleDateChange = useCallback((newDate: Date) => {
    // Determine date range based on current view
    let start: Date, end: Date;
    
    if (effectiveView === 'month') {
      start = startOfMonth(newDate);
      end = endOfMonth(newDate);
    } else if (effectiveView === 'week') {
      start = startOfWeek(newDate);
      end = endOfWeek(newDate);
    } else {
      // Day view
      start = new Date(newDate);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(newDate);
      end.setHours(23, 59, 59, 999);
    }
    
    setDateRange({ start, end });
  }, [effectiveView]);
  
  // Fetch events when date range changes
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Get user's calendars and fetch all visible ones
        const events = await fetchAllVisibleEvents(
          user.id,
          dateRange.start,
          dateRange.end
        );
        
        // Update context state directly but prevent infinite loops
        // by checking if events have actually changed
        const currentEventIds = new Set(calendarContext.events.map(e => e.id));
        const newEvents = events.filter(e => !currentEventIds.has(e.id));
        
        if (newEvents.length > 0) {
          calendarContext.setEvents([...calendarContext.events, ...newEvents]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [user?.id, dateRange.start.toISOString(), dateRange.end.toISOString()]);
  
  // Update event handler to keep parent component in sync
  useEffect(() => {
    if (onEventChange) {
      // Read events directly from context if needed for parent notification
      onEventChange(calendarContext.events);
    }
  }, [calendarContext.events, onEventChange]);
  
  // Handle successful calendar connection
  const handleConnectSuccess = useCallback(async () => {
    // Refresh session to get updated tokens
    await refreshSession();
    
    // Refetch events with new calendar
    if (user?.id) {
      setIsLoading(true);
      
      try {
        const events = await fetchAllVisibleEvents(
          user.id,
          dateRange.start,
          dateRange.end
        );
        
        // Update context state directly, preventing infinite loops
        const currentEventIds = new Set(calendarContext.events.map(e => e.id));
        const newEvents = events.filter(e => !currentEventIds.has(e.id));
        
        if (newEvents.length > 0) {
          calendarContext.setEvents([...calendarContext.events, ...newEvents]);
        }
      } catch (error) {
        console.error('Error fetching events after connect:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user?.id, dateRange.start.toISOString(), dateRange.end.toISOString(), refreshSession]);
  
  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut]);
  
  return (
    <CalendarProvider 
      initialView={effectiveView}
      initialDate={initialDate}
      onDateChange={handleDateChange}
    >
      <div className="h-screen w-full flex bg-white dark:bg-neutral-950">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader 
            sidebarCollapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar}
            onConnectCalendar={() => setShowConnectDialog(true)}
            onSignOut={handleSignOut}
          />
          
          {isLoading ? (
            <CalendarSkeleton view={effectiveView} />
          ) : (
            <CalendarContent />
          )}
          
          <CreateButton />
        </div>
        
        {/* Google Calendar Connect Dialog */}
        <GoogleCalendarConnect 
          isOpen={showConnectDialog}
          onClose={() => setShowConnectDialog(false)}
          onSuccess={handleConnectSuccess}
        />
      </div>
    </CalendarProvider>
  );
}