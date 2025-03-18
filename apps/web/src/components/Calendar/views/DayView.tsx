'use client';

import { useState, useRef, useEffect } from 'react';
import { format, isSameDay, getHours, getMinutes, parseISO, isToday } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { getHoursInDay, getPositionFromTime } from '../utils/dateUtils';
import { calculateTimeFromPosition } from '../utils/dragUtils';
import EventForm from '../UI/EventForm';
import { CalendarEvent, TimeSlot } from '../types';
import { cn } from '../../../utils/cn';

export default function DayView() {
  const { currentDate, events, addEvent, deleteEvent } = useCalendar();
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  const timeGridRef = useRef<HTMLDivElement>(null);
  const [timeGridHeight, setTimeGridHeight] = useState(1000);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [dragStart, setDragStart] = useState<{ y: number; time: Date } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ y: number; time: Date } | null>(null);

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
    
    setSelectedEvent(null);
    setShowEventForm(true);
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedTimeSlot(null);
    setShowEventForm(true);
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
      const time = calculateTimeFromPosition(y, timeGridHeight, currentDate);
      
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
    const time = calculateTimeFromPosition(y, timeGridHeight, dragStart.time);
    
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
      
      setSelectedEvent(null);
      setShowEventForm(true);
    }
    
    setIsCreatingEvent(false);
    setDragStart(null);
    setDragEnd(null);
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
              onClick={() => handleEventClick(event)}
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
      <div className="flex-1 overflow-y-auto relative">
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
                    style={eventStyle}
                    onClick={() => handleEventClick(event)}
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
      
      {/* Event form modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <EventForm
            initialData={selectedEvent || undefined}
            selectedTimeSlot={selectedTimeSlot || undefined}
            onClose={() => setShowEventForm(false)}
          />
        </div>
      )}
    </div>
  );
} 