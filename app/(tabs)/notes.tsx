import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNotesStore } from '@/stores/notesStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { Tables } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type Note = Tables<'notes'>;

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
});

type NoteForm = z.infer<typeof noteSchema>;

function NotesContent() {
  const { session } = useAuthStore();
  const { 
    notes, 
    error, 
    searchQuery, 
    fetchNotes, 
    createNote,
    updateNote,
    deleteNote, 
    setSearchQuery, 
    getFilteredNotes,
    subscribeToNotes,
  } = useNotesStore();
  const { refreshing, setRefreshing, showToast, showConfirmDialog } = useUIStore();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (session) {
      fetchNotes();
      const unsubscribe = subscribeToNotes();
      return unsubscribe;
    }
  }, [session]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  }, []);

  const handleDeleteNote = useCallback(async (note: Note) => {
    showConfirmDialog({
      title: 'Delete Note',
      message: `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: '#ff4444',
      icon: 'trash-outline',
      onConfirm: async () => {
        const success = await deleteNote(note.id);
        if (success) {
          showToast('Note deleted successfully', 'success');
        } else {
          showToast('Failed to delete note', 'error');
        }
      },
    });
  }, [deleteNote, showToast, showConfirmDialog]);

  const handleCreateNote = useCallback(() => {
    setEditingNote(null);
    reset({ title: '', content: '' });
    setIsEditorVisible(true);
  }, [reset]);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    reset({ title: note.title, content: note.content });
    setIsEditorVisible(true);
  }, [reset]);

  const handleSaveNote = async (data: NoteForm) => {
    try {
      if (editingNote) {
        // Update existing note
        const updatedNote = await updateNote(editingNote.id, data);
        if (updatedNote) {
          showToast('Note updated successfully', 'success');
          setIsEditorVisible(false);
          reset({ title: '', content: '' });
        }
      } else {
        // Create new note
        const newNote = await createNote(data);
        if (newNote) {
          showToast('Note created successfully', 'success');
          setIsEditorVisible(false);
          reset({ title: '', content: '' });
        }
      }
    } catch (error) {
      showToast('Failed to save note', 'error');
    }
  };

  const handleCloseEditor = () => {
    setIsEditorVisible(false);
    setEditingNote(null);
    reset({ title: '', content: '' });
  };

  const filteredNotes = getFilteredNotes();

  const renderNote = useCallback(({ item: note }: { item: Note }) => (
    <View style={styles.noteCard}>
      <TouchableOpacity
        style={styles.noteContent}
        onPress={() => handleEditNote(note)}
      >
        <Text style={styles.noteTitle} numberOfLines={1}>
          {note.title}
        </Text>
        <Text style={styles.notePreview} numberOfLines={2}>
          {note.content}
        </Text>
        <Text style={styles.noteDate}>
          {new Date(note.updated_at).toLocaleDateString()} • {' '}
          {new Date(note.updated_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </TouchableOpacity>
      <View style={styles.noteActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditNote(note)}
        >
          <Ionicons name="create-outline" size={18} color="#ffd33d" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNote(note)}
        >
          <Ionicons name="trash-outline" size={18} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  ), [handleEditNote, handleDeleteNote]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>My Notes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Ionicons 
              name={isSearchVisible ? "close" : "search"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCreateNote}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#666" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No notes found' : 'No notes yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Create your first note to get started'
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNote}>
          <Ionicons name="add" size={20} color="#25292e" />
          <Text style={styles.createButtonText}>Create Note</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ff4444" />
        <Text style={styles.errorText}>Failed to load notes</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNotes}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredNotes.length === 0 ? styles.emptyListContent : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffd33d"
            colors={["#ffd33d"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      
      {filteredNotes.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateNote}
        >
          <Ionicons name="add" size={24} color="#25292e" />
        </TouchableOpacity>
      )}

      {/* Note Editor Modal */}
      <Modal
        visible={isEditorVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseEditor}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingNote ? 'Edit Note' : 'New Note'}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSubmit(handleSaveNote)}
              disabled={!isValid}
            >
              <Text style={[styles.saveText, !isValid && styles.disabledText]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.editorContent}>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.titleInput, errors.title && styles.inputError]}
                    placeholder="Note title..."
                    placeholderTextColor="#666"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoFocus
                  />
                )}
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.contentInput, errors.content && styles.inputError]}
                    placeholder="Write your note here..."
                    placeholderTextColor="#666"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    textAlignVertical="top"
                  />
                )}
              />
              {errors.content && (
                <Text style={styles.errorText}>{errors.content.message}</Text>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

export default function NotesScreen() {
  return (
    <AuthGuard>
      <NotesContent />
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 16,
  },
  clearButton: {
    marginLeft: 12,
  },
  noteCard: {
    backgroundColor: '#333',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ffd33d',
  },
  noteContent: {
    flex: 1,
    padding: 16,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  noteActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 211, 61, 0.1)',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#ffd33d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#25292e',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffd33d',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#25292e',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ffd33d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#25292e',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#ffd33d',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelText: {
    fontSize: 16,
    color: '#fff',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#25292e',
  },
  disabledText: {
    opacity: 0.5,
  },
  editorContent: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    minHeight: 60,
  },
  contentInput: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
  },
});