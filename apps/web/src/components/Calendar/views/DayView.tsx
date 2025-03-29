'use client';

import { useState, useRef, useEffect } from 'react';
import { format, isSameDay, getHours, getMinutes, parseISO, isToday } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { getHoursInDay, getPositionFromTime } from '../utils/dateUtils';
import { calculateTimeFromPosition } from '../utils/dragUtils';
import EventForm from '../UI/EventForm';
import { CalendarEvent, TimeSlot } from '../types';
import { cn } from '../../../utils/cn';

// Define hour height for calculations
const HOUR_ROW_HEIGHT = 64; // Matches h-16 class (4rem = 64px)

// Helper function to darken color (added locally)
function darkenColor(color: string, percent: number): string {
  try {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.round(R * (100 - percent) / 100);
    G = Math.round(G * (100 - percent) / 100);
    B = Math.round(B * (100 - percent) / 100);

    R = (R < 255) ? R : 255;  
    G = (G < 255) ? G : 255;  
    B = (B < 255) ? B : 255;  

    R = (R > 0) ? R : 0;
    G = (G > 0) ? G : 0;
    B = (B > 0) ? B : 0;

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  } catch (error) {
    console.error("Error darkening color:", color, error);
    return color; // Return original color on error
  }
}

export default function DayView() {
  const {
    currentDate,
    events,
    addEvent,
    deleteEvent,
    startEditing,
    isEditing,
    eventToEdit,
    stopEditing
  } = useCalendar();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  const timeGridRef = useRef<HTMLDivElement>(null);
  const [timeGridHeight, setTimeGridHeight] = useState(1000);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [dragStart, setDragStart] = useState<{ y: number; time: Date } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ y: number; time: Date } | null>(null);

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set a ref for current time indicator
  const nowIndicatorRef = useRef<HTMLDivElement>(null);
  
  // Update time grid height when component mounts
  useEffect(() => {
    if (timeGridRef.current) {
      setTimeGridHeight(timeGridRef.current.offsetHeight);
    }
    
    // Set up current time indicator
    updateNowIndicator();
    const intervalId = setInterval(updateNowIndicator, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Scroll to current time or 8 AM on date change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      let targetHour = 8; // Default scroll to 8 AM
      
      if (isToday(currentDate)) {
        targetHour = getHours(new Date()); // Scroll to current hour if today
      }
      
      // Calculate scroll position (targetHour * height per hour)
      // Subtract half the container height to center the time roughly
      const scrollTop = targetHour * HOUR_ROW_HEIGHT - (container.clientHeight / 2);
      
      // Use setTimeout to ensure the layout is stable before scrolling
      setTimeout(() => {
        container.scrollTo({
          top: Math.max(0, scrollTop), // Ensure not scrolling negative
          behavior: 'smooth'
        });
      }, 100); // Small delay
    }
  }, [currentDate]); // Run when the date changes
  
  // Update the position of the "now" indicator
  const updateNowIndicator = () => {
    if (nowIndicatorRef.current) {
      const now = new Date();
      const hours = getHours(now);
      const minutes = getMinutes(now);
      const percentage = (hours + minutes / 60) / 24;
      nowIndicatorRef.current.style.top = `${percentage * 100}%`;
    }
  };
  
  const getEventsForDay = (): CalendarEvent[] => {
    return events.filter(event => {
      const eventStart = typeof event.start_time === 'string' 
        ? parseISO(event.start_time) 
        : new Date(event.start_time);
      return isSameDay(eventStart, currentDate) && !event.is_all_day;
    });
  };
  
  const getAllDayEvents = (): CalendarEvent[] => {
    return events.filter(event => {
      const eventStart = typeof event.start_time === 'string' 
        ? parseISO(event.start_time) 
        : new Date(event.start_time);
      return isSameDay(eventStart, currentDate) && event.is_all_day;
    });
  };
  
  const calculateEventPosition = (event: CalendarEvent): React.CSSProperties => {
    const eventStart = typeof event.start_time === 'string' 
      ? parseISO(event.start_time) 
      : new Date(event.start_time);
    const eventEnd = typeof event.end_time === 'string' 
      ? parseISO(event.end_time) 
      : new Date(event.end_time);
    
    const startHours = getHours(eventStart) + getMinutes(eventStart) / 60;
    const endHours = getHours(eventEnd) + getMinutes(eventEnd) / 60;
    const duration = endHours - startHours;
    
    const top = (startHours / 24) * 100;
    const height = (duration / 24) * 100;
    
    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  };
  
  const handleTimeSlotClick = (hour: number) => {
    const slotStart = new Date(currentDate);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    
    setSelectedTimeSlot({
      start: slotStart,
      end: slotEnd,
    });
  };
  
  const handleEventDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (timeGridRef.current) {
      e.preventDefault();
      setIsCreatingEvent(true);
      
      const rect = timeGridRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const time = calculateTimeFromPosition(y, timeGridHeight, 0, 24, currentDate);
      
      setDragStart({ y, time });
      setDragEnd({ y, time });
      
      // Add event listeners for mouse move and up
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isCreatingEvent || !timeGridRef.current || !dragStart) return;
    
    const rect = timeGridRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(e.clientY - rect.top, timeGridHeight));
    const time = calculateTimeFromPosition(y, timeGridHeight, 0, 24, dragStart.time);
    
    setDragEnd({ y, time });
  };
  
  const handleMouseUp = () => {
    if (!isCreatingEvent || !dragStart || !dragEnd) return;
    
    // Clean up event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Only create event if drag was significant
    if (Math.abs(dragEnd.y - dragStart.y) > 10) {
      // Ensure start time is before end time
      const startTime = dragStart.time.getTime() < dragEnd.time.getTime() 
        ? dragStart.time 
        : dragEnd.time;
      const endTime = dragStart.time.getTime() < dragEnd.time.getTime() 
        ? dragEnd.time 
        : dragStart.time;
      
      // Make minimum duration 30 minutes
      if (endTime.getTime() - startTime.getTime() < 30 * 60 * 1000) {
        endTime.setTime(startTime.getTime() + 30 * 60 * 1000);
      }
      
      setSelectedTimeSlot({
        start: startTime,
        end: endTime,
      });
      
      setIsCreatingEvent(false);
      setDragStart(null);
      setDragEnd(null);
    }
  };
  
  const renderAllDayEvents = () => {
    const allDayEvents = getAllDayEvents();
    
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 grid grid-cols-7">
        <div className="py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
          All day
        </div>
        <div className="col-span-6 py-1 px-2 min-h-[60px]">
          {allDayEvents.map(event => (
            <div
              key={event.id}
              className={`my-0.5 px-2 py-1 text-xs truncate rounded border-l-4 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100
                ${event.calendar?.color ? 
                `border-[${event.calendar.color}] bg-${event.calendar.color}/10 text-${event.calendar.color}/90` : 
                'border-blue-500 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'}`
              }
              onClick={() => startEditing(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Day header */}
      <div className="border-b border-gray-200 dark:border-gray-700 py-3 px-4 text-center">
        <div className={cn(
          "flex items-center justify-center mx-auto w-10 h-10 mb-1 text-sm font-semibold rounded-full",
          isToday(currentDate) 
            ? "bg-blue-500 text-white" 
            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}>
          {format(currentDate, 'd')}
        </div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {format(currentDate, 'EEEE')}
        </div>
      </div>
      
      {/* All-day events */}
      {renderAllDayEvents()}
      
      {/* Time grid */}
      <div className="flex-1 overflow-y-auto relative" ref={scrollContainerRef}>
        <div className="grid grid-cols-7 h-full" ref={timeGridRef}>
          {/* Time labels */}
          <div className="border-r border-gray-200 dark:border-gray-700">
            {hoursOfDay.map((hour) => (
              <div 
                key={hour} 
                className="h-16 border-b border-gray-200 dark:border-gray-700 relative pr-2"
              >
                <div className="absolute -top-3 right-2 text-xs text-gray-500 dark:text-gray-400">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              </div>
            ))}
          </div>
          
          {/* Day column */}
          <div className="col-span-6 relative">
            {/* Current time indicator */}
            {isToday(currentDate) && (
              <div 
                ref={nowIndicatorRef} 
                className="absolute left-0 right-0 z-10 pointer-events-none flex items-center"
              >
                <div className="h-0.5 w-2 bg-red-500 rounded-full"></div>
                <div className="h-0.5 bg-red-500 w-full"></div>
              </div>
            )}
            
            {/* Drag selection overlay */}
            {isCreatingEvent && dragStart && dragEnd && (
              <div
                className="absolute bg-blue-500 bg-opacity-30 dark:bg-opacity-30 border border-blue-500 pointer-events-none z-10"
                style={{
                  top: Math.min(dragStart.y, dragEnd.y),
                  height: Math.abs(dragEnd.y - dragStart.y),
                  left: 0,
                  right: 0,
                }}
              />
            )}
            
            {/* Hour cells */}
            <div 
              className={cn(
                "h-full relative border-r border-gray-200 dark:border-gray-700",
                isToday(currentDate) ? "bg-blue-50/30 dark:bg-blue-900/5" : ""
              )}
              onMouseDown={handleMouseDown}
            >
              {hoursOfDay.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-200 dark:border-gray-700 group"
                  onClick={() => handleTimeSlotClick(hour)}
                >
                  <div className="h-full w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors"></div>
                </div>
              ))}
              
              {/* Events */}
              {getEventsForDay().map(event => {
                const eventStyle = calculateEventPosition(event);
                
                return (
                  <div
                    key={event.id}
                    className={`absolute left-2 right-2 px-3 py-1 text-sm truncate rounded border-l-4 hover:z-20
                      ${event.calendar?.color ? 
                      `border-[${event.calendar.color}] bg-${event.calendar.color}/10 text-${event.calendar.color}/90` : 
                      'border-blue-500 bg-white dark:bg-gray-800 shadow text-blue-800 dark:text-blue-300'}`
                    }
                    style={{
                      ...eventStyle,
                      backgroundColor: event.calendar?.color || '#3b82f6',
                      borderColor: event.calendar?.color ? darkenColor(event.calendar.color, 20) : '#2563eb',
                    }}
                    onClick={() => startEditing(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    {eventStyle.height && parseFloat(eventStyle.height.toString()) > 5 && (
                      <div className="text-xs opacity-75 mt-1">
                        {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Event form modal - controlled by context */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <EventForm
            initialData={eventToEdit || undefined}
            selectedDate={selectedTimeSlot?.start}
            onClose={stopEditing}
          />
        </div>
      )}
    </div>
  );
} 