'use client';

import React from 'react';
import { ViewType } from './types';
import { format, addDays, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface CalendarSkeletonProps {
  view: ViewType;
}

export default function CalendarSkeleton({ view }: CalendarSkeletonProps) {
  const today = new Date();
  
  // Generate skeleton based on view type
  if (view === 'month') {
    return <MonthViewSkeleton />;
  } else if (view === 'week') {
    return <WeekViewSkeleton />;
  } else {
    return <DayViewSkeleton />;
  }
}

function MonthViewSkeleton() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(monthStart);
  const firstDay = startOfWeek(monthStart);
  const lastDay = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-neutral-800 rounded-t-lg border border-gray-200 dark:border-neutral-800">
        {/* Day headers */}
        {daysOfWeek.map((day) => (
          <div 
            key={day} 
            className="p-2 text-xs font-medium text-center text-gray-500 dark:text-neutral-400 bg-gray-50 dark:bg-neutral-900"
          >
            {day}
          </div>
        ))}
        
        {/* Day cells */}
        {days.map((day, i) => (
          <div 
            key={i} 
            className="min-h-[100px] bg-white dark:bg-neutral-950 p-1 border-b border-r border-gray-100 dark:border-neutral-900"
          >
            <div className="text-xs font-medium text-gray-500 dark:text-neutral-500 mb-1 p-1">
              {format(day, 'd')}
            </div>
            
            {/* Event skeleton placeholders */}
            {Math.random() > 0.5 && (
              <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse mb-1"></div>
            )}
            {Math.random() > 0.7 && (
              <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse mb-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekViewSkeleton() {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="flex-1 overflow-auto">
      <div className="flex h-full">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-neutral-900">
          {hours.map((hour) => (
            <div key={hour} className="h-12 border-b border-gray-100 dark:border-neutral-900 p-1">
              <div className="text-xs text-gray-500 dark:text-neutral-500 text-right mr-2">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            </div>
          ))}
        </div>
        
        {/* Days columns */}
        <div className="flex-1 grid grid-cols-7 gap-px">
          {/* Day headers */}
          {weekDays.map((day) => (
            <div key={format(day, 'yyyy-MM-dd')} className="border-b border-gray-200 dark:border-neutral-900">
              <div className="h-10 p-2 text-center">
                <div className="text-xs font-medium text-gray-500 dark:text-neutral-500">
                  {format(day, 'EEE')}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-neutral-300">
                  {format(day, 'd')}
                </div>
              </div>
              
              {/* Hour cells */}
              <div>
                {hours.map((hour) => (
                  <div 
                    key={hour}
                    className="h-12 border-b border-gray-100 dark:border-neutral-900 relative"
                  >
                    {/* Random event placeholders */}
                    {Math.random() > 0.85 && (
                      <div 
                        className="absolute left-1 right-1 h-10 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse"
                        style={{ top: '4px' }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayViewSkeleton() {
  const today = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="flex-1 overflow-auto">
      <div className="flex h-full">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-neutral-900">
          {hours.map((hour) => (
            <div key={hour} className="h-12 border-b border-gray-100 dark:border-neutral-900 p-1">
              <div className="text-xs text-gray-500 dark:text-neutral-500 text-right mr-2">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            </div>
          ))}
        </div>
        
        {/* Day column */}
        <div className="flex-1">
          <div className="h-10 p-2 text-center border-b border-gray-200 dark:border-neutral-900">
            <div className="text-sm font-semibold text-gray-900 dark:text-neutral-300">
              {format(today, 'EEEE, MMMM d')}
            </div>
          </div>
          
          {/* Hour cells */}
          <div>
            {hours.map((hour) => (
              <div 
                key={hour}
                className="h-12 border-b border-gray-100 dark:border-neutral-900 relative"
              >
                {/* Random event placeholders */}
                {Math.random() > 0.7 && (
                  <div 
                    className="absolute left-1 right-1 h-10 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse"
                    style={{ top: '4px' }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 