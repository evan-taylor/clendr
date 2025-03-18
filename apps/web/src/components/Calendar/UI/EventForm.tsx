'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useCalendar } from '../CalendarContext';
import { EventFormData } from '../types';
import { cn } from '../../../utils/cn';

// Pre-defined event colors to match Google Calendar
const EVENT_COLORS = {
  blue: { bg: '#4285f4', text: '#ffffff', hover: '#5a95f5', border: '#3367d6' },
  red: { bg: '#ea4335', text: '#ffffff', hover: '#eb5547', border: '#c53929' },
  green: { bg: '#34a853', text: '#ffffff', hover: '#46b564', border: '#2d9044' },
  yellow: { bg: '#fbbc04', text: '#000000', hover: '#fbc31b', border: '#f29900' },
  purple: { bg: '#a142f4', text: '#ffffff', hover: '#af57f5', border: '#8430ce' },
  cyan: { bg: '#24c1e0', text: '#ffffff', hover: '#3ac9e6', border: '#1da2bc' },
  orange: { bg: '#ff6d01', text: '#ffffff', hover: '#ff7d1a', border: '#e65100' },
  gray: { bg: '#616161', text: '#ffffff', hover: '#757575', border: '#424242' },
};

type EventFormProps = {
  initialData?: EventFormData;
  onClose: () => void;
  selectedDate?: Date;
};

export default function EventForm({ initialData, onClose, selectedDate }: EventFormProps) {
  const { addEvent, updateEvent } = useCalendar();
  const [isAllDay, setIsAllDay] = useState(initialData?.is_all_day || false);
  
  const defaultStartTime = selectedDate || new Date();
  const defaultEndTime = new Date(defaultStartTime);
  defaultEndTime.setHours(defaultStartTime.getHours() + 1);
  
  const getInitialData = (): EventFormData => {
    if (initialData) return initialData;
    
    return {
      title: '',
      description: '',
      location: '',
      start_time: defaultStartTime.toISOString(),
      end_time: defaultEndTime.toISOString(),
      is_all_day: false,
      color: EVENT_COLORS.blue.bg,
    };
  };
  
  const [formData, setFormData] = useState<EventFormData>(getInitialData());
  
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAllDayToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAllDay(checked);
    
    // If toggling to all-day, adjust times to be start/end of day
    if (checked) {
      const startDate = new Date(formData.start_time);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(formData.end_time);
      endDate.setHours(23, 59, 59, 999);
      
      setFormData({
        ...formData,
        is_all_day: checked,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      });
    } else {
      setFormData({
        ...formData,
        is_all_day: checked,
      });
    }
  };
  
  const handleColorSelection = (colorValue: string) => {
    setFormData({
      ...formData,
      color: colorValue,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.id) {
      updateEvent({ ...formData, id: formData.id });
    } else {
      addEvent(formData);
    }
    
    onClose();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          {formData.id ? 'Edit Event' : 'New Event'}
        </h2>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_all_day"
              name="is_all_day"
              checked={isAllDay}
              onChange={handleAllDayToggle}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-500 dark:bg-gray-700 rounded"
            />
            <label htmlFor="is_all_day" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              All day
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start {isAllDay ? 'Date' : 'Time'}
            </label>
            <input
              type={isAllDay ? "date" : "datetime-local"}
              id="start_time"
              name="start_time"
              value={formatDateForInput(formData.start_time)}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End {isAllDay ? 'Date' : 'Time'}
            </label>
            <input
              type={isAllDay ? "date" : "datetime-local"}
              id="end_time"
              name="end_time"
              value={formatDateForInput(formData.end_time)}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Color
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(EVENT_COLORS).map(([colorName, colorData]) => (
              <button
                key={colorName}
                type="button"
                onClick={() => handleColorSelection(colorData.bg)}
                className={cn(
                  "h-6 w-6 rounded-full border-2",
                  formData.color === colorData.bg 
                    ? "border-gray-800 dark:border-white" 
                    : "border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                )}
                style={{ backgroundColor: colorData.bg }}
                aria-label={`Select ${colorName} color`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {formData.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
} 