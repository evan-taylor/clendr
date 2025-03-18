import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isSameDay,
  isSameWeek,
  isSameMonth,
  format,
  parse,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  isWithinInterval,
  eachDayOfInterval,
  eachHourOfInterval,
  isBefore,
  isAfter
} from 'date-fns';

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'MMM d');
};

export const getTimeSlots = (date: Date, intervalMinutes: number = 30): Date[] => {
  const slots: Date[] = [];
  const dayStart = setHours(setMinutes(startOfDay(date), 0), 0);
  const dayEnd = setHours(setMinutes(startOfDay(date), 0), 24);
  
  let currentSlot = dayStart;
  while (currentSlot < dayEnd) {
    slots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, intervalMinutes);
  }
  
  return slots;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const getDaysInWeek = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
};

export const getMonthWeeks = (date: Date): Date[][] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  const weeks: Date[][] = [];
  let week: Date[] = [];
  
  allDays.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0) {
      weeks.push(week);
      week = [];
    }
  });
  
  return weeks;
};

export const getHoursInDay = (date: Date): Date[] => {
  const start = startOfDay(date);
  const end = endOfDay(date);
  return eachHourOfInterval({ start, end });
};

export const getPositionFromTime = (
  date: Date, 
  containerHeight: number,
  dayStartHour: number = 0,
  dayEndHour: number = 24
): number => {
  const totalMinutesInView = (dayEndHour - dayStartHour) * 60;
  const minutesSinceStart = (getHours(date) - dayStartHour) * 60 + getMinutes(date);
  return (minutesSinceStart / totalMinutesInView) * containerHeight;
}; 