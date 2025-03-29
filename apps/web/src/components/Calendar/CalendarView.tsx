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
  return (
    <div className="w-full h-full">
      <Calendar />
    </div>
  );
} 