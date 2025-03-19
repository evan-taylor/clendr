import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { addTask, deleteTask, setTasks, updateTask } from '../slices/tasksSlice';
import { Task } from '../slices/tasksSlice';
import { offlineStorage } from '@/lib/offlineStorage';
import { addNotification } from '../slices/uiSlice';
import { isOnline } from '@/utils/serviceWorker';

/**
 * Fetch tasks from storage and API
 */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({
    forceRefresh = false
  }: { 
    forceRefresh?: boolean;
  } = {}, { dispatch, rejectWithValue }) => {
    try {
      // First try to get tasks from IndexedDB
      const storedTasks = await offlineStorage.getAll<Task>('tasks');
      
      // If we have stored tasks and don't need to refresh, return them
      if (storedTasks.length > 0 && !forceRefresh) {
        dispatch(setTasks(storedTasks));
        
        // If we're offline, just return what we have
        if (!isOnline()) {
          dispatch(addNotification({
            type: 'info',
            message: 'You are offline. Showing cached tasks.',
            autoHide: true,
          }));
          return storedTasks;
        }
      }
      
      // If we need fresh data and we're online, fetch from API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
        const apiTasks: Task[] = [];
        
        // If we got tasks from the API, store them in IndexedDB
        if (apiTasks.length > 0) {
          for (const task of apiTasks) {
            await offlineStorage.set('tasks', task.id, task, { syncStatus: 'synced' });
          }
        }
        
        // Return the API tasks
        dispatch(setTasks(apiTasks));
        return apiTasks;
      }
      
      // If we're offline and have no stored tasks, return an empty array
      dispatch(setTasks([]));
      dispatch(addNotification({
        type: 'warning',
        message: 'You are offline. Unable to fetch tasks.',
        autoHide: true,
      }));
      return [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to fetch tasks.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }
);

/**
 * Create a new task
 */
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, { dispatch, rejectWithValue }) => {
    try {
      const now = new Date();
      const newTask: Task = {
        ...taskData,
        id: uuidv4(), // Generate a new ID
        createdAt: now,
        updatedAt: now
      };
      
      // Store in IndexedDB
      await offlineStorage.set('tasks', newTask.id, newTask, { syncStatus: 'pending' });
      
      // Add to Redux state
      dispatch(addTask(newTask));
      
      // If online, sync to API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
        
        // Mark as synced in IndexedDB
        await offlineStorage.set('tasks', newTask.id, newTask, { syncStatus: 'synced' });
      } else {
        // If offline, register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-tasks');
        }
        
        dispatch(addNotification({
          type: 'info',
          message: 'Task created offline. It will sync when you reconnect.',
          autoHide: true,
        }));
      }
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create task.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create task');
    }
  }
);

/**
 * Update an existing task
 */
export const updateTaskItem = createAsyncThunk(
  'tasks/updateTask',
  async (taskData: Partial<Task> & { id: string }, { dispatch, getState, rejectWithValue }) => {
    try {
      // Get the current task state to merge with updates
      const state = getState() as { tasks: { tasks: Task[] } };
      const existingTask = state.tasks.tasks.find(task => task.id === taskData.id);
      
      if (!existingTask) {
        throw new Error(`Task with ID ${taskData.id} not found`);
      }
      
      const updatedTask: Task = {
        ...existingTask,
        ...taskData,
        updatedAt: new Date()
      };
      
      // Store in IndexedDB
      await offlineStorage.set('tasks', updatedTask.id, updatedTask, { syncStatus: 'pending' });
      
      // Update Redux state
      dispatch(updateTask(updatedTask));
      
      // If online, sync to API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
        
        // Mark as synced in IndexedDB
        await offlineStorage.set('tasks', updatedTask.id, updatedTask, { syncStatus: 'synced' });
      } else {
        // If offline, register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-tasks');
        }
        
        dispatch(addNotification({
          type: 'info',
          message: 'Task updated offline. It will sync when you reconnect.',
          autoHide: true,
        }));
      }
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update task.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

/**
 * Toggle task completion status
 */
export const toggleTaskCompletion = createAsyncThunk(
  'tasks/toggleCompletion',
  async (taskId: string, { dispatch, getState, rejectWithValue }) => {
    try {
      // Get the current task state
      const state = getState() as { tasks: { tasks: Task[] } };
      const existingTask = state.tasks.tasks.find(task => task.id === taskId);
      
      if (!existingTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      const updatedTask: Task = {
        ...existingTask,
        completed: !existingTask.completed,
        updatedAt: new Date()
      };
      
      // Store in IndexedDB
      await offlineStorage.set('tasks', updatedTask.id, updatedTask, { syncStatus: 'pending' });
      
      // Update Redux state
      dispatch(updateTask(updatedTask));
      
      // If online, sync to API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
        
        // Mark as synced in IndexedDB
        await offlineStorage.set('tasks', updatedTask.id, updatedTask, { syncStatus: 'synced' });
      } else {
        // If offline, register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-tasks');
        }
      }
      
      return updatedTask;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update task status.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle task completion');
    }
  }
);

/**
 * Delete a task
 */
export const deleteTaskItem = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { dispatch, rejectWithValue }) => {
    try {
      // Delete from IndexedDB
      await offlineStorage.delete('tasks', taskId);
      
      // Update Redux state
      dispatch(deleteTask(taskId));
      
      // If online, sync to API
      if (isOnline()) {
        // This would make an API call in a real implementation
        // For now, we'll just simulate the API response
      } else {
        // If offline, register for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-tasks');
        }
        
        dispatch(addNotification({
          type: 'info',
          message: 'Task deleted offline. It will sync when you reconnect.',
          autoHide: true,
        }));
      }
      
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete task.',
        autoHide: true,
      }));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
); 