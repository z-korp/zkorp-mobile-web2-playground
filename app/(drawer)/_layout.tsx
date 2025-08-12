import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerMenu from '@/components/DrawerMenu';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerMenu {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: {
            width: 300,
          },
        }}
      >
        <Drawer.Screen 
          name="(tabs)" 
          options={{
            drawerLabel: 'Main',
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}