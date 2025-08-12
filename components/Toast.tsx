import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { 
  Box,
  Text,
  VStack,
  HStack,
  Pressable,
  Alert,
  AlertIcon,
  AlertText,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  CloseIcon
} from '@gluestack-ui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@/stores/uiStore';

export default function Toast() {
  const { toasts, hideToast } = useUIStore();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <Box 
      position="absolute" 
      top={insets.top + 20} 
      left="$4" 
      right="$4" 
      zIndex={9999}
    >
      <VStack space="sm">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => hideToast(toast.id)}
          />
        ))}
      </VStack>
    </Box>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(-50);

  const animateOut = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [onDismiss, opacity, translateY]);

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss après duration
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        animateOut();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, animateOut, opacity, translateY]);

  const getActionType = () => {
    switch (toast.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return CheckCircleIcon;
      case 'error':
        return AlertCircleIcon;
      case 'warning':
        return WarningIcon;
      case 'info':
      default:
        return InfoIcon;
    }
  };

  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateY: translateY }],
      }}
    >
      <Alert 
        action={getActionType()} 
        variant="solid"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={5}
      >
        <AlertIcon as={getIcon()} />
        <VStack flex={1}>
          <AlertText fontWeight="$medium" numberOfLines={3}>
            {toast.message}
          </AlertText>
        </VStack>
        <Pressable onPress={animateOut} ml="$2">
          <CloseIcon size="sm" />
        </Pressable>
      </Alert>
    </Animated.View>
  );
}