'use client';

import { useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { CalendarEvent } from '../types';
import { calculateNewEventTime } from '../utils/dragUtils';
import { formatTime } from '../utils/dateUtils';
import { cn } from '../../../utils/cn';

type CalendarEventItemProps = {
  event: CalendarEvent;
  isInMonth?: boolean;
  view: 'month' | 'week' | 'day';
  containerHeight?: number;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  date?: Date;
  isDraggable?: boolean;
};

// Pre-defined event colors to match Google Calendar
const EVENT_COLORS = {
  blue: { bg: '#4285f4', text: '#ffffff', hover: '#5a95f5', border: '#3367d6' },
  red: { bg: '#ea4335', text: '#ffffff', hover: '#eb5547', border: '#c53929' },
  green: { bg: '#34a853', text: '#ffffff', hover: '#46b564', border: '#2d9044' },
  yellow: { bg: '#fbbc04', text: '#ffffff', hover: '#fbc31b', border: '#f29900' },
  purple: { bg: '#a142f4', text: '#ffffff', hover: '#af57f5', border: '#8430ce' },
  cyan: { bg: '#24c1e0', text: '#ffffff', hover: '#3ac9e6', border: '#1da2bc' },
  orange: { bg: '#ff6d01', text: '#ffffff', hover: '#ff7d1a', border: '#e65100' },
  default: { bg: '#616161', text: '#ffffff', hover: '#757575', border: '#424242' },
};

export default function CalendarEventItem({ 
  event, 
  isInMonth = true, 
  view, 
  containerHeight = 960,
  onEdit,
  onDelete,
  date,
  isDraggable = true
}: CalendarEventItemProps) {
  const { updateEvent } = useCalendar();
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const dragStartEventTimes = useRef<{ startTime: string | Date; endTime: string | Date }>({ 
    startTime: '', 
    endTime: '' 
  });
  
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);
  
  // Get color theme from event or use default
  const getColorTheme = () => {
    if (!event.color) return EVENT_COLORS.blue;
    
    const colorKey = Object.keys(EVENT_COLORS).find(
      key => EVENT_COLORS[key as keyof typeof EVENT_COLORS].bg.toLowerCase() === event.color?.toLowerCase()
    ) as keyof typeof EVENT_COLORS;
    
    return colorKey ? EVENT_COLORS[colorKey] : EVENT_COLORS.default;
  };
  
  const colorTheme = getColorTheme();
  
  const getEventStyles = (): React.CSSProperties => {
    // Basic styles that apply to all views
    const styles: React.CSSProperties = {};
    
    // Additional styles for specific views
    if (view === 'month') {
      return {
        ...styles,
        backgroundColor: colorTheme.bg,
        borderLeft: `3px solid ${colorTheme.border}`,
        opacity: isInMonth ? 1 : 0.7,
      };
    } else if (view === 'week' || view === 'day') {
      return {
        ...styles,
        backgroundColor: colorTheme.bg,
        borderLeft: `3px solid ${colorTheme.border}`,
        position: 'absolute' as const,
        width: view === 'day' ? 'calc(100% - 8px)' : 'calc(100% - 4px)',
        cursor: isDraggable ? 'move' : 'pointer',
      };
    }
    
    return styles;
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    
    // Store the initial position
    dragStartPosition.current = { 
      x: e.clientX, 
      y: e.clientY 
    };
    
    // Store the initial event times
    dragStartEventTimes.current = {
      startTime: event.start_time,
      endTime: event.end_time
    };
    
    setIsDragging(true);
    
    // Add event listeners for mouse move and up
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !date) return;
    
    const { newStartTime, newEndTime } = calculateNewEventTime(
      {
        ...event,
        start_time: dragStartEventTimes.current.startTime,
        end_time: dragStartEventTimes.current.endTime
      },
      dragStartPosition.current.y,
      e.clientY,
      containerHeight,
      0,
      24,
      date
    );
    
    if (eventRef.current) {
      const deltaY = e.clientY - dragStartPosition.current.y;
      eventRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !date) return;
    
    // Calculate the new times after dragging
    const { newStartTime, newEndTime } = calculateNewEventTime(
      {
        ...event,
        start_time: dragStartEventTimes.current.startTime,
        end_time: dragStartEventTimes.current.endTime
      },
      dragStartPosition.current.y,
      e.clientY,
      containerHeight,
      0,
      24,
      date
    );
    
    // Update the event with new times
    updateEvent({
      ...event,
      start_time: newStartTime.toISOString(),
      end_time: newEndTime.toISOString()
    });
    
    setIsDragging(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Reset transform
    if (eventRef.current) {
      eventRef.current.style.transform = '';
    }
  };
  
  const getEventTitle = () => {
    if (view === 'month') {
      if (event.is_all_day) {
        return event.title;
      }
      return `${format(startTime, 'h:mm a')} ${event.title}`;
    }
    
    return event.title;
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(event.id);
  };
  
  return (
    <div
      ref={eventRef}
      className={cn(
        "rounded-sm text-xs transition-all", 
        view === 'month' 
          ? 'mb-1 truncate' 
          : 'absolute left-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow',
        isDragging ? 'opacity-70' : '',
        event.is_all_day && view === 'month' 
          ? 'py-0.5 px-1.5 font-medium' 
          : 'py-1 px-2'
      )}
      style={getEventStyles()}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(event);
      }}
    >
      <div className="flex justify-between items-start">
        <div className="truncate text-white">
          {getEventTitle()}
        </div>
        {showActions && (
          <div 
            className="ml-1 p-0.5 rounded hover:bg-white hover:bg-opacity-20" 
            onClick={handleDelete}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>
      
      {(view === 'week' || view === 'day') && !event.is_all_day && (
        <div className="text-xs opacity-90 mt-1 text-white">
          {formatTime(startTime)} - {formatTime(endTime)}
        </div>
      )}
      
      {event.location && (view === 'week' || view === 'day') && (
        <div className="text-xs opacity-90 mt-1 truncate text-white">
          📍 {event.location}
        </div>
      )}
    </div>
  );
}