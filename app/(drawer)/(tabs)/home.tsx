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
  Badge,
  BadgeText,
  Heading,
  LinearGradient,
  Center,
  Divider,
  Pressable
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import ZkorpLogo from '@/components/ZkorpLogo';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const features = [
    {
      icon: 'flash-outline',
      title: 'Web3',
      description: 'Smart Contracts',
      color: '$primary600'
    },
    {
      icon: 'bulb-outline', 
      title: 'Intelligence',
      description: 'Artificielle',
      color: '$success600'
    },
    {
      icon: 'laptop-outline',
      title: 'Fullstack',
      description: 'Development',
      color: '$secondary600'
    }
  ];

  const stats = [
    { label: 'Hackathons Web3', value: '9', color: '$primary600' },
    { label: 'Prix Gagnés', value: '+50k€', color: '$success600' },
    { label: 'Jeux Onchain', value: '10', color: '$secondary600' },
    { label: 'Top 1', value: '6×', color: '$error600' }
  ];

  const projects = [
    {
      name: 'zkube',
      description: '#1 sur Starknet pendant 2 mois',
      detail: '+20k parties jouées • Jeu Tetris onchain',
      color: '$primary600'
    },
    {
      name: 'Wardens',
      description: 'Jeu mobile onchain',
      detail: 'Unity + smart contracts Starknet',
      color: '$secondary600'
    }
  ];

  return (
    <ScrollView flex={1} bg="$backgroundDark950">
      {/* Hero Section */}
      <Box bg="$backgroundDark950" pt="$16" pb="$20">
        <VStack space="2xl" alignItems="center" px="$6">
          {/* Logo */}
          <Box>
            <ZkorpLogo size={80} />
          </Box>
          
          <VStack space="lg" alignItems="center" maxWidth={400}>
            <Heading size="4xl" color="$textDark50" textAlign="center" fontWeight="$bold" letterSpacing="-$lg">
              zKorp
            </Heading>
            <Text size="xl" color="$textDark300" textAlign="center" lineHeight="$2xl" maxWidth={320}>
              Solutions techniques sur mesure par des experts passionnés
            </Text>
          </VStack>

          <HStack space="md" flexWrap="wrap" justifyContent="center">
            {features.map((feature, index) => (
              <Box key={index} bg="$backgroundDark800" px="$4" py="$2" borderRadius="$full">
                <Text color="$textDark200" fontSize="$sm" fontWeight="$medium">
                  {feature.title}
                </Text>
              </Box>
            ))}
          </HStack>

          <VStack space="md" mt="$8" w="100%" maxWidth={300}>
            <Button 
              size="lg" 
              bg="$primary600"
              borderRadius="$xl"
              onPress={() => router.push('/(drawer)/(tabs)/services')}
            >
              <ButtonText fontWeight="$semibold">
                Échanger sur votre projet
              </ButtonText>
            </Button>
            
            <Pressable onPress={() => router.push('/(drawer)/(tabs)/about')}>
              <Text color="$textDark400" textAlign="center" fontSize="$md">
                Découvrir nos réalisations →
              </Text>
            </Pressable>
          </VStack>
        </VStack>
      </Box>

      {/* Réalisations Section */}
      <Box py="$20" px="$6" bg="$backgroundDark900">
        <VStack space="xl" alignItems="center">
          <VStack space="sm" alignItems="center" maxWidth={400}>
            <Text fontSize="$sm" color="$primary400" fontWeight="$semibold" textTransform="uppercase" letterSpacing="$lg">
              Nos réalisations
            </Text>
            <Text size="lg" color="$textDark200" textAlign="center">
              Expertise concrète validée sur le terrain
            </Text>
          </VStack>
          
          <VStack space="lg" w="100%" maxWidth={500}>
            {projects.map((project, index) => (
              <Box key={index} bg="$backgroundDark800" p="$6" borderRadius="$2xl" borderWidth={1} borderColor="$backgroundDark700">
                <VStack space="md">
                  <Heading size="xl" color="$textDark50" fontWeight="$bold">
                    {project.name}
                  </Heading>
                  <Text size="md" color={project.color} fontWeight="$medium">
                    {project.description}
                  </Text>
                  <Text size="sm" color="$textDark400" lineHeight="$lg">
                    {project.detail}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Stats Section */}
      <Box py="$20" px="$6" bg="$backgroundDark950">
        <VStack space="xl" alignItems="center">
          <Text fontSize="$sm" color="$primary400" fontWeight="$semibold" textTransform="uppercase" letterSpacing="$lg">
            Performances
          </Text>
          
          <HStack space="lg" flexWrap="wrap" justifyContent="center">
            {stats.map((stat, index) => (
              <VStack key={index} space="xs" alignItems="center" minWidth={100}>
                <Text color={stat.color} fontSize="$3xl" fontWeight="$bold" lineHeight="$3xl">
                  {stat.value}
                </Text>
                <Text color="$textDark400" fontSize="$sm" textAlign="center">
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </HStack>

          <VStack space="md" alignItems="center" mt="$8">
            <Text color="$textDark200" fontSize="$xl" fontWeight="$medium" textAlign="center">
              6× Top 1 • 3× Top 3
            </Text>
            <VStack space="xs" alignItems="center">
              <Text color="$textDark400" fontSize="$md" textAlign="center">
                10 jeux onchain livrés
              </Text>
              <Text color="$textDark400" fontSize="$sm" textAlign="center" maxWidth={300}>
                Contributions opensource majeures: Dojo, Madara, Argent X
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>

      {/* L'équipe preview */}
      <Box py="$20" px="$6" bg="$backgroundDark900">
        <VStack space="xl" alignItems="center">
          <VStack space="sm" alignItems="center">
            <Text fontSize="$sm" color="$primary400" fontWeight="$semibold" textTransform="uppercase" letterSpacing="$lg">
              L'équipe
            </Text>
            <Text size="lg" color="$textDark200" textAlign="center" maxWidth={300}>
              Une équipe complémentaire, 100% technique
            </Text>
          </VStack>

          <Box bg="$backgroundDark800" p="$8" borderRadius="$3xl" borderWidth={1} borderColor="$backgroundDark700" maxWidth={400} w="100%">
            <VStack space="lg" alignItems="center">
              <VStack space="md" alignItems="center">
                <Text color="$textDark50" fontSize="$xl" fontWeight="$semibold" textAlign="center" lineHeight="$xl">
                  Thomas • Corentin • Matthias • Noé
                </Text>
                <Text color="$textDark400" textAlign="center" fontSize="$md">
                  CEO, Design Lead, Tech Lead, Creative Dev
                </Text>
              </VStack>
              <Pressable onPress={() => router.push('/(drawer)/(tabs)/about')}>
                <Text color="$primary400" textAlign="center" fontSize="$md" fontWeight="$medium">
                  Découvrir l'équipe →
                </Text>
              </Pressable>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Footer */}
      <Box py="$12" px="$6" bg="$backgroundDark950">
        <Text fontSize="$sm" color="$textDark500" textAlign="center">
          © 2025 zKorp
        </Text>
      </Box>
    </ScrollView>
  );
}