import { router } from 'expo-router';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Heading, 
  Button,
  ButtonText,
  Card,
  Badge,
  BadgeText,
  ScrollView,
  LinearGradient,
  Center,
  Divider,
  Icon,
  CheckIcon,
  StarIcon,
  GlobeIcon,
  LockIcon,
  ZapIcon,
  HeartIcon,
  Image,
  Avatar,
  AvatarImage,
  AvatarFallbackText
} from '@gluestack-ui/themed';

export default function IntroScreen() {
  return (
    <ScrollView flex={1} bg="$backgroundLight50">
      {/* Hero Section avec gradient */}
      <LinearGradient
        colors={['$primary500', '$primary700', '$secondary600']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Box p="$8" pb="$12">
          <VStack space="lg" alignItems="center">
            <Avatar size="2xl" bg="$white">
              <AvatarImage source={{ uri: 'https://via.placeholder.com/150/0073e6/FFFFFF?text=ZK' }} />
              <AvatarFallbackText color="$primary600" fontSize="$2xl" fontWeight="bold">
                ZK
              </AvatarFallbackText>
            </Avatar>
            
            <VStack space="md" alignItems="center">
              <Heading size="3xl" color="$white" textAlign="center" fontWeight="bold">
                Zkorp Mobile
              </Heading>
              <Heading size="lg" color="$primary100" textAlign="center" fontWeight="normal">
                L&apos;avenir du développement mobile
              </Heading>
              <Text size="md" color="$primary200" textAlign="center" maxWidth={300}>
                Une plateforme révolutionnaire qui transforme votre vision en réalité mobile
              </Text>
            </VStack>

            <HStack space="sm" mt="$4">
              <Badge size="md" variant="outline" borderColor="$white" bg="rgba(255,255,255,0.2)">
                <BadgeText color="$white">React Native</BadgeText>
              </Badge>
              <Badge size="md" variant="outline" borderColor="$white" bg="rgba(255,255,255,0.2)">
                <BadgeText color="$white">Expo</BadgeText>
              </Badge>
              <Badge size="md" variant="outline" borderColor="$white" bg="rgba(255,255,255,0.2)">
                <BadgeText color="$white">Gluestack</BadgeText>
              </Badge>
            </HStack>
          </VStack>
        </Box>
      </LinearGradient>

      {/* Features Section */}
      <Box p="$6">
        <VStack space="xl">
          <VStack space="md" alignItems="center">
            <Heading size="xl" color="$primary700" textAlign="center">
              Pourquoi choisir Zkorp ?
            </Heading>
            <Text size="md" color="$textLight600" textAlign="center" maxWidth={320}>
              Des fonctionnalités pensées pour les développeurs modernes
            </Text>
          </VStack>

          <VStack space="md">
            {/* Feature 1 */}
            <Card size="lg" variant="elevated" bg="$white">
              <HStack space="md" alignItems="flex-start">
                <Center bg="$success100" borderRadius="$full" size="$12">
                  <Icon as={ZapIcon} color="$success600" size="xl" />
                </Center>
                <VStack flex={1} space="sm">
                  <Heading size="md" color="$textLight900">
                    Performance Ultra-Rapide
                  </Heading>
                  <Text size="sm" color="$textLight600">
                    Architecture optimisée pour des applications lightning-fast avec React Native et Expo
                  </Text>
                </VStack>
              </HStack>
            </Card>

            {/* Feature 2 */}
            <Card size="lg" variant="elevated" bg="$white">
              <HStack space="md" alignItems="flex-start">
                <Center bg="$primary100" borderRadius="$full" size="$12">
                  <Icon as={LockIcon} color="$primary600" size="xl" />
                </Center>
                <VStack flex={1} space="sm">
                  <Heading size="md" color="$textLight900">
                    Sécurité Renforcée
                  </Heading>
                  <Text size="sm" color="$textLight600">
                    Chiffrement AES, authentification biométrique et stockage sécurisé intégrés
                  </Text>
                </VStack>
              </HStack>
            </Card>

            {/* Feature 3 */}
            <Card size="lg" variant="elevated" bg="$white">
              <HStack space="md" alignItems="flex-start">
                <Center bg="$secondary100" borderRadius="$full" size="$12">
                  <Icon as={GlobeIcon} color="$secondary600" size="xl" />
                </Center>
                <VStack flex={1} space="sm">
                  <Heading size="md" color="$textLight900">
                    Cross-Platform
                  </Heading>
                  <Text size="sm" color="$textLight600">
                    Une seule codebase pour iOS, Android et Web avec un rendu natif optimal
                  </Text>
                </VStack>
              </HStack>
            </Card>

            {/* Feature 4 */}
            <Card size="lg" variant="elevated" bg="$white">
              <HStack space="md" alignItems="flex-start">
                <Center bg="$error100" borderRadius="$full" size="$12">
                  <Icon as={HeartIcon} color="$error600" size="xl" />
                </Center>
                <VStack flex={1} space="sm">
                  <Heading size="md" color="$textLight900">
                    UX Exceptionnelle
                  </Heading>
                  <Text size="sm" color="$textLight600">
                    Interface utilisateur fluide et intuitive avec des composants premium
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          <Divider my="$6" />

          {/* Stats Section */}
          <VStack space="md" alignItems="center">
            <Heading size="lg" color="$primary700" textAlign="center">
              En chiffres
            </Heading>
            <HStack space="xl" flexWrap="wrap" justifyContent="center">
              <VStack alignItems="center" space="xs">
                <Heading size="2xl" color="$primary600">99%</Heading>
                <Text size="sm" color="$textLight600">Uptime</Text>
              </VStack>
              <VStack alignItems="center" space="xs">
                <Heading size="2xl" color="$success600">50k+</Heading>
                <Text size="sm" color="$textLight600">Utilisateurs</Text>
              </VStack>
              <VStack alignItems="center" space="xs">
                <Heading size="2xl" color="$secondary600">24/7</Heading>
                <Text size="sm" color="$textLight600">Support</Text>
              </VStack>
            </HStack>
          </VStack>

          {/* CTA Section */}
          <VStack space="md" mt="$8">
            <Button 
              size="xl" 
              variant="solid" 
              action="primary" 
              onPress={() => router.push('/notes')}
              hardShadow="2"
            >
              <ButtonText fontSize="$lg" fontWeight="bold">
                Commencer l&apos;aventure
              </ButtonText>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              action="secondary"
              onPress={() => router.push('/about')}
            >
              <ButtonText>En savoir plus</ButtonText>
            </Button>
          </VStack>

          {/* Footer */}
          <VStack space="sm" alignItems="center" mt="$8" mb="$4">
            <HStack space="xs" alignItems="center">
              <Icon as={StarIcon} color="$warning500" size="sm" />
              <Text size="sm" color="$textLight500">
                Fait avec ❤️ par l&apos;équipe Zkorp
              </Text>
            </HStack>
            <Text size="xs" color="$textLight400">
              Version 1.0.0 - Beta
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}