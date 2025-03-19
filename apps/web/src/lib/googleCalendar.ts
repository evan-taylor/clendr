import { createClient } from '@/utils/supabase/client';
import { 
  addHours, 
  format, 
  parse, 
  formatISO, 
  addDays, 
  parseISO, 
  startOfDay, 
  endOfDay,
  isSameDay 
} from "date-fns";
import { CalendarEvent } from '@/components/Calendar/types';

// Constants
const GOOGLE_API_BASE_URL = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_OAUTH_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const RATE_LIMIT_RETRY_DELAY = 2000; // ms to wait when rate limited
const MAX_RETRIES = 3;

// Get Supabase client
const getSupabase = () => createClient();

// Interfaces
export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  primary?: boolean;
  selected?: boolean;
  accessRole?: string;
}

export interface UserCalendar {
  id: string;
  user_id: string;
  calendar_id: string;
  name: string;
  description?: string;
  color: string;
  is_visible: boolean;
  access_token?: string;
  refresh_token?: string;
  token_expiry?: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  colorId?: string;
  created?: string;
  updated?: string;
  creator?: {
    email?: string;
    displayName?: string;
  };
  organizer?: {
    email?: string;
    displayName?: string;
  };
  status?: string;
  // Additional fields that may be added during normalization
  start_time?: string | Date;
  end_time?: string | Date;
  is_all_day?: boolean;
  calendar?: {
    id: string;
    name: string;
    color: string;
  };
}

/**
 * Modern caching implementation using a combination of memory cache and IndexedDB
 * for persistence between sessions.
 */
class CalendarCache {
  private static instance: CalendarCache;
  private memoryCache: Map<string, { data: any, expiry: number }> = new Map();
  private DB_NAME = 'calendarCache';
  private DB_VERSION = 1;
  private STORE_NAME = 'cache';
  private TTL = 5 * 60 * 1000; // 5 minutes default
  
  private constructor() {}
  
  public static getInstance(): CalendarCache {
    if (!CalendarCache.instance) {
      CalendarCache.instance = new CalendarCache();
    }
    return CalendarCache.instance;
  }
  
  /**
   * Initialize IndexedDB
   */
  private async getDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = (event) => {
        reject('Error opening IndexedDB');
      };
      
      request.onsuccess = (event) => {
        resolve(request.result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
        }
      };
    });
  }
  
  /**
   * Get item from cache, checking memory first then IndexedDB
   */
  public async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memItem = this.memoryCache.get(key);
    if (memItem && memItem.expiry > Date.now()) {
      return memItem.data as T;
    }
    
    // If not in memory, check IndexedDB
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const transaction = db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.expiry > Date.now()) {
            // Add back to memory cache
            this.memoryCache.set(key, {
              data: result.data,
              expiry: result.expiry
            });
            resolve(result.data as T);
          } else {
            // Item expired or not found
            if (result) {
              this.delete(key); // Clean up expired item
            }
            resolve(null);
          }
        };
        
        request.onerror = () => {
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Error retrieving from IndexedDB:', error);
      return null;
    }
  }
  
  /**
   * Set item in both memory cache and IndexedDB
   */
  public async set<T>(key: string, data: T, ttl: number = this.TTL): Promise<void> {
    const expiry = Date.now() + ttl;
    
    // Set in memory cache
    this.memoryCache.set(key, { data, expiry });
    
    // Set in IndexedDB
    try {
      const db = await this.getDb();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.put({ key, data, expiry });
    } catch (error) {
      console.error('Error storing in IndexedDB:', error);
    }
  }
  
  /**
   * Delete item from both memory cache and IndexedDB
   */
  public async delete(key: string): Promise<void> {
    // Remove from memory cache
    this.memoryCache.delete(key);
    
    // Remove from IndexedDB
    try {
      const db = await this.getDb();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.delete(key);
    } catch (error) {
      console.error('Error deleting from IndexedDB:', error);
    }
  }
  
  /**
   * Delete all items matching a prefix
   */
  public async deleteByPrefix(prefix: string): Promise<void> {
    // Remove from memory cache
    Array.from(this.memoryCache.keys()).forEach(key => {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    });
    
    // Remove from IndexedDB
    try {
      const db = await this.getDb();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = request.result;
        if (cursor) {
          if (cursor.key.toString().startsWith(prefix)) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('Error deleting by prefix from IndexedDB:', error);
    }
  }
  
  /**
   * Clear all cache data
   */
  public async clear(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear();
    
    // Clear IndexedDB
    try {
      const db = await this.getDb();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.clear();
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  }
}

// Cache instance
const cache = CalendarCache.getInstance();

/**
 * Refresh an expired Google OAuth token using the refresh token
 */
export async function refreshGoogleToken(refreshToken: string): Promise<{ 
  access_token: string; 
  expires_in: number;
}> {
  try {
    const response = await fetch(GOOGLE_OAUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to refresh token: ${response.status} ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in
    };
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    throw error;
  }
}

/**
 * Ensure we have a valid access token, refreshing if necessary
 */
export async function ensureValidToken(
  userId: string,
  calendarId: string
): Promise<string> {
  try {
    const supabase = getSupabase();
    
    // Get the calendar with tokens
    const { data: calendar, error } = await supabase
      .from('user_calendars')
      .select('*')
      .eq('user_id', userId)
      .eq('calendar_id', calendarId)
      .single();
    
    if (error || !calendar) {
      throw new Error('Calendar not found');
    }
    
    // Check if token is expired or missing
    const tokenExpiry = calendar.token_expiry ? new Date(calendar.token_expiry) : null;
    const now = new Date();
    
    if (!calendar.access_token || !tokenExpiry || tokenExpiry <= now) {
      // Token is expired, refresh it
      if (!calendar.refresh_token) {
        throw new Error('No refresh token available');
      }
      
      const { access_token, expires_in } = await refreshGoogleToken(calendar.refresh_token);
      
      // Update token in database
      const newExpiry = new Date(now.getTime() + expires_in * 1000);
      await supabase
        .from('user_calendars')
        .update({
          access_token,
          token_expiry: newExpiry.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', calendar.id);
      
      return access_token;
    }
    
    // Return existing valid token
    return calendar.access_token;
  } catch (error) {
    console.error('Error ensuring valid token:', error);
    throw error;
  }
}

/**
 * Make authenticated request to Google Calendar API with retry logic
 */
export async function googleCalendarRequest(
  endpoint: string,
  method: string = 'GET',
  accessToken: string,
  body?: any,
  retryCount: number = 0
): Promise<any> {
  try {
    const url = `${GOOGLE_API_BASE_URL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    
    const options: RequestInit = { method, headers };
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    
    // Handle rate limiting
    if (response.status === 429 && retryCount < MAX_RETRIES) {
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY));
      return googleCalendarRequest(endpoint, method, accessToken, body, retryCount + 1);
    }
    
    // Handle unauthorized (expired token)
    if (response.status === 401) {
      throw new Error('Unauthorized: Token may be expired');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Calendar API error: ${response.status} ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Google Calendar API request failed:', error);
    throw error;
  }
}

/**
 * Normalize Google Calendar event to our application format
 */
export function normalizeGoogleCalendarEvent(
  event: GoogleCalendarEvent,
  calendarInfo?: { id: string, name: string, color: string }
): CalendarEvent {
  let start_time: string | Date = '';
  let end_time: string | Date = '';
  let is_all_day = false;

  // Handle different date formats from Google Calendar
  if (event.start) {
    if (event.start.dateTime) {
      // This is a timed event
      start_time = event.start.dateTime;
    } else if (event.start.date) {
      // This is an all-day event
      start_time = event.start.date;
      is_all_day = true;
    }
  }

  if (event.end) {
    if (event.end.dateTime) {
      end_time = event.end.dateTime;
    } else if (event.end.date) {
      end_time = event.end.date;
    }
  }

  // Ensure we have dates as strings at minimum
  if (!start_time && (event as any).start_time) {
    start_time = (event as any).start_time;
  }
  
  if (!end_time && (event as any).end_time) {
    end_time = (event as any).end_time;
  }

  return {
    id: event.id,
    title: event.summary || '',
    description: event.description || '',
    location: event.location || '',
    start_time,
    end_time,
    is_all_day,
    calendar: calendarInfo || undefined,
    color: calendarInfo?.color,
    // Preserve original Google Calendar fields for reference
    start: event.start,
    end: event.end,
    colorId: event.colorId,
    created: event.created,
    updated: event.updated,
    creator: event.creator,
    organizer: event.organizer,
    status: event.status
  };
}

/**
 * Convert an application event to Google Calendar format
 */
export function convertToGoogleEvent(event: CalendarEvent): Partial<GoogleCalendarEvent> {
  const googleEvent: Partial<GoogleCalendarEvent> = {
    summary: event.title,
    description: event.description,
    location: event.location,
    colorId: event.colorId
  };

  // Set start and end times
  if (event.is_all_day) {
    // All-day event uses date only
    googleEvent.start = {
      date: typeof event.start_time === 'string' 
        ? event.start_time.substring(0, 10) // Extract YYYY-MM-DD
        : format(event.start_time as Date, 'yyyy-MM-dd')
    };
    
    googleEvent.end = {
      date: typeof event.end_time === 'string'
        ? event.end_time.substring(0, 10)
        : format(event.end_time as Date, 'yyyy-MM-dd')
    };
  } else {
    // Timed event uses dateTime
    googleEvent.start = {
      dateTime: typeof event.start_time === 'string'
        ? event.start_time
        : formatISO(event.start_time as Date)
    };
    
    googleEvent.end = {
      dateTime: typeof event.end_time === 'string'
        ? event.end_time
        : formatISO(event.end_time as Date)
    };
  }

  return googleEvent;
}

/**
 * Fetch all calendars from a user's Google account
 */
export async function fetchUserCalendars(accessToken: string): Promise<GoogleCalendar[]> {
  try {
    const cacheKey = `google_calendars_${accessToken.substring(0, 10)}`;
    const cached = await cache.get<GoogleCalendar[]>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const data = await googleCalendarRequest('/users/me/calendarList', 'GET', accessToken);
    const calendars = data.items || [];
    
    // Cache the results for 5 minutes
    await cache.set(cacheKey, calendars);
    
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
          onConflict: 'user_id,calendar_id'
        }
      );

    if (error) {
      throw error;
    }
    
    // Invalidate cache
    await cache.deleteByPrefix(`user_calendars_${userId}`);
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error adding calendar to user:', error);
    throw error;
  }
}

/**
 * Get a user's calendars from the database
 */
export async function getUserCalendars(userId: string): Promise<UserCalendar[]> {
  try {
    const cacheKey = `user_calendars_${userId}`;
    const cached = await cache.get<UserCalendar[]>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const { data, error } = await getSupabase()
      .from('user_calendars')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Cache the results
    await cache.set(cacheKey, data || []);
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user calendars:', error);
    throw error;
  }
}

/**
 * Update a user's calendar in the database
 */
export async function updateUserCalendar(
  calendarId: string,
  updates: Partial<UserCalendar>
): Promise<UserCalendar | null> {
  try {
    const { data, error } = await getSupabase()
      .from('user_calendars')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', calendarId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Get the user ID to invalidate cache
    if (data) {
      await cache.deleteByPrefix(`user_calendars_${data.user_id}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user calendar:', error);
    throw error;
  }
}

/**
 * Delete a user's calendar from the database
 */
export async function deleteUserCalendar(calendarId: string): Promise<void> {
  try {
    // Get the calendar first to get the user ID for cache invalidation
    const { data: calendar, error: fetchError } = await getSupabase()
      .from('user_calendars')
      .select('user_id')
      .eq('id', calendarId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    const { error } = await getSupabase()
      .from('user_calendars')
      .delete()
      .eq('id', calendarId);
    
    if (error) {
      throw error;
    }
    
    // Invalidate cache
    if (calendar) {
      await cache.deleteByPrefix(`user_calendars_${calendar.user_id}`);
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
  userId: string,
  calendarId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    const cacheKey = `calendar_events_${calendarId}_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    const cached = await cache.get<CalendarEvent[]>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    // Get an active token
    const accessToken = await ensureValidToken(userId, calendarId);
    
    // Get calendar info for event normalization
    const { data: calendar, error: calendarError } = await getSupabase()
      .from('user_calendars')
      .select('id, name, color')
      .eq('user_id', userId)
      .eq('calendar_id', calendarId)
      .single();
    
    if (calendarError) {
      throw calendarError;
    }
    
    const calendarInfo = calendar ? {
      id: calendarId,
      name: calendar.name,
      color: calendar.color
    } : undefined;
    
    // Format dates for API
    const timeMin = formatISO(startDate);
    const timeMax = formatISO(endDate);
    
    // Fetch events from Google Calendar API
    const endpoint = `/calendars/${encodeURIComponent(calendarId)}/events?` + 
      `timeMin=${encodeURIComponent(timeMin)}` +
      `&timeMax=${encodeURIComponent(timeMax)}` +
      `&singleEvents=true` + 
      `&maxResults=2500`;
    
    const data = await googleCalendarRequest(endpoint, 'GET', accessToken);
    
    // Normalize events to our app format
    const events = (data.items || []).map((event: GoogleCalendarEvent) => 
      normalizeGoogleCalendarEvent(event, calendarInfo)
    );
    
    // Cache the normalized events
    await cache.set(cacheKey, events);
    
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
  userId: string,
  calendarId: string,
  event: CalendarEvent
): Promise<CalendarEvent> {
  try {
    // Get an active token
    const accessToken = await ensureValidToken(userId, calendarId);
    
    // Convert to Google Calendar format
    const googleEvent = convertToGoogleEvent(event);
    
    // Create the event via API
    const endpoint = `/calendars/${encodeURIComponent(calendarId)}/events`;
    const data = await googleCalendarRequest(endpoint, 'POST', accessToken, googleEvent);
    
    // Get calendar info for normalization
    const { data: calendar } = await getSupabase()
      .from('user_calendars')
      .select('id, name, color')
      .eq('user_id', userId)
      .eq('calendar_id', calendarId)
      .single();
    
    const calendarInfo = calendar ? {
      id: calendarId,
      name: calendar.name,
      color: calendar.color
    } : undefined;
    
    // Normalize the returned event
    const createdEvent = normalizeGoogleCalendarEvent(data, calendarInfo);
    
    // Invalidate cache for affected date range
    if (event.start_time && event.end_time) {
      const startDate = typeof event.start_time === 'string' 
        ? parseISO(event.start_time) 
        : event.start_time;
      const endDate = typeof event.end_time === 'string'
        ? parseISO(event.end_time)
        : event.end_time;
      
      await cache.deleteByPrefix(`calendar_events_${calendarId}`);
    }
    
    return createdEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Update an event in a Google Calendar
 */
export async function updateCalendarEvent(
  userId: string,
  calendarId: string,
  eventId: string,
  event: CalendarEvent
): Promise<CalendarEvent> {
  try {
    // Get an active token
    const accessToken = await ensureValidToken(userId, calendarId);
    
    // Convert to Google Calendar format
    const googleEvent = convertToGoogleEvent(event);
    
    // Update the event via API
    const endpoint = `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;
    const data = await googleCalendarRequest(endpoint, 'PUT', accessToken, googleEvent);
    
    // Get calendar info for normalization
    const { data: calendar } = await getSupabase()
      .from('user_calendars')
      .select('id, name, color')
      .eq('user_id', userId)
      .eq('calendar_id', calendarId)
      .single();
    
    const calendarInfo = calendar ? {
      id: calendarId,
      name: calendar.name,
      color: calendar.color
    } : undefined;
    
    // Normalize the returned event
    const updatedEvent = normalizeGoogleCalendarEvent(data, calendarInfo);
    
    // Invalidate cache for affected date range
    if (event.start_time && event.end_time) {
      await cache.deleteByPrefix(`calendar_events_${calendarId}`);
    }
    
    return updatedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Delete an event from a Google Calendar
 */
export async function deleteCalendarEvent(
  userId: string,
  calendarId: string,
  eventId: string
): Promise<void> {
  try {
    // Get an active token
    const accessToken = await ensureValidToken(userId, calendarId);
    
    // Delete the event via API
    const endpoint = `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;
    await googleCalendarRequest(endpoint, 'DELETE', accessToken);
    
    // Invalidate cache
    await cache.deleteByPrefix(`calendar_events_${calendarId}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * Batch fetch events from multiple calendars
 */
export async function fetchEventsFromMultipleCalendars(
  userId: string,
  calendarIds: string[],
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    // Use Promise.allSettled to fetch from all calendars without failing if one fails
    const results = await Promise.allSettled(
      calendarIds.map(calendarId => 
        fetchCalendarEvents(userId, calendarId, startDate, endDate)
      )
    );
    
    // Collect successful results
    const events: CalendarEvent[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        events.push(...result.value);
      } else {
        console.error(`Failed to fetch events for calendar ${calendarIds[index]}:`, result.reason);
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events from multiple calendars:', error);
    throw error;
  }
}

/**
 * Get all visible calendars for a user and fetch their events
 */
export async function fetchAllVisibleEvents(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    // Get all visible calendars
    const calendars = await getUserCalendars(userId);
    const visibleCalendars = calendars.filter(cal => cal.is_visible);
    
    if (visibleCalendars.length === 0) {
      return [];
    }
    
    // Fetch events from all visible calendars
    return fetchEventsFromMultipleCalendars(
      userId,
      visibleCalendars.map(cal => cal.calendar_id),
      startDate,
      endDate
    );
  } catch (error) {
    console.error('Error fetching all visible events:', error);
    throw error;
  }
}

/**
 * Update a calendar's visibility
 */
export async function updateCalendarVisibility(
  id: string,
  isVisible: boolean
): Promise<void> {
  try {
    // Get the calendar first for cache invalidation
    const { data: calendar, error: fetchError } = await getSupabase()
      .from('user_calendars')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    const { error } = await getSupabase()
      .from('user_calendars')
      .update({
        is_visible: isVisible,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    // Invalidate cache
    if (calendar) {
      await cache.deleteByPrefix(`user_calendars_${calendar.user_id}`);
    }
  } catch (error) {
    console.error('Error updating calendar visibility:', error);
    throw error;
  }
} 