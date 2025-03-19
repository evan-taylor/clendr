import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types for UI state
interface UiState {
  // Sidebar state
  isSidebarOpen: boolean;
  sidebarWidth: number;
  
  // Modal states
  activeModal: 'event' | 'task' | 'settings' | 'sync' | null;
  
  // Mobile responsive state
  isMobile: boolean;
  
  // Theme state
  theme: 'light' | 'dark' | 'system';
  
  // Notification state
  notifications: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    autoHide?: boolean;
    hideAfter?: number; // milliseconds
  }[];
  
  // Tour/onboarding state
  isFirstVisit: boolean;
  completedTourSteps: string[];
  
  // Layout preferences
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  showWeekends: boolean;
  startOfWeek: 0 | 1 | 6; // 0 = Sunday, 1 = Monday, 6 = Saturday
  
  // Search state
  searchQuery: string;
  isSearchOpen: boolean;
}

// Initial state
const initialState: UiState = {
  isSidebarOpen: true,
  sidebarWidth: 280,
  activeModal: null,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  theme: 'system',
  notifications: [],
  isFirstVisit: true,
  completedTourSteps: [],
  layoutDensity: 'comfortable',
  showWeekends: true,
  startOfWeek: 0,
  searchQuery: '',
  isSearchOpen: false,
};

// Create the UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<UiState['activeModal']>) => {
      state.activeModal = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      // Auto-close sidebar on mobile
      if (action.payload) {
        state.isSidebarOpen = false;
      }
    },
    setTheme: (state, action: PayloadAction<UiState['theme']>) => {
      state.theme = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id'>>) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      state.notifications.push({
        ...action.payload,
        id,
        // Default auto-hide to true and hideAfter to 5000ms if not specified
        autoHide: action.payload.autoHide ?? true,
        hideAfter: action.payload.hideAfter ?? 5000,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    setIsFirstVisit: (state, action: PayloadAction<boolean>) => {
      state.isFirstVisit = action.payload;
    },
    addCompletedTourStep: (state, action: PayloadAction<string>) => {
      if (!state.completedTourSteps.includes(action.payload)) {
        state.completedTourSteps.push(action.payload);
      }
    },
    resetTour: (state) => {
      state.completedTourSteps = [];
      state.isFirstVisit = true;
    },
    setLayoutDensity: (state, action: PayloadAction<UiState['layoutDensity']>) => {
      state.layoutDensity = action.payload;
    },
    setShowWeekends: (state, action: PayloadAction<boolean>) => {
      state.showWeekends = action.payload;
    },
    setStartOfWeek: (state, action: PayloadAction<UiState['startOfWeek']>) => {
      state.startOfWeek = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSearchOpen: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    resetUiState: () => initialState,
  },
});

// Export actions and reducer
export const {
  toggleSidebar,
  setSidebarWidth,
  setActiveModal,
  setIsMobile,
  setTheme,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setIsFirstVisit,
  addCompletedTourStep,
  resetTour,
  setLayoutDensity,
  setShowWeekends,
  setStartOfWeek,
  setSearchQuery,
  toggleSearchOpen,
  setSearchOpen,
  resetUiState,
} = uiSlice.actions;

export default uiSlice.reducer; 