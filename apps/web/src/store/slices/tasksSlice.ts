import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types for task management
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: number; // in minutes
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTask: Task | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  filterSettings: {
    showCompleted: boolean;
    priorityFilter: ('low' | 'medium' | 'high')[] | null;
    categoryFilter: string | null;
    searchTerm: string;
    dateRange: {
      startDate: Date | null;
      endDate: Date | null;
    };
  };
  lastSynced: string | null; // Timestamp of last sync for offline support
}

// Initial state
const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
  selectedTask: null,
  categories: [],
  isLoading: false,
  error: null,
  filterSettings: {
    showCompleted: false,
    priorityFilter: null,
    categoryFilter: null,
    searchTerm: '',
    dateRange: {
      startDate: null,
      endDate: null,
    },
  },
  lastSynced: null,
};

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // For now, just mocking the response
      // In a real implementation, this would fetch from the API or IndexedDB
      return [] as Task[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }
);

// Apply filters to tasks
const applyFilters = (tasks: Task[], filterSettings: TasksState['filterSettings']) => {
  let result = [...tasks];
  
  // Filter by completion status
  if (!filterSettings.showCompleted) {
    result = result.filter(task => !task.completed);
  }
  
  // Filter by priority
  if (filterSettings.priorityFilter && filterSettings.priorityFilter.length > 0) {
    result = result.filter(task => 
      filterSettings.priorityFilter?.includes(task.priority)
    );
  }
  
  // Filter by category
  if (filterSettings.categoryFilter) {
    result = result.filter(task => 
      task.category === filterSettings.categoryFilter
    );
  }
  
  // Filter by search term
  if (filterSettings.searchTerm) {
    const searchTerm = filterSettings.searchTerm.toLowerCase();
    result = result.filter(task => 
      task.title.toLowerCase().includes(searchTerm) || 
      (task.description?.toLowerCase().includes(searchTerm) || false)
    );
  }
  
  // Filter by date range
  if (filterSettings.dateRange.startDate || filterSettings.dateRange.endDate) {
    result = result.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      
      if (filterSettings.dateRange.startDate && filterSettings.dateRange.endDate) {
        return dueDate >= filterSettings.dateRange.startDate && 
               dueDate <= filterSettings.dateRange.endDate;
      } else if (filterSettings.dateRange.startDate) {
        return dueDate >= filterSettings.dateRange.startDate;
      } else if (filterSettings.dateRange.endDate) {
        return dueDate <= filterSettings.dateRange.endDate!;
      }
      
      return true;
    });
  }
  
  return result;
};

// Create the tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.filteredTasks = applyFilters(action.payload, state.filterSettings);
      
      // Extract categories from tasks
      const uniqueCategories = new Set<string>();
      action.payload.forEach(task => {
        if (task.category) uniqueCategories.add(task.category);
      });
      state.categories = Array.from(uniqueCategories);
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      
      // Update categories if needed
      if (action.payload.category && !state.categories.includes(action.payload.category)) {
        state.categories.push(action.payload.category);
      }
      
      // Update filtered tasks
      state.filteredTasks = applyFilters(state.tasks, state.filterSettings);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        
        // Update categories if needed
        if (action.payload.category && !state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
      }
      
      // Update filtered tasks
      state.filteredTasks = applyFilters(state.tasks, state.filterSettings);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      
      // Recalculate categories
      const uniqueCategories = new Set<string>();
      state.tasks.forEach(task => {
        if (task.category) uniqueCategories.add(task.category);
      });
      state.categories = Array.from(uniqueCategories);
      
      // Update filtered tasks
      state.filteredTasks = applyFilters(state.tasks, state.filterSettings);
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].completed = !state.tasks[index].completed;
        state.tasks[index].updatedAt = new Date();
      }
      
      // Update filtered tasks
      state.filteredTasks = applyFilters(state.tasks, state.filterSettings);
    },
    setFilterSettings: (state, action: PayloadAction<Partial<TasksState['filterSettings']>>) => {
      state.filterSettings = { ...state.filterSettings, ...action.payload };
      state.filteredTasks = applyFilters(state.tasks, state.filterSettings);
    },
    resetFilters: (state) => {
      state.filterSettings = initialState.filterSettings;
      state.filteredTasks = applyFilters(state.tasks, initialState.filterSettings);
    },
    setLastSynced: (state) => {
      state.lastSynced = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.filteredTasks = applyFilters(action.payload, state.filterSettings);
        
        // Extract categories from tasks
        const uniqueCategories = new Set<string>();
        action.payload.forEach(task => {
          if (task.category) uniqueCategories.add(task.category);
        });
        state.categories = Array.from(uniqueCategories);
        
        state.isLoading = false;
        state.lastSynced = new Date().toISOString();
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  toggleTaskCompletion,
  setFilterSettings,
  resetFilters,
  setLastSynced,
} = tasksSlice.actions;

export default tasksSlice.reducer; 