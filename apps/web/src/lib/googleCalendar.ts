import { createClient } from '@/utils/supabase/client';
import { addHours, format, parse, formatISO, addDays } from "date-fns";

// Google Calendar API constants
const GOOGLE_API_BASE_URL = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_OAUTH_SCOPE = 'https://www.googleapis.com/auth/calendar';

// Get Supabase client
const getSupabase = () => createClient();

// Cache implementation for calendar data
class CalendarCache {
  private static instance: CalendarCache;
  private userCalendarsCache: Map<string, { data: UserCalendar[], timestamp: number }>;
  private calendarEventsCache: Map<string, { data: CalendarEvent[], timestamp: number }>;
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.userCalendarsCache = new Map();
    this.calendarEventsCache = new Map();
  }

  public static getInstance(): CalendarCache {
    if (!CalendarCache.instance) {
      CalendarCache.instance = new CalendarCache();
    }
    return CalendarCache.instance;
  }

  // Cache key generator for events
  private getEventsCacheKey(calendarId: string, start: Date, end: Date): string {
    return `${calendarId}:${format(start, 'yyyy-MM-dd')}:${format(end, 'yyyy-MM-dd')}`;
  }

  // User calendars cache methods
  public getUserCalendarsFromCache(userId: string): UserCalendar[] | null {
    const cached = this.userCalendarsCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log('Calendar cache hit for user:', userId);
      return cached.data;
    }
    return null;
  }

  public setUserCalendarsCache(userId: string, calendars: UserCalendar[]): void {
    this.userCalendarsCache.set(userId, {
      data: calendars,
      timestamp: Date.now()
    });
  }

  // Calendar events cache methods
  public getEventsFromCache(calendarId: string, start: Date, end: Date): CalendarEvent[] | null {
    const key = this.getEventsCacheKey(calendarId, start, end);
    const cached = this.calendarEventsCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log('Events cache hit for calendar:', calendarId);
      return cached.data;
    }
    return null;
  }

  public setEventsCache(calendarId: string, start: Date, end: Date, events: CalendarEvent[]): void {
    const key = this.getEventsCacheKey(calendarId, start, end);
    this.calendarEventsCache.set(key, {
      data: events,
      timestamp: Date.now()
    });
  }

  // Invalidate caches
  public invalidateUserCalendarsCache(userId: string): void {
    this.userCalendarsCache.delete(userId);
  }

  public invalidateEventsCache(calendarId: string): void {
    // Remove all entries for this calendar ID
    for (const key of this.calendarEventsCache.keys()) {
      if (key.startsWith(`${calendarId}:`)) {
        this.calendarEventsCache.delete(key);
      }
    }
  }

  // Invalidate all caches
  public invalidateAllCaches(): void {
    this.userCalendarsCache.clear();
    this.calendarEventsCache.clear();
  }
}

// Get the cache instance
const cache = CalendarCache.getInstance();

// Type for Google Calendar list item
export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  selected?: boolean;
  primary?: boolean;
}

// Type for stored user calendar
export interface UserCalendar {
  id: string;
  user_id: string;
  calendar_id: string;
  name: string;
  description?: string;
  color: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Type for Google Calendar event
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  creator?: {
    email: string;
    displayName?: string;
  };
  organizer?: {
    email: string;
    displayName?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  htmlLink?: string;
  colorId?: string;
  recurringEventId?: string;
}

/**
 * Get all calendars for the authenticated user
 */
export async function fetchUserCalendars(accessToken: string): Promise<GoogleCalendar[]> {
  try {
    const response = await fetch(`${GOOGLE_API_BASE_URL}/users/me/calendarList`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch calendars: ${response.statusText}`);
    }

    const data = await response.json();
    const calendars = data.items || [];
    
    return calendars;
  } catch (error) {
    console.error('Error fetching user calendars:', error);
    throw error;
  }
}

/**
 * Add a Google calendar to user's account in the database
 */
export async function addCalendarToUser(
  userId: string,
  calendar: GoogleCalendar,
  accessToken: string,
  refreshToken: string,
  tokenExpiry: Date
): Promise<UserCalendar | null> {
  try {
    // Log what we're trying to insert for debugging
    console.log('Adding calendar to user:', {
      userId,
      calendarId: calendar.id,
      name: calendar.summary,
      tokenExpiry: tokenExpiry.toISOString()
    });
    
    const { data, error } = await getSupabase()
      .from('user_calendars')
      .upsert(
        {
          user_id: userId,
          calendar_id: calendar.id,
          name: calendar.summary,
          description: calendar.description || '',
          color: calendar.backgroundColor || '#4285f4',
          is_visible: calendar.selected || true,
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expiry: tokenExpiry.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        {
          onConflict: 'user_id,calendar_id',
          returning: 'representation'
        }
      );

    if (error) {
      console.error('Supabase error adding calendar:', error);
      throw error;
    }
    
    // Invalidate user calendars cache
    cache.invalidateUserCalendarsCache(userId);
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error adding calendar to user:', error);
    throw error;
  }
}

/**
 * Get all calendars saved for a user
 */
export async function getUserCalendars(userId: string): Promise<UserCalendar[]> {
  // Try to get from cache first
  const cachedCalendars = cache.getUserCalendarsFromCache(userId);
  if (cachedCalendars) {
    return cachedCalendars;
  }

  // If not in cache, fetch from DB
  try {
    const { data, error } = await getSupabase()
      .from("user_calendars")
      .select("*")
      .eq("user_id", userId)
      .order("created_at");

    if (error) {
      console.error("Error fetching user calendars:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Store in cache for future use
    cache.setUserCalendarsCache(userId, data as UserCalendar[]);
    return data as UserCalendar[];
  } catch (error) {
    console.error("Error in getUserCalendars:", error);
    throw error;
  }
}

/**
 * Update a user calendar's properties (color, visibility)
 */
export async function updateUserCalendar(
  calendarId: string,
  updates: Partial<UserCalendar>
): Promise<UserCalendar | null> {
  try {
    const { data, error } = await getSupabase()
      .from('user_calendars')
      .update(updates)
      .eq('id', calendarId)
      .select()
      .single();

    if (error) throw error;
    
    // Invalidate relevant cache entries
    if (data) {
      cache.invalidateUserCalendarsCache(data.user_id);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user calendar:', error);
    throw error;
  }
}

/**
 * Delete a user calendar
 */
export async function deleteUserCalendar(calendarId: string): Promise<void> {
  try {
    // First get the calendar to know which user_id to invalidate in cache
    const { data: calendar, error: getError } = await getSupabase()
      .from('user_calendars')
      .select('user_id')
      .eq('id', calendarId)
      .single();
      
    if (getError) throw getError;
    
    const { error } = await getSupabase()
      .from('user_calendars')
      .delete()
      .eq('id', calendarId);

    if (error) throw error;
    
    // Invalidate relevant cache entries
    if (calendar) {
      cache.invalidateUserCalendarsCache(calendar.user_id);
    }
  } catch (error) {
    console.error('Error deleting user calendar:', error);
    throw error;
  }
}

/**
 * Fetch events from a Google Calendar
 */
export async function fetchCalendarEvents(
  calendarId: string,
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  // Try to get from cache first
  const cachedEvents = cache.getEventsFromCache(calendarId, startDate, endDate);
  if (cachedEvents) {
    return cachedEvents;
  }

  try {
    const timeMin = formatISO(startDate);
    const timeMax = formatISO(endDate);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events?timeMin=${encodeURIComponent(
        timeMin
      )}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch events: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    const events = data.items || [];
    
    // Store in cache for future use
    cache.setEventsCache(calendarId, startDate, endDate, events);
    
    return events;
  } catch (error) {
    console.error(`Error fetching events for calendar ${calendarId}:`, error);
    throw error;
  }
}

/**
 * Create a new event in a Google Calendar
 */
export async function createCalendarEvent(
  calendarId: string,
  accessToken: string,
  event: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create event: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    // Invalidate cache for this calendar
    cache.invalidateEventsCache(calendarId);
    
    return data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

/**
 * Update an existing event in a Google Calendar
 */
export async function updateCalendarEvent(
  calendarId: string,
  eventId: string,
  accessToken: string,
  event: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events/${encodeURIComponent(eventId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update event: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    // Invalidate cache for this calendar
    cache.invalidateEventsCache(calendarId);
    
    return data;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw error;
  }
}

/**
 * Delete an event from a Google Calendar
 */
export async function deleteCalendarEvent(
  calendarId: string,
  eventId: string,
  accessToken: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events/${encodeURIComponent(eventId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Failed to delete event: ${response.status} ${response.statusText} - ${errorData}`
      );
    }
    
    // Invalidate cache for this calendar
    cache.invalidateEventsCache(calendarId);
    
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    throw error;
  }
}

export async function saveUserCalendar(
  userId: string,
  calendarInfo: Partial<UserCalendar>
): Promise<UserCalendar> {
  try {
    const { data, error } = await getSupabase()
      .from("user_calendars")
      .upsert({
        user_id: userId,
        ...calendarInfo,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error saving user calendar:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned after saving user calendar");
    }
    
    // Invalidate user calendars cache
    cache.invalidateUserCalendarsCache(userId);
    
    return data as UserCalendar;
  } catch (error) {
    console.error("Error in saveUserCalendar:", error);
    throw error;
  }
}

export async function updateUserCalendarVisibility(
  calendarId: string,
  isVisible: boolean
): Promise<void> {
  try {
    const { error, data } = await getSupabase()
      .from("user_calendars")
      .update({ 
        is_visible: isVisible,
        updated_at: new Date().toISOString()
      })
      .eq("id", calendarId)
      .select("user_id")
      .single();

    if (error) {
      console.error("Error updating calendar visibility:", error);
      throw error;
    }
    
    if (data) {
      // Invalidate user calendars cache
      cache.invalidateUserCalendarsCache(data.user_id);
    }
    
  } catch (error) {
    console.error("Error in updateUserCalendarVisibility:", error);
    throw error;
  }
} 