import React from 'react';
import { 
  Box, 
  ScrollView,
  VStack, 
  HStack,
  Text, 
  Button,
  ButtonText,
  Card,
  Heading,
  Center,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Badge,
  BadgeText,
  LinearGradient,
  Pressable,
  Divider
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(drawer)/(tabs)/home');
  };

  const profileActions = [
    {
      icon: 'person-outline',
      title: 'Informations Personnelles',
      description: 'Modifier vos données de profil',
      color: '$primary600',
      action: () => {}
    },
    {
      icon: 'document-text-outline',
      title: 'Mes Notes',
      description: 'Accéder à vos notes sauvegardées',
      color: '$secondary600',
      action: () => router.push('/(tabs)/notes')
    },
    {
      icon: 'settings-outline',
      title: 'Paramètres',
      description: 'Configurer l&apos;application',
      color: '$success600',
      action: () => {}
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Sécurité',
      description: 'Gérer vos paramètres de sécurité',
      color: '$warning600',
      action: () => {}
    },
    {
      icon: 'help-circle-outline',
      title: 'Aide & Support',
      description: 'Centre d&apos;aide et FAQ',
      color: '$violet600',
      action: () => {}
    }
  ];

  const stats = [
    { label: 'Notes Créées', value: '24', icon: 'document-text' },
    { label: 'Jours Actif', value: '45', icon: 'calendar' },
    { label: 'Projets', value: '3', icon: 'folder' },
    { label: 'Niveau', value: 'Pro', icon: 'trophy' }
  ];

  if (!user) {
    return (
      <ScrollView flex={1} bg="$backgroundDark950">
        <Box p="$6" flex={1} justifyContent="center">
          <Card size="lg" variant="elevated" bg="$backgroundDark800">
            <VStack space="lg" alignItems="center" p="$8">
              <Ionicons name="person-outline" size={64} color="#9CA3AF" />
              <Heading size="lg" color="$textDark50" textAlign="center">
                Non Connecté
              </Heading>
              <Text color="$textDark300" textAlign="center">
                Connectez-vous pour accéder à votre profil
              </Text>
              <Button 
                size="lg" 
                variant="solid" 
                action="primary"
                onPress={() => router.push('/(drawer)/(tabs)/login')}
              >
                <ButtonText>Se Connecter</ButtonText>
              </Button>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    );
  }

  return (
    <ScrollView flex={1} bg="$backgroundDark950">
      {/* Header with User Info */}
      <LinearGradient
        colors={['$primary600', '$primary700', '$secondary600']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Box p="$8" pb="$12">
          <VStack space="lg" alignItems="center">
            <Avatar size="2xl" bg="$white">
              <AvatarImage source={{ uri: user.avatar_url || undefined }} />
              <AvatarFallbackText color="$primary600" fontSize="$3xl" fontWeight="$bold">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallbackText>
            </Avatar>
            
            <VStack space="sm" alignItems="center">
              <Heading size="xl" color="$white" textAlign="center">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'}
              </Heading>
              <Text color="$primary200" fontSize="$md">
                {user.email}
              </Text>
              <Badge size="md" variant="outline" borderColor="$white" bg="rgba(255,255,255,0.2)">
                <BadgeText color="$white">Membre Pro</BadgeText>
              </Badge>
            </VStack>
          </VStack>
        </Box>
      </LinearGradient>

      {/* Stats Cards */}
      <Box p="$6" bg="$backgroundDark900" mt="-$6" borderTopLeftRadius="$2xl" borderTopRightRadius="$2xl">
        <VStack space="lg">
          <HStack space="md" flexWrap="wrap" justifyContent="space-around">
            {stats.map((stat, index) => (
              <Pressable key={index} flex={0.45} minWidth={140}>
                <Card size="md" variant="elevated" m="$1" bg="$backgroundDark800">
                  <Center p="$4">
                    <Ionicons 
                      name={stat.icon as any} 
                      size={24} 
                      color="#0073e6" 
                      style={{ marginBottom: 8 }}
                    />
                    <Text color="$primary600" fontSize="$xl" fontWeight="$bold">
                      {stat.value}
                    </Text>
                    <Text color="$textDark300" fontSize="$xs" textAlign="center" mt="$1">
                      {stat.label}
                    </Text>
                  </Center>
                </Card>
              </Pressable>
            ))}
          </HStack>
        </VStack>
      </Box>

      {/* Profile Actions */}
      <Box p="$6" bg="$backgroundDark850">
        <VStack space="lg">
          <Heading size="lg" color="$primary400">
            Gestion du Compte
          </Heading>
          
          <VStack space="xs">
            {profileActions.map((action, index) => (
              <Pressable key={index} onPress={action.action}>
                <Card size="md" variant="outline" bg="$backgroundDark800">
                  <HStack space="md" alignItems="center" p="$4">
                    <Center 
                      bg={`${action.color.replace('$', '$')}` + '20'} 
                      borderRadius="$lg" 
                      size={45}
                    >
                      <Ionicons
                        name={action.icon as any}
                        size={20}
                        color={action.color === '$primary600' ? '#0073e6' : 
                               action.color === '$secondary600' ? '#0284c7' :
                               action.color === '$success600' ? '#16a34a' :
                               action.color === '$warning600' ? '#f59e0b' : '#7c3aed'}
                      />
                    </Center>
                    <VStack flex={1} space="xs">
                      <Text color="$textDark50" fontSize="$md" fontWeight="$semibold">
                        {action.title}
                      </Text>
                      <Text color="$textDark300" fontSize="$sm">
                        {action.description}
                      </Text>
                    </VStack>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </HStack>
                </Card>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Account Settings */}
      <Box p="$6" bg="$backgroundDark900">
        <VStack space="lg">
          <Heading size="lg" color="$primary400">
            Paramètres
          </Heading>
          
          <VStack space="sm">
            <Card size="md" variant="outline" bg="$backgroundDark800">
              <HStack justifyContent="space-between" alignItems="center" p="$4">
                <VStack space="xs">
                  <Text color="$textDark50" fontSize="$md" fontWeight="$semibold">
                    Notifications Push
                  </Text>
                  <Text color="$textDark300" fontSize="$sm">
                    Recevoir des notifications sur l&apos;appareil
                  </Text>
                </VStack>
                <Badge size="sm" variant="solid" action="success">
                  <BadgeText>Activé</BadgeText>
                </Badge>
              </HStack>
            </Card>

            <Card size="md" variant="outline" bg="$backgroundDark800">
              <HStack justifyContent="space-between" alignItems="center" p="$4">
                <VStack space="xs">
                  <Text color="$textDark50" fontSize="$md" fontWeight="$semibold">
                    Mode Sombre
                  </Text>
                  <Text color="$textDark300" fontSize="$sm">
                    Interface en mode sombre
                  </Text>
                </VStack>
                <Badge size="sm" variant="solid" action="success">
                  <BadgeText>Activé</BadgeText>
                </Badge>
              </HStack>
            </Card>

            <Card size="md" variant="outline" bg="$backgroundDark800">
              <HStack justifyContent="space-between" alignItems="center" p="$4">
                <VStack space="xs">
                  <Text color="$textDark50" fontSize="$md" fontWeight="$semibold">
                    Synchronisation
                  </Text>
                  <Text color="$textDark300" fontSize="$sm">
                    Sync automatique des données
                  </Text>
                </VStack>
                <Badge size="sm" variant="solid" action="primary">
                  <BadgeText>Auto</BadgeText>
                </Badge>
              </HStack>
            </Card>
          </VStack>
        </VStack>
      </Box>

      {/* Logout Section */}
      <Box p="$6" bg="$backgroundDark850">
        <Divider mb="$4" />
        
        <VStack space="sm">
          <Button 
            size="lg" 
            variant="outline" 
            action="error"
            onPress={handleLogout}
          >
            <HStack space="sm" alignItems="center">
              <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              <ButtonText>Se Déconnecter</ButtonText>
            </HStack>
          </Button>

          <Text color="$textDark400" fontSize="$xs" textAlign="center" mt="$4">
            Connecté depuis le {new Date(user.created_at).toLocaleDateString('fr-FR')}
          </Text>
        </VStack>
      </Box>
    </ScrollView>
  );
}