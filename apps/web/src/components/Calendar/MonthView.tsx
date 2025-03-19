'use client';

import React, { useMemo, useEffect } from 'react';
import { format, isToday, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, startOfWeek, addDays, parse, parseISO } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { CalendarEvent } from './types';

interface Props {
  className?: string;
}

const MonthView: React.FC<Props> = ({ className = '' }) => {
  const { events, currentDate } = useCalendar();

  // Debug event data changes
  useEffect(() => {
    if (events.length > 0) {
      console.log('MonthView: Received events count:', events.length);
    }
  }, [events]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Get first day of grid (the Sunday of the week the month starts)
    const calendarStart = startOfWeek(monthStart);
    
    // Create a 6-week grid (42 days) to ensure we have enough rows
    const daysArray = [];
    for (let i = 0; i < 42; i++) {
      const day = addDays(calendarStart, i);
      daysArray.push({
        date: day,
        dayOfWeek: getDay(day),
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isToday(day),
      });
    }
    
    return daysArray;
  }, [currentDate]);

  // Parse event date to a JavaScript Date object
  const parseEventDate = (event: CalendarEvent): { start: Date, end: Date, isAllDay: boolean } => {
    let startDate: Date;
    let endDate: Date;
    let isAllDay = !!event.is_all_day;

    // Try to parse start time
    if (typeof event.start_time === 'string') {
      try {
        startDate = parseISO(event.start_time);
      } catch (e) {
        console.error('Error parsing start_time:', event.start_time, e);
        startDate = new Date(); // Fallback
      }
    } else if (event.start_time instanceof Date) {
      startDate = event.start_time;
    } else if (event.start?.dateTime) {
      startDate = parseISO(event.start.dateTime);
    } else if (event.start?.date) {
      startDate = parseISO(event.start.date);
      isAllDay = true;
    } else {
      console.error('Could not parse event start date:', event);
      startDate = new Date(); // Fallback
    }

    // Try to parse end time
    if (typeof event.end_time === 'string') {
      try {
        endDate = parseISO(event.end_time);
      } catch (e) {
        console.error('Error parsing end_time:', event.end_time, e);
        endDate = new Date(); // Fallback
      }
    } else if (event.end_time instanceof Date) {
      endDate = event.end_time;
    } else if (event.end?.dateTime) {
      endDate = parseISO(event.end.dateTime);
    } else if (event.end?.date) {
      endDate = parseISO(event.end.date);
      isAllDay = true;
    } else {
      console.error('Could not parse event end date:', event);
      endDate = new Date(); // Fallback
    }

    return { start: startDate, end: endDate, isAllDay };
  };

  const getDayEvents = (date: Date) => {
    return events
      .filter(event => {
        try {
          // Try multiple approaches to check if this event belongs on this day
          
          // First, try with normalized start_time
          if (event.start_time) {
            const eventDate = typeof event.start_time === 'string' 
              ? parseISO(event.start_time) 
              : event.start_time;
            if (isSameDay(eventDate, date)) {
              return true;
            }
          }
          
          // Next, try with Google Calendar's start object
          if (event.start) {
            if (event.start.dateTime) {
              const eventDate = parseISO(event.start.dateTime);
              if (isSameDay(eventDate, date)) {
                return true;
              }
            }
            
            if (event.start.date) {
              const eventDate = parseISO(event.start.date);
              if (isSameDay(eventDate, date)) {
                return true;
              }
            }
          }
          
          // If we reach here, the event doesn't match this day
          return false;
        } catch (e) {
          console.error('Error filtering event for date:', date, event, e);
          return false;
        }
      })
      .slice(0, 3); // Limit to 3 events per day for now
  };

  const handleDayClick = (date: Date) => {
    // Handle day click without logging
  };

  const renderDay = (day: { date: Date; dayOfWeek: number; isCurrentMonth: boolean; isToday: boolean }, index: number) => {
    const dayEvents = getDayEvents(day.date);
    
    const isDifferentMonth = !day.isCurrentMonth;
    const isToday = day.isToday;

    return (
      <div 
        key={index}
        className={`h-full border border-gray-200 dark:border-neutral-900 p-1 ${
          isDifferentMonth ? 'bg-gray-50 dark:bg-neutral-900/40' : ''
        }`}
      >
        <div 
          className="day-cell-background h-full flex flex-col"
          onClick={() => handleDayClick(day.date)}
        >
          {/* Date number with indicator dot for events */}
          <div className="flex items-center justify-between mb-1">
            <div 
              className={`flex items-center justify-center w-7 h-7 ${
                isToday 
                  ? 'bg-blue-500 text-white rounded-full font-bold' 
                  : isDifferentMonth 
                    ? 'text-gray-400 dark:text-neutral-600' 
                    : 'text-gray-700 dark:text-neutral-300'
              }`}
            >
              {format(day.date, 'd')}
            </div>
            {dayEvents.length > 0 && (
              <div className="h-2 w-2 rounded-full bg-blue-500" title={`${dayEvents.length} events`} />
            )}
          </div>
          <div className="mt-1 space-y-1 overflow-hidden">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="px-1 py-0.5 text-xs truncate rounded"
                style={{
                  backgroundColor: event.calendar?.color || event.color || '#3174ad', 
                  color: '#fff'
                }}
                title={event.title || event.summary || ''}
              >
                {event.title || event.summary || '(No title)'}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-neutral-500">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Split days into weeks for the grid
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-neutral-900 bg-gray-50 dark:bg-neutral-950">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-neutral-400">
            {day}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-rows-6 grid-cols-1 bg-white dark:bg-neutral-950">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 h-full">
            {week.map((day, index) => renderDay(day, index))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;