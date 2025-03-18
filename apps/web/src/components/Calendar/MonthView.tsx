'use client';

import React, { useMemo } from 'react';
import { format, isToday, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, startOfWeek, addDays } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { CalendarEvent } from './types';

interface Props {
  className?: string;
}

const MonthView: React.FC<Props> = ({ className = '' }) => {
  const { events, currentDate } = useCalendar();

  // Add debug output
  console.log('MonthView rendering with events:', events);

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
        return isSameDay(startDate, date);
      })
      .slice(0, 3); // Limit to 3 events per day for now
  };

  const renderDay = (day: { date: Date; dayOfWeek: number; isCurrentMonth: boolean; isToday: boolean }) => {
    const dayEvents = getDayEvents(day.date);
    
    return (
      <div
        key={day.date.toISOString()}
        className={`h-full border border-gray-200 dark:border-gray-800 p-1 ${
          !day.isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900' : day.isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
      >
        <div className="font-semibold text-sm">{format(day.date, 'd')}</div>
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
            <div className="text-xs text-gray-500">+{events.length - 3} more</div>
          )}
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
      <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-rows-6 grid-cols-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 h-full">
            {week.map(day => renderDay(day))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView; 