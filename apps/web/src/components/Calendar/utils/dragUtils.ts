import { differenceInMinutes, addMinutes, setHours, setMinutes, startOfDay } from 'date-fns';
import { CalendarEvent } from '../types';

type Position = {
  x: number;
  y: number;
};

export const calculateTimeFromPosition = (
  position: number,
  containerHeight: number,
  dayStartHour: number = 0,
  dayEndHour: number = 24,
  date: Date
): Date => {
  const totalMinutesInView = (dayEndHour - dayStartHour) * 60;
  const minuteRatio = position / containerHeight;
  const minutesSinceStart = Math.floor(minuteRatio * totalMinutesInView);
  
  const hours = Math.floor(minutesSinceStart / 60) + dayStartHour;
  const minutes = minutesSinceStart % 60;
  
  return setMinutes(setHours(startOfDay(date), hours), minutes);
};

export const calculateEventDuration = (startTime: Date, endTime: Date): number => {
  return differenceInMinutes(endTime, startTime);
};

export const calculateNewEventTime = (
  event: CalendarEvent,
  dragStartY: number,
  currentY: number,
  containerHeight: number,
  dayStartHour: number = 0,
  dayEndHour: number = 24,
  date: Date
): { newStartTime: Date; newEndTime: Date } => {
  const deltaY = currentY - dragStartY;
  const deltaMinutes = Math.round((deltaY / containerHeight) * ((dayEndHour - dayStartHour) * 60));
  
  const eventStart = new Date(event.start_time);
  const eventEnd = new Date(event.end_time);
  
  const newStartTime = addMinutes(eventStart, deltaMinutes);
  const newEndTime = addMinutes(eventEnd, deltaMinutes);
  
  return { newStartTime, newEndTime };
};

export const calculateEventHeight = (
  startTime: Date,
  endTime: Date,
  containerHeight: number,
  dayStartHour: number = 0,
  dayEndHour: number = 24
): number => {
  const totalMinutesInView = (dayEndHour - dayStartHour) * 60;
  const eventDurationMinutes = differenceInMinutes(endTime, startTime);
  return (eventDurationMinutes / totalMinutesInView) * containerHeight;
}; 