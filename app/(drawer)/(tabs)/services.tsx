import React from 'react';
import { 
  Box, 
  ScrollView,
  VStack, 
  HStack,
  Text, 
  Card,
  Heading,
  Center,
  Button,
  ButtonText,
  Badge,
  BadgeText,
  LinearGradient,
  Pressable
} from '@gluestack-ui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function ServicesScreen() {
  const services = [
    {
      icon: 'phone-portrait-outline',
      title: 'Applications Mobiles Natives',
      description: 'Développement d&apos;applications iOS et Android performantes avec React Native',
      features: ['Performance optimale', 'Interface native', 'Accès hardware complet'],
      price: 'À partir de 15k€',
      color: '$primary600',
      popular: false
    },
    {
      icon: 'globe-outline',
      title: 'Applications Cross-Platform',
      description: 'Une seule codebase pour iOS, Android et Web avec Expo',
      features: ['Développement rapide', 'Coût réduit', 'Maintenance simplifiée'],
      price: 'À partir de 10k€',
      color: '$secondary600',
      popular: true
    },
    {
      icon: 'cloud-outline',
      title: 'Backend & API',
      description: 'Solutions backend complètes avec Supabase ou Firebase',
      features: ['Base de données', 'Authentification', 'Storage & CDN'],
      price: 'À partir de 5k€',
      color: '$success600',
      popular: false
    },
    {
      icon: 'color-palette-outline',
      title: 'UI/UX Design',
      description: 'Design d&apos;interface utilisateur moderne et intuitive',
      features: ['Wireframes', 'Prototypes', 'Design System'],
      price: 'À partir de 3k€',
      color: '$warning600',
      popular: false
    },
    {
      icon: 'settings-outline',
      title: 'Maintenance & Support',
      description: 'Suivi technique et évolutions de votre application',
      features: ['Monitoring 24/7', 'Mises à jour', 'Support technique'],
      price: '500€/mois',
      color: '$error600',
      popular: false
    },
    {
      icon: 'school-outline',
      title: 'Formation & Consulting',
      description: 'Accompagnement et formation de vos équipes techniques',
      features: ['Formation React Native', 'Code Review', 'Consulting technique'],
      price: '800€/jour',
      color: '$violet600',
      popular: false
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Analyse',
      description: 'Étude de vos besoins et définition du cahier des charges',
      icon: 'search-outline'
    },
    {
      step: '02', 
      title: 'Design',
      description: 'Création des maquettes et du design system',
      icon: 'brush-outline'
    },
    {
      step: '03',
      title: 'Développement',
      description: 'Codage de l&apos;application avec les meilleures pratiques',
      icon: 'code-outline'
    },
    {
      step: '04',
      title: 'Tests & Déploiement',
      description: 'Tests complets et mise en production sur les stores',
      icon: 'checkmark-circle-outline'
    }
  ];

  return (
    <ScrollView flex={1} bg="$backgroundDark950">
      {/* Hero Section */}
      <LinearGradient
        colors={['$success600', '$success700', '$secondary600']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Box p="$8" pb="$12">
          <VStack space="lg" alignItems="center">
            <Heading size="3xl" color="$white" textAlign="center" fontWeight="$bold">
              Nos Services
            </Heading>
            <Text size="lg" color="$success100" textAlign="center" maxWidth={320}>
              Des solutions complètes pour tous vos besoins mobiles
            </Text>
          </VStack>
        </Box>
      </LinearGradient>

      {/* Services Grid */}
      <Box p="$6" bg="$backgroundDark900" mt="-$6" borderTopLeftRadius="$2xl" borderTopRightRadius="$2xl">
        <VStack space="lg">
          <Heading size="xl" color="$primary400" textAlign="center" mb="$4">
            Solutions sur Mesure
          </Heading>
          
          <VStack space="md">
            {services.map((service, index) => (
              <Pressable key={index}>
                <Card size="lg" variant="elevated" bg="$backgroundDark800" position="relative">
                  {service.popular && (
                    <Badge
                      size="sm"
                      variant="solid"
                      action="primary"
                      position="absolute"
                      top="$4"
                      right="$4"
                      zIndex={10}
                    >
                      <BadgeText>Populaire</BadgeText>
                    </Badge>
                  )}
                  
                  <VStack space="md" p="$5">
                    <HStack space="md" alignItems="flex-start">
                      <Center 
                        bg={`${service.color.replace('$', '$')}` + '20'} 
                        borderRadius="$lg" 
                        size={50}
                      >
                        <Ionicons
                          name={service.icon as any}
                          size={24}
                          color={service.color === '$primary600' ? '#0073e6' : 
                                 service.color === '$secondary600' ? '#0284c7' :
                                 service.color === '$success600' ? '#16a34a' :
                                 service.color === '$warning600' ? '#f59e0b' :
                                 service.color === '$error600' ? '#dc2626' : '#7c3aed'}
                        />
                      </Center>
                      <VStack flex={1} space="xs">
                        <Heading size="md" color="$textDark50">
                          {service.title}
                        </Heading>
                        <Text size="sm" color="$textDark300" lineHeight="$lg">
                          {service.description}
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack space="xs" ml="$16">
                      {service.features.map((feature, featureIndex) => (
                        <HStack key={featureIndex} space="xs" alignItems="center">
                          <Box
                            width={6}
                            height={6}
                            borderRadius="$full"
                            bg={service.color}
                          />
                          <Text size="xs" color="$textDark300">
                            {feature}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    <HStack justifyContent="space-between" alignItems="center" mt="$3">
                      <Text color={service.color} fontSize="$lg" fontWeight="$bold">
                        {service.price}
                      </Text>
                      <Button size="sm" variant="outline" action="secondary">
                        <ButtonText>Devis Gratuit</ButtonText>
                      </Button>
                    </HStack>
                  </VStack>
                </Card>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Process Section */}
      <Box py="$20" px="$6" bg="$backgroundDark950">
        <VStack space="xl" alignItems="center">
          <VStack space="sm" alignItems="center">
            <Text fontSize="$sm" color="$primary400" fontWeight="$semibold" textTransform="uppercase" letterSpacing="$lg">
              Notre Processus
            </Text>
            <Text size="lg" color="$textDark200" textAlign="center" maxWidth={400}>
              Une méthode éprouvée pour garantir votre succès
            </Text>
          </VStack>

          <VStack space="xl" w="100%" maxWidth={500}>
            {processSteps.map((step, index) => (
              <HStack key={index} space="lg" alignItems="flex-start">
                <VStack alignItems="center" minWidth={60}>
                  <Box 
                    bg="$primary600" 
                    borderRadius="$2xl" 
                    size={60}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text color="$white" fontSize="$xl" fontWeight="$bold">
                      {step.step}
                    </Text>
                  </Box>
                  {index < processSteps.length - 1 && (
                    <Box
                      width={2}
                      height={60}
                      bg="$backgroundDark700"
                      mt="$4"
                    />
                  )}
                </VStack>
                
                <VStack flex={1} space="md" pt="$2">
                  <Heading size="xl" color="$textDark50" fontWeight="$bold">
                    {step.title}
                  </Heading>
                  <Text size="md" color="$textDark300" lineHeight="$xl">
                    {step.description}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* CTA Section */}
      <Box py="$20" px="$6" bg="$backgroundDark900">
        <VStack space="xl" alignItems="center">
          <VStack space="lg" alignItems="center" maxWidth={400}>
            <Heading size="3xl" color="$textDark50" textAlign="center" fontWeight="$bold">
              Prêt à Démarrer ?
            </Heading>
            <Text color="$textDark300" textAlign="center" fontSize="$lg" lineHeight="$2xl">
              Contactez-nous pour discuter de votre projet et recevoir un devis personnalisé
            </Text>
          </VStack>
          
          <VStack space="md" w="100%" maxWidth={300}>
            <Button 
              size="lg" 
              bg="$primary600"
              borderRadius="$xl"
              onPress={() => router.push('/(drawer)/(tabs)/about')}
            >
              <ButtonText fontWeight="$semibold">
                Devis Gratuit
              </ButtonText>
            </Button>
            <Pressable>
              <Text color="$textDark400" textAlign="center" fontSize="$md">
                Prendre RDV →
              </Text>
            </Pressable>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}