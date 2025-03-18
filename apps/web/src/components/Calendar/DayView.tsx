'use client';

import React, { useMemo } from 'react';
import { format, addMinutes, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { CalendarEvent, TimeSlot } from './types';

interface Props {
  className?: string;
}

const HOUR_HEIGHT = 60; // pixels per hour
const MIN_HEIGHT = HOUR_HEIGHT / 60; // pixels per minute

const DayView: React.FC<Props> = ({ className = '' }) => {
  const { events, currentDate } = useCalendar();

  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(currentDate);
      hour.setHours(i, 0, 0, 0);
      return hour;
    });
  }, [currentDate]);

  // Parse Google Calendar events to our format
  const normalizeEvent = (event: CalendarEvent): CalendarEvent => {
    // If the event already has start_time and end_time, return it as is
    if (event.start_time && event.end_time) {
      return event;
    }
    
    // Handle Google Calendar format
    const start = event.start?.dateTime || event.start?.date || '';
    const end = event.end?.dateTime || event.end?.date || '';
    const isAllDay = !!event.start?.date;
    
    return {
      ...event,
      title: event.summary || event.title || '',
      start_time: start,
      end_time: end,
      is_all_day: isAllDay,
    };
  };

  const dayEvents = useMemo(() => {
    return events
      .map(normalizeEvent)
      .filter(event => {
        const startDate = new Date(event.start_time);
        return isSameDay(startDate, currentDate) && !event.is_all_day;
      })
      .sort((a, b) => {
        const aStart = new Date(a.start_time).getTime();
        const bStart = new Date(b.start_time).getTime();
        return aStart - bStart;
      });
  }, [events, currentDate]);

  const allDayEvents = useMemo(() => {
    return events
      .map(normalizeEvent)
      .filter(event => {
        const startDate = new Date(event.start_time);
        return isSameDay(startDate, currentDate) && event.is_all_day;
      });
  }, [events, currentDate]);

  const getEventPosition = (event: CalendarEvent) => {
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    
    const dayStart = startOfDay(currentDate);
    
    const minutesFromDayStart = 
      (startTime.getHours() * 60) + startTime.getMinutes();
    const durationMinutes = 
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    
    return {
      top: minutesFromDayStart * MIN_HEIGHT,
      height: Math.max(durationMinutes * MIN_HEIGHT, 20), // Minimum event height
    };
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-medium">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
      </div>
      
      {allDayEvents.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-800 py-2 px-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">ALL DAY</div>
          <div className="space-y-1">
            {allDayEvents.map((event) => (
              <div
                key={event.id}
                className="px-2 py-1 text-xs rounded truncate"
                style={{
                  backgroundColor: event.calendar?.color || event.color || '#3174ad',
                  color: '#fff'
                }}
              >
                {event.title || event.summary || '(No title)'}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div 
          className="relative" 
          style={{ height: `${HOUR_HEIGHT * 24}px` }}
        >
          {/* Time labels */}
          <div className="absolute left-0 top-0 w-16 h-full border-r border-gray-200 dark:border-gray-800 z-10 bg-white dark:bg-gray-950">
            {hours.map((hour) => (
              <div 
                key={hour.getTime()} 
                className="absolute w-full border-t border-gray-200 dark:border-gray-800 flex items-start justify-center -mt-3 text-xs text-gray-500 dark:text-gray-400"
                style={{ top: `${hour.getHours() * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
              >
                <span>{format(hour, 'h a')}</span>
              </div>
            ))}
          </div>
          
          {/* Hour grid lines */}
          <div className="absolute left-16 right-0 top-0 h-full bg-white dark:bg-gray-950">
            {hours.map((hour) => (
              <div 
                key={hour.getTime()} 
                className="absolute w-full border-t border-gray-200 dark:border-gray-800" 
                style={{ top: `${hour.getHours() * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
              />
            ))}
          </div>
          
          {/* Events */}
          <div className="absolute left-16 right-0 top-0">
            {dayEvents.map((event) => {
              const { top, height } = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  className="absolute left-1 right-1 rounded px-2 py-1 overflow-hidden shadow-sm"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: event.calendar?.color || event.color || '#3174ad',
                    color: '#fff'
                  }}
                >
                  <div className="text-xs font-semibold truncate">
                    {event.title || event.summary || '(No title)'}
                  </div>
                  {height > 40 && (
                    <div className="text-xs mt-1 truncate">
                      {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Current time indicator */}
          <div 
            className="absolute left-0 right-0 border-t border-red-500 z-20"
            style={{ 
              top: `${(new Date().getHours() * 60 + new Date().getMinutes()) * MIN_HEIGHT}px` 
            }}
          >
            <div className="absolute -top-2 -left-1 w-3 h-3 rounded-full bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView; 