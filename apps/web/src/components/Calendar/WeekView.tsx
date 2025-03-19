'use client';

import React, { useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay, isSameMonth, isToday } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { CalendarEvent } from './types';

interface Props {
  className?: string;
}

const HOUR_HEIGHT = 60; // pixels per hour
const MIN_HEIGHT = HOUR_HEIGHT / 60; // pixels per minute

const WeekView: React.FC<Props> = ({ className = '' }) => {
  const { events, currentDate } = useCalendar();
  
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      return {
        date: day,
        isToday: isToday(day),
        isSameMonth: isSameMonth(day, currentDate),
      };
    });
  }, [currentDate]);

  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(i, 0, 0, 0);
      return hour;
    });
  }, []);

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

  const getDayEvents = (date: Date) => {
    return events
      .map(normalizeEvent)
      .filter(event => {
        const startDate = new Date(event.start_time);
        return isSameDay(startDate, date) && !event.is_all_day;
      })
      .sort((a, b) => {
        const aStart = new Date(a.start_time).getTime();
        const bStart = new Date(b.start_time).getTime();
        return aStart - bStart;
      });
  };

  const getAllDayEvents = (date: Date) => {
    return events
      .map(normalizeEvent)
      .filter(event => {
        const startDate = new Date(event.start_time);
        return isSameDay(startDate, date) && event.is_all_day;
      });
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    
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
      {/* Week header */}
      <div className="flex border-b border-gray-200 dark:border-neutral-900 bg-gray-50 dark:bg-neutral-950">
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-neutral-900"></div>
        {days.map((day) => (
          <div 
            key={day.date.toISOString()} 
            className={`flex-1 p-2 text-center ${
              day.isToday ? 'bg-blue-50 dark:bg-neutral-900/80' : 
              !day.isSameMonth ? 'bg-gray-100 dark:bg-neutral-900' : ''
            }`}
          >
            <div className="text-sm">{format(day.date, 'EEE')}</div>
            <div className={`inline-flex items-center justify-center rounded-full w-7 h-7 ${
              day.isToday ? 'bg-blue-500 text-white' : ''
            }`}>
              {format(day.date, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* All-day events */}
      <div className="flex border-b border-gray-200 dark:border-neutral-900">
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-neutral-900 p-1 text-xs text-gray-500 dark:text-neutral-400 flex items-center">
          ALL DAY
        </div>
        {days.map((day) => {
          const allDayEvents = getAllDayEvents(day.date);
          return (
            <div 
              key={`allday-${day.date.toISOString()}`}
              className={`flex-1 p-1 min-h-10 ${
                day.isToday ? 'bg-blue-50 dark:bg-neutral-900/80' : 
                !day.isSameMonth ? 'bg-gray-100 dark:bg-neutral-900' : ''
              }`}
            >
              {allDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="px-1 py-0.5 text-xs truncate rounded mb-1"
                  style={{
                    backgroundColor: event.calendar?.color || event.color || '#3174ad',
                    color: '#fff'
                  }}
                >
                  {event.title || event.summary || '(No title)'}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ height: `${HOUR_HEIGHT * 24}px` }}>
          {/* Time labels */}
          <div className="w-16 flex-shrink-0 relative border-r border-gray-200 dark:border-neutral-900 bg-white dark:bg-neutral-950">
            {hours.map((hour) => (
              <div 
                key={hour.getTime()} 
                className="absolute w-full border-t border-gray-200 dark:border-neutral-900 flex items-start justify-center text-xs text-gray-500 dark:text-neutral-400"
                style={{ 
                  top: `${hour.getHours() * HOUR_HEIGHT}px`, 
                  paddingTop: hour.getHours() === 0 ? '3px' : '0' // Ensure 12 AM is visible
                }}
              >
                <span className="mt-1">{format(hour, 'h a')}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const dayEvents = getDayEvents(day.date);
            return (
              <div 
                key={`grid-${day.date.toISOString()}`} 
                className={`flex-1 relative border-r border-gray-200 dark:border-neutral-900 ${
                  day.isToday ? 'bg-blue-50/30 dark:bg-neutral-900/60' : ''
                }`}
              >
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div 
                    key={hour.getTime()} 
                    className="absolute w-full border-t border-gray-200 dark:border-neutral-900" 
                    style={{ top: `${hour.getHours() * HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 overflow-hidden shadow-sm"
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
                      {height > 30 && (
                        <div className="text-xs truncate">
                          {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Current time indicator (only for today) */}
                {day.isToday && (
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-red-500 z-20"
                    style={{ 
                      top: `${(new Date().getHours() * 60 + new Date().getMinutes()) * MIN_HEIGHT}px`,
                      marginTop: '-1px' // Adjust to align with grid lines
                    }}
                  >
                    <div className="absolute -top-1.5 -left-1 w-3 h-3 rounded-full bg-red-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView; 