import type { Meta, StoryObj } from '@storybook/react-native';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { action } from '@storybook/addon-actions';
import Toast from './Toast';
import { useUIStore } from '../stores/uiStore';

// Wrapper pour permettre l'interaction avec le Toast
const ToastStoryWrapper = () => {
  const { showToast } = useUIStore();

  const handleToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    // Log dans Storybook Actions
    action('toast-shown')({ type, message });
    
    // Log dans console
    console.log(`🍞 Toast shown: ${type} - "${message}"`);
    
    // Afficher le toast
    showToast(message, type, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toast Notifications</Text>
      <Text style={styles.subtitle}>Appuie sur les boutons pour tester les différents types</Text>
      
      <View style={styles.buttonGrid}>
        <TouchableOpacity 
          style={[styles.testButton, styles.successButton]} 
          onPress={() => handleToast('success', 'Opération réussie !')}
        >
          <Text style={styles.buttonText}>✅ Success</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.errorButton]} 
          onPress={() => handleToast('error', 'Une erreur est survenue')}
        >
          <Text style={styles.buttonText}>❌ Error</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.warningButton]} 
          onPress={() => handleToast('warning', 'Attention, vérifiez vos données')}
        >
          <Text style={styles.buttonText}>⚠️ Warning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.infoButton]} 
          onPress={() => handleToast('info', 'Information importante')}
        >
          <Text style={styles.buttonText}>ℹ️ Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.longButton]} 
          onPress={() => handleToast('info', 'Ceci est un message très long qui teste comment le toast gère les textes qui peuvent s\'étendre sur plusieurs lignes dans l\'interface utilisateur.')}
        >
          <Text style={styles.buttonText}>📝 Long Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.multipleButton]} 
          onPress={() => {
            handleToast('success', 'Premier toast');
            setTimeout(() => handleToast('warning', 'Deuxième toast'), 500);
            setTimeout(() => handleToast('error', 'Troisième toast'), 1000);
          }}
        >
          <Text style={styles.buttonText}>🚀 Multiple</Text>
        </TouchableOpacity>
      </View>
      
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonGrid: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  testButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  errorButton: {
    backgroundColor: '#ff4444',
  },
  warningButton: {
    backgroundColor: '#FF9800',
  },
  infoButton: {
    backgroundColor: '#2196F3',
  },
  longButton: {
    backgroundColor: '#9C27B0',
  },
  multipleButton: {
    backgroundColor: '#607D8B',
  },
});

const meta: Meta<typeof ToastStoryWrapper> = {
  title: 'Components/Toast',
  component: ToastStoryWrapper,
  parameters: {
    docs: {
      description: {
        component: 'Système de notifications toast pour l\'application. Supporte 4 types: success, error, warning, info.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interface interactive pour tester tous les types de toast. Regarde l\'onglet Actions pour voir les logs.',
      },
    },
  },
};