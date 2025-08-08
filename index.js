import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Charger Storybook ou l'app normale
let AppEntryPoint;

const enableStorybook = Constants.expoConfig?.extra?.storybookEnabled || 
                       process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

console.log('Platform:', Platform.OS);
console.log('Storybook enabled:', enableStorybook);

if (enableStorybook && Platform.OS !== 'web') {
  console.log('Loading Storybook for mobile...');
  try {
    AppEntryPoint = require('./.rnstorybook').default;
  } catch (error) {
    console.error('Error loading Storybook:', error);
    AppEntryPoint = require('expo-router/entry').default;
  }
} else if (enableStorybook && Platform.OS === 'web') {
  console.log('Storybook on web not supported yet - loading normal app...');
  AppEntryPoint = require('expo-router/entry').default;
} else {
  console.log('Loading normal app...');
  AppEntryPoint = require('expo-router/entry').default;
}

registerRootComponent(AppEntryPoint);