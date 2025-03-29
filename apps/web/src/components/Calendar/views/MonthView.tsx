'use client';

import { useState } from 'react';
import { format, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { getMonthWeeks } from '../utils/dateUtils';
import CalendarEventItem from '../UI/CalendarEventItem';
import EventForm from '../UI/EventForm';
import { CalendarEvent } from '../types';
import { cn } from '../../../utils/cn';
import { Plus } from 'lucide-react';

export default function MonthView() {
  const { 
    currentDate, 
    events, 
    deleteEvent, 
    startEditing, 
    isEditing, 
    eventToEdit, 
    stopEditing 
  } = useCalendar();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const weeks = getMonthWeeks(currentDate);
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = typeof event.start_time === 'string' 
        ? parseISO(event.start_time) 
        : new Date(event.start_time);
      return isSameDay(eventStart, day);
    }).sort((a, b) => {
      // All-day events first
      if (a.is_all_day && !b.is_all_day) return -1;
      if (!a.is_all_day && b.is_all_day) return 1;
      
      // Then sort by start time
      const aTime = typeof a.start_time === 'string' 
        ? parseISO(a.start_time) 
        : new Date(a.start_time);
      const bTime = typeof b.start_time === 'string' 
        ? parseISO(b.start_time) 
        : new Date(b.start_time);
      return aTime.getTime() - bTime.getTime();
    });
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    // Removed setShowEventForm(true)
    // Removed setSelectedEvent(null)
    // TODO: Decide if clicking a day should open a *creation* form
  };
  
  const handleEventDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      {/* Day headers */}
      <div className="grid grid-cols-7 text-center py-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div 
            key={day + index} 
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="flex-grow grid grid-rows-6 auto-rows-fr border-t border-gray-100 dark:border-gray-800">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 h-full">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              const dayEvents = getEventsForDay(day);
              
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "border-b border-r border-gray-100 dark:border-gray-800 flex flex-col relative group transition-colors",
                    !isCurrentMonth 
                      ? "bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-600" 
                      : "bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100",
                    isTodayDate && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="pt-1 px-2 pb-1 flex justify-between items-start">
                    <div className={cn(
                      "flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full",
                      isTodayDate 
                        ? "bg-blue-600 text-white" 
                        : "text-inherit hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}>
                      {format(day, 'd')}
                    </div>
                    
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(day);
                      }}
                      aria-label="Add event"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 px-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div 
                        key={event.id}
                        className={`my-0.5 px-1.5 py-0.5 text-xs truncate rounded border-l-2 transition-colors
                          ${event.calendar?.color ? 
                          `border-[${event.calendar.color}] bg-[${event.calendar.color}]/10 text-[${event.calendar.color}]/90 dark:text-[${event.calendar.color}]/70` : 
                          'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400'}`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          // Use context function to start editing
                          startEditing(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <div 
                        className="text-xs mt-0.5 px-1.5 py-0.5 text-gray-500 dark:text-gray-400 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(day);
                        }}
                      >
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Event form modal - controlled by context */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <EventForm
            initialData={eventToEdit || undefined} // Pass event being edited
            selectedDate={selectedDate || undefined} // Keep selectedDate for potential creation context?
            onClose={stopEditing} // Use context function to close
          />
        </div>
      )}
    </div>
  );
} 