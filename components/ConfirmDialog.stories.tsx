import type { Meta, StoryObj } from '@storybook/react-native';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { action } from '@storybook/addon-actions';
import ConfirmDialog from './ConfirmDialog';
import { useState } from 'react';

// Wrapper pour permettre l'interaction avec le dialog
const ConfirmDialogStoryWrapper = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = '#ff4444',
  icon = 'alert-circle-outline',
  storyType = 'single'
}: {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  icon?: any;
  storyType?: 'single' | 'showcase';
}) => {
  const [visible, setVisible] = useState(false);
  const [multipleVisible, setMultipleVisible] = useState({
    delete: false,
    logout: false,
    save: false,
    warning: false,
  });

  const handleConfirm = (type: string) => {
    action('dialog-confirmed')(type);
    console.log(`✅ Dialog confirmed: ${type}`);
    Alert.alert('Confirmed', `${type} action confirmed!`);
    setVisible(false);
    setMultipleVisible(prev => ({ ...prev, [type]: false }));
  };

  const handleCancel = (type: string) => {
    action('dialog-cancelled')(type);
    console.log(`❌ Dialog cancelled: ${type}`);
    setVisible(false);
    setMultipleVisible(prev => ({ ...prev, [type]: false }));
  };

  if (storyType === 'showcase') {
    return (
      <View style={styles.showcaseContainer}>
        <Text style={styles.showcaseTitle}>Confirm Dialog Variants</Text>
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity 
            style={[styles.triggerButton, { backgroundColor: '#ff4444' }]}
            onPress={() => setMultipleVisible(prev => ({ ...prev, delete: true }))}
          >
            <Text style={styles.triggerButtonText}>🗑️ Delete Action</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.triggerButton, { backgroundColor: '#FF9800' }]}
            onPress={() => setMultipleVisible(prev => ({ ...prev, logout: true }))}
          >
            <Text style={styles.triggerButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.triggerButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => setMultipleVisible(prev => ({ ...prev, save: true }))}
          >
            <Text style={styles.triggerButtonText}>💾 Save Changes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.triggerButton, { backgroundColor: '#FF5722' }]}
            onPress={() => setMultipleVisible(prev => ({ ...prev, warning: true }))}
          >
            <Text style={styles.triggerButtonText}>⚠️ Warning</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Dialog */}
        <ConfirmDialog
          visible={multipleVisible.delete}
          title="Supprimer l'élément"
          message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          confirmColor="#ff4444"
          icon="trash-outline"
          onConfirm={() => handleConfirm('delete')}
          onCancel={() => handleCancel('delete')}
        />

        {/* Logout Dialog */}
        <ConfirmDialog
          visible={multipleVisible.logout}
          title="Se déconnecter"
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
          confirmText="Se déconnecter"
          cancelText="Rester connecté"
          confirmColor="#FF9800"
          icon="log-out-outline"
          onConfirm={() => handleConfirm('logout')}
          onCancel={() => handleCancel('logout')}
        />

        {/* Save Dialog */}
        <ConfirmDialog
          visible={multipleVisible.save}
          title="Sauvegarder les modifications"
          message="Vous avez des modifications non sauvegardées. Voulez-vous les sauvegarder ?"
          confirmText="Sauvegarder"
          cancelText="Ignorer"
          confirmColor="#4CAF50"
          icon="save-outline"
          onConfirm={() => handleConfirm('save')}
          onCancel={() => handleCancel('save')}
        />

        {/* Warning Dialog */}
        <ConfirmDialog
          visible={multipleVisible.warning}
          title="Action risquée"
          message="Cette action pourrait affecter d'autres utilisateurs. Voulez-vous continuer ?"
          confirmText="Continuer"
          cancelText="Annuler"
          confirmColor="#FF5722"
          icon="warning-outline"
          onConfirm={() => handleConfirm('warning')}
          onCancel={() => handleCancel('warning')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.openButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.openButtonText}>Ouvrir la boîte de dialogue</Text>
      </TouchableOpacity>
      
      <ConfirmDialog
        visible={visible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        confirmColor={confirmColor}
        icon={icon}
        onConfirm={() => handleConfirm('single')}
        onCancel={() => handleCancel('single')}
      />
    </View>
  );
};

const meta: Meta<typeof ConfirmDialogStoryWrapper> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialogStoryWrapper,
  parameters: {
    docs: {
      description: {
        component: 'Dialog de confirmation réutilisable avec différents styles et icônes. Supporte les actions confirm/cancel avec callbacks.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DeleteConfirmation: Story = {
  args: {
    title: 'Supprimer l\'élément',
    message: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    confirmColor: '#ff4444',
    icon: 'trash-outline',
  },
};

export const LogoutConfirmation: Story = {
  args: {
    title: 'Se déconnecter',
    message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    confirmText: 'Se déconnecter',
    cancelText: 'Rester connecté',
    confirmColor: '#FF9800',
    icon: 'log-out-outline',
  },
};

export const SaveChanges: Story = {
  args: {
    title: 'Sauvegarder les modifications',
    message: 'Vous avez des modifications non sauvegardées. Voulez-vous les sauvegarder ?',
    confirmText: 'Sauvegarder',
    cancelText: 'Ignorer',
    confirmColor: '#4CAF50',
    icon: 'save-outline',
  },
};

export const Warning: Story = {
  args: {
    title: 'Action risquée',
    message: 'Cette action pourrait affecter d\'autres utilisateurs. Voulez-vous continuer ?',
    confirmText: 'Continuer',
    cancelText: 'Annuler',
    confirmColor: '#FF5722',
    icon: 'warning-outline',
  },
};

export const AllVariants: Story = {
  args: {
    storyType: 'showcase',
    title: '', // Pas utilisé dans showcase
    message: '', // Pas utilisé dans showcase
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#25292e',
  },
  openButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  showcaseContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#25292e',
  },
  showcaseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonGrid: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  triggerButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  triggerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});