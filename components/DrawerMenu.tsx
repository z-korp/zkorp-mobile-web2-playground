import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Pressable,
  Divider,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Badge,
  BadgeText
} from '@gluestack-ui/themed';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/stores/authStore';
import ZkorpLogo from './ZkorpLogo';

interface DrawerMenuProps {
  navigation: any;
  state: any;
}

export default function DrawerMenu({ navigation, state }: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const { session, user } = useAuthStore();

  const menuItems = [
    {
      name: 'Home',
      route: '/(tabs)/home',
      icon: 'home',
      iconFocused: 'home',
      color: '$primary600'
    },
    {
      name: 'About Us',
      route: '/(tabs)/about',
      icon: 'information-circle-outline',
      iconFocused: 'information-circle',
      color: '$secondary600'
    },
    {
      name: 'Services',
      route: '/(tabs)/services', 
      icon: 'grid-outline',
      iconFocused: 'grid',
      color: '$success600'
    },
    {
      name: 'Portfolio',
      route: '/(tabs)/portfolio',
      icon: 'briefcase-outline', 
      iconFocused: 'briefcase',
      color: '$warning600'
    },
    {
      name: 'Contact',
      route: '/(tabs)/contact',
      icon: 'mail-outline',
      iconFocused: 'mail',
      color: '$error600'
    }
  ];

  const authItems = session ? [
    {
      name: 'Profile',
      route: '/(tabs)/profile',
      icon: 'person-outline',
      iconFocused: 'person', 
      color: '$violet600'
    },
    {
      name: 'Notes',
      route: '/(tabs)/notes',
      icon: 'document-text-outline',
      iconFocused: 'document-text',
      color: '$indigo600'
    }
  ] : [
    {
      name: 'Login',
      route: '/(auth)/sign-in',
      icon: 'log-in-outline',
      iconFocused: 'log-in',
      color: '$primary600'
    }
  ];

  return (
    <DrawerContentScrollView 
      style={{ backgroundColor: '#1f2937' }}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <Box flex={1} bg="$backgroundDark900">
        {/* Header avec logo */}
        <Box 
          bg="$primary600" 
          pt={insets.top + 20} 
          pb="$6" 
          px="$6"
          borderBottomLeftRadius="$2xl"
          borderBottomRightRadius="$2xl"
        >
          <VStack space="md" alignItems="center">
            <Box>
              <ZkorpLogo size={80} color1="#ffffff" color2="#ffffff" />
            </Box>
            <Text color="$white" fontSize="$xl" fontWeight="$bold" textAlign="center">
              zKorp
            </Text>
            
            {session && user && (
              <VStack space="xs" alignItems="center">
                <Avatar size="md">
                  <AvatarImage source={{ uri: user.avatar_url || undefined }} />
                  <AvatarFallbackText color="$primary600">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallbackText>
                </Avatar>
                <Text color="$white" fontSize="$md" fontWeight="$semibold">
                  {user.email?.split('@')[0] || 'User'}
                </Text>
                <Badge size="sm" variant="outline" borderColor="$white" bg="rgba(255,255,255,0.2)">
                  <BadgeText color="$white">Pro Member</BadgeText>
                </Badge>
              </VStack>
            )}
            
            {!session && (
              <VStack space="xs" alignItems="center">
                <Text color="$primary100" fontSize="$lg" fontWeight="$semibold">
                  Bienvenue !
                </Text>
                <Text color="$primary200" fontSize="$sm" textAlign="center">
                  Connectez-vous pour accéder à toutes les fonctionnalités
                </Text>
              </VStack>
            )}
          </VStack>
        </Box>

        {/* Menu Items */}
        <VStack space="xs" p="$4" flex={1}>
          <Text 
            fontSize="$xs" 
            fontWeight="$bold" 
            color="$textDark400" 
            textTransform="uppercase"
            letterSpacing="$lg"
            mb="$2"
            px="$3"
          >
            Navigation
          </Text>
          
          {menuItems.map((item, index) => {
            const isActive = state.index === index;
            return (
              <Pressable
                key={item.name}
                onPress={() => navigation.navigate(item.name)}
                bg={isActive ? '$backgroundDark700' : 'transparent'}
                borderRadius="$lg"
                p="$3"
                mx="$1"
                borderLeftWidth={isActive ? 4 : 0}
                borderLeftColor={isActive ? '$primary600' : 'transparent'}
              >
                <HStack space="md" alignItems="center">
                  <Box
                    bg={isActive ? '$primary600' : '$backgroundDark700'}
                    p="$2"
                    borderRadius="$md"
                  >
                    <Ionicons
                      name={isActive ? item.iconFocused as any : item.icon as any}
                      size={20}
                      color={isActive ? '#ffffff' : '#9ca3af'}
                    />
                  </Box>
                  <Text
                    color={isActive ? '$primary400' : '$textDark300'}
                    fontSize="$md"
                    fontWeight={isActive ? '$semibold' : '$normal'}
                  >
                    {item.name}
                  </Text>
                </HStack>
              </Pressable>
            );
          })}

          <Divider my="$4" />
          
          <Text 
            fontSize="$xs" 
            fontWeight="$bold" 
            color="$textDark400" 
            textTransform="uppercase"
            letterSpacing="$lg"
            mb="$2"
            px="$3"
          >
            {session ? 'Account' : 'Authentication'}
          </Text>

          {authItems.map((item) => (
            <Pressable
              key={item.name}
              onPress={() => navigation.navigate(item.name)}
              bg="transparent"
              borderRadius="$lg"
              p="$3"
              mx="$1"
            >
              <HStack space="md" alignItems="center">
                <Box
                  bg="$backgroundDark700"
                  p="$2"
                  borderRadius="$md"
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color="#9ca3af"
                  />
                </Box>
                <Text
                  color="$textDark300"
                  fontSize="$md"
                >
                  {item.name}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </VStack>

        {/* Footer */}
        <Box p="$4" pt="$0">
          <Divider mb="$4" />
          <VStack space="xs">
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$xs" color="$textDark400">
                Version 1.0.0
              </Text>
              <Badge size="sm" variant="solid" action="success">
                <BadgeText>Beta</BadgeText>
              </Badge>
            </HStack>
            <Text fontSize="$xs" color="$textDark400" textAlign="center">
              © 2024 Zkorp. All rights reserved.
            </Text>
          </VStack>
        </Box>
      </Box>
    </DrawerContentScrollView>
  );
}