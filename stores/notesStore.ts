import { create } from 'zustand';
import { supabase, Tables } from '@/lib/supabase';
import { useAuthStore } from './authStore';

type Note = Tables<'notes'>;

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedNote: Note | null;
}

interface NotesActions {
  fetchNotes: () => Promise<void>;
  createNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Note | null>;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setSelectedNote: (note: Note | null) => void;
  getFilteredNotes: () => Note[];
  subscribeToNotes: () => () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type NotesStore = NotesState & NotesActions;

export const useNotesStore = create<NotesStore>((set, get) => ({
  // Initial state
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedNote: null,

  // Actions
  fetchNotes: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        set({ error: error.message, loading: false });
        return;
      }

      set({ notes: data || [], loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, loading: false });
    }
  },

  createNote: async (noteData) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'User not authenticated' });
      return null;
    }

    set({ loading: true, error: null });

    // Optimistic update
    const tempNote: Note = {
      id: `temp-${Date.now()}`,
      ...noteData,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set(state => ({
      notes: [tempNote, ...state.notes],
    }));

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        // Rollback optimistic update
        set(state => ({
          notes: state.notes.filter(note => note.id !== tempNote.id),
          error: error.message,
          loading: false,
        }));
        return null;
      }

      // Replace temp note with real note
      set(state => ({
        notes: state.notes.map(note => 
          note.id === tempNote.id ? data : note
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      // Rollback optimistic update
      const message = error instanceof Error ? error.message : 'An error occurred';
      set(state => ({
        notes: state.notes.filter(note => note.id !== tempNote.id),
        error: message,
        loading: false,
      }));
      return null;
    }
  },

  updateNote: async (id, updates) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'User not authenticated' });
      return null;
    }

    set({ loading: true, error: null });

    // Optimistic update
    const originalNote = get().notes.find(note => note.id === id);
    if (!originalNote) {
      set({ error: 'Note not found', loading: false });
      return null;
    }

    const updatedNote: Note = {
      ...originalNote,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    set(state => ({
      notes: state.notes.map(note => 
        note.id === id ? updatedNote : note
      ),
    }));

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        // Rollback optimistic update
        set(state => ({
          notes: state.notes.map(note => 
            note.id === id ? originalNote : note
          ),
          error: error.message,
          loading: false,
        }));
        return null;
      }

      // Update with server response
      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? data : note
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      // Rollback optimistic update
      const message = error instanceof Error ? error.message : 'An error occurred';
      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? originalNote : note
        ),
        error: message,
        loading: false,
      }));
      return null;
    }
  },

  deleteNote: async (id) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'User not authenticated' });
      return false;
    }

    set({ loading: true, error: null });

    // Optimistic update
    const noteToDelete = get().notes.find(note => note.id === id);
    if (!noteToDelete) {
      set({ error: 'Note not found', loading: false });
      return false;
    }

    set(state => ({
      notes: state.notes.filter(note => note.id !== id),
    }));

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        // Rollback optimistic update
        set(state => ({
          notes: [...state.notes, noteToDelete].sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          ),
          error: error.message,
          loading: false,
        }));
        return false;
      }

      set({ loading: false });
      return true;
    } catch (error) {
      // Rollback optimistic update
      const message = error instanceof Error ? error.message : 'An error occurred';
      set(state => ({
        notes: [...state.notes, noteToDelete].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ),
        error: message,
        loading: false,
      }));
      return false;
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedNote: (note) => {
    set({ selectedNote: note });
  },

  getFilteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  },

  subscribeToNotes: () => {
    const { user } = useAuthStore.getState();
    if (!user) return () => {};

    const subscription = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          set(state => {
            let updatedNotes = [...state.notes];

            switch (eventType) {
              case 'INSERT':
                // Only add if not already present (avoid duplicates from optimistic updates)
                if (!updatedNotes.find(note => note.id === newRecord.id)) {
                  updatedNotes = [newRecord as Note, ...updatedNotes];
                }
                break;
              case 'UPDATE':
                updatedNotes = updatedNotes.map(note =>
                  note.id === newRecord.id ? newRecord as Note : note
                );
                break;
              case 'DELETE':
                updatedNotes = updatedNotes.filter(note => note.id !== oldRecord.id);
                break;
            }

            return {
              notes: updatedNotes.sort(
                (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
              ),
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));