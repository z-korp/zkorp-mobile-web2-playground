import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  theme: 'light' | 'dark' | 'auto';
  modals: {
    deleteNote: boolean;
    createNote: boolean;
    editNote: boolean;
  };
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }>;
  refreshing: boolean;
  confirmDialog: {
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmColor: string;
    icon: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  };
}

interface UIActions {
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  showToast: (message: string, type?: UIState['toasts'][0]['type'], duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  setRefreshing: (refreshing: boolean) => void;
  showConfirmDialog: (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    icon?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  hideConfirmDialog: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  isLoading: false,
  theme: 'auto',
  modals: {
    deleteNote: false,
    createNote: false,
    editNote: false,
  },
  toasts: [],
  refreshing: false,
  confirmDialog: {
    visible: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: '#ff4444',
    icon: 'alert-circle-outline',
    onConfirm: undefined,
    onCancel: undefined,
  },

  // Actions
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setTheme: (theme) => {
    set({ theme });
  },

  openModal: (modal) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modal]: true,
      },
    }));
  },

  closeModal: (modal) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modal]: false,
      },
    }));
  },

  closeAllModals: () => {
    set({
      modals: {
        deleteNote: false,
        createNote: false,
        editNote: false,
      },
    });
  },

  showToast: (message, type = 'info', duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast = { id, message, type, duration };

    set(state => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-hide toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, duration);
    }
  },

  hideToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  setRefreshing: (refreshing) => {
    set({ refreshing });
  },

  showConfirmDialog: (config) => {
    set({
      confirmDialog: {
        visible: true,
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || 'Confirm',
        cancelText: config.cancelText || 'Cancel',
        confirmColor: config.confirmColor || '#ff4444',
        icon: config.icon || 'alert-circle-outline',
        onConfirm: config.onConfirm,
        onCancel: config.onCancel || (() => get().hideConfirmDialog()),
      },
    });
  },

  hideConfirmDialog: () => {
    set({
      confirmDialog: {
        visible: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmColor: '#ff4444',
        icon: 'alert-circle-outline',
        onConfirm: undefined,
        onCancel: undefined,
      },
    });
  },
}));