import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="sign-in" 
          options={{ 
            title: 'Sign In',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="sign-up" 
          options={{ 
            title: 'Sign Up',
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}