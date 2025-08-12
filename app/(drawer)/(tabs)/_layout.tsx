import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/stores/authStore';
import { Box, Pressable } from '@gluestack-ui/themed';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function TabLayout() {
  const { session } = useAuthStore();
  const navigation = useNavigation();

  const MenuButton = () => (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      ml="$4"
    >
      <Ionicons name="menu" size={24} color="#ffffff" />
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#9ca3af',
        headerStyle: {
          backgroundColor: '#1f2937',
          elevation: 2,
          shadowOpacity: 0.3,
        },
        headerShadowVisible: true,
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => <MenuButton />,
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopWidth: 1,
          borderTopColor: '#374151',
          height: 90,
          paddingBottom: 30,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        lazy: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'zKorp',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={22}
            />
          ),
          href: '/(drawer)/(tabs)/home',
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Expertise',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'bulb' : 'bulb-outline'}
              color={color}
              size={22}
            />
          ),
          href: '/(drawer)/(tabs)/about',
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              color={color}
              size={22}
            />
          ),
          href: '/(drawer)/(tabs)/services',
        }}
      />
      <Tabs.Screen
        name="process"
        options={{
          title: 'Process',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              color={color}
              size={22}
            />
          ),
          href: '/(drawer)/(tabs)/process',
        }}
      />
      {session ? (
        <>
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profil',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  color={color}
                  size={22}
                />
              ),
              href: '/(drawer)/(tabs)/profile',
            }}
          />
        </>
      ) : (
        <Tabs.Screen
          name="login"
          options={{
            title: 'Connexion',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'log-in' : 'log-in-outline'}
                color={color}
                size={22}
              />
            ),
            href: '/(drawer)/(tabs)/login',
          }}
        />
      )}
    </Tabs>
  );
}