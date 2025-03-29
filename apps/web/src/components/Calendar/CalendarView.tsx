'use client';

import Calendar from './Calendar';
import { CalendarEvent } from './types';

type CalendarViewProps = {
  events?: Array<{
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    is_all_day: boolean;
    color?: string;
    location?: string;
    description?: string;
  }>;
};

export default function CalendarView({ events = [] }: CalendarViewProps) {
  const mappedEvents: CalendarEvent[] = events.map(event => ({
    ...event,
    start_time: event.start_time,
    end_time: event.end_time,
    is_all_day: event.is_all_day
  }));

  return (
    <div className="w-full h-full">
      <Calendar onEventChange={(newEvents) => console.log('Events changed:', newEvents)} />
    </div>
  );
} 