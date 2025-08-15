import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { action } from '@storybook/addon-actions';

// Composant Button réutilisable avec plus d'options
const Button = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false 
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}) => {
  const handlePress = () => {
    // Log dans Storybook Actions
    action('button-pressed')({ title, variant, size });
    
    // Log dans console pour debug
    console.log(`🔘 Button pressed: "${title}" (${variant}, ${size})`);
    
    // Callback utilisateur
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        loading && styles.loading
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText
      ]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  // States
  disabled: {
    backgroundColor: '#E5E5E7',
    borderColor: '#E5E5E7',
  },
  loading: {
    opacity: 0.7,
  },
  // Text base
  text: {
    fontWeight: '600',
  },
  // Text variants
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  },
  dangerText: {
    color: 'white',
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#8E8E93',
  },
});

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const handlePress = (variant: string) => {
  action('button-clicked')(variant);
  Alert.alert('Button Pressed', `${variant} button was pressed!`);
};

export const Primary: Story = {
  args: {
    title: 'Primary Button',
    variant: 'primary',
    size: 'medium',
    onPress: () => handlePress('primary'),
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Button',
    variant: 'secondary',
    size: 'medium',
    onPress: () => handlePress('secondary'),
  },
};

export const Danger: Story = {
  args: {
    title: 'Delete',
    variant: 'danger',
    size: 'medium',
    onPress: () => handlePress('danger'),
  },
};

export const Small: Story = {
  args: {
    title: 'Small',
    size: 'small',
    onPress: () => handlePress('small'),
  },
};

export const Large: Story = {
  args: {
    title: 'Large Button',
    size: 'large',
    onPress: () => handlePress('large'),
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled',
    disabled: true,
    onPress: () => handlePress('disabled'),
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Button',
    loading: true,
    onPress: () => handlePress('loading'),
  },
};

// Showcase de toutes les variantes
export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Button title="Primary" variant="primary" onPress={() => handlePress('primary')} />
      <Button title="Secondary" variant="secondary" onPress={() => handlePress('secondary')} />
      <Button title="Danger" variant="danger" onPress={() => handlePress('danger')} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title="Small" size="small" onPress={() => handlePress('small')} />
        <Button title="Medium" size="medium" onPress={() => handlePress('medium')} />
        <Button title="Large" size="large" onPress={() => handlePress('large')} />
      </View>
      <Button title="Disabled" disabled onPress={() => handlePress('disabled')} />
      <Button title="Loading" loading onPress={() => handlePress('loading')} />
    </View>
  ),
};