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
  LinearGradient,
  Badge,
  BadgeText
} from '@gluestack-ui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProcessScreen() {
  const processSteps = [
    {
      step: '01',
      title: 'Appel découverte',
      duration: '30 min',
      description: 'On comprend votre besoin',
      details: 'Présentation de votre projet, analyse des contraintes',
      icon: 'call-outline',
      color: '$primary600'
    },
    {
      step: '02', 
      title: 'Devis détaillé',
      duration: 'Sous 48h',
      description: 'Périmètre, planning, budget',
      details: 'Specs fonctionnelles, architecture technique, planning de livraison',
      icon: 'document-text-outline',
      color: '$secondary600'
    },
    {
      step: '03',
      title: 'Développement',
      duration: 'Sprints courts',
      description: 'Livraisons régulières',
      details: 'Daily standups, démos hebdomadaires, ajustements continus',
      icon: 'code-outline',
      color: '$success600'
    },
    {
      step: '04',
      title: 'Livraison',
      duration: 'À temps',
      description: 'Produit déployé + doc',
      details: 'Tests finaux, mise en ligne, passation technique, support post-launch',
      icon: 'checkmark-circle-outline',
      color: '$warning600'
    }
  ];

  const faqs = [
    {
      question: 'En combien de temps peut-on avoir un premier résultat concret ?',
      answer: 'Tout dépend de votre besoin, mais nous privilégions toujours des cycles courts et itératifs. Un produit fonctionnel peut être livré en quelques semaines, une fonctionnalité clé en quelques jours.'
    },
    {
      question: 'Proposez-vous un suivi après la livraison ?',
      answer: 'Oui, c\'est même au cœur de notre approche. Nous restons disponibles pour faire évoluer votre produit, corriger, optimiser ou accompagner votre croissance.'
    },
    {
      question: 'Comment se passe la communication ?',
      answer: 'Nous privilégions une communication fluide, directe et régulière. On s\'intègre à votre manière de travailler: Slack, Notion, calls hebdo… selon vos préférences.'
    },
    {
      question: 'Travaillez-vous avec des équipes internes ?',
      answer: 'Absolument. Nous savons collaborer avec des équipes existantes : produit, design, devs internes ou freelance. On peut intervenir sur un périmètre bien défini.'
    },
    {
      question: 'Est-ce que vous challengez les choix produits ?',
      answer: 'Oui, si vous le souhaitez. On ne se contente pas de livrer : on réfléchit avec vous. On partage nos retours, nos intuitions, nos alertes.'
    }
  ];

  return (
    <ScrollView flex={1} bg="$backgroundDark950">
      {/* Hero Section */}
      <Box bg="$backgroundDark950" pt="$16" pb="$20">
        <VStack space="lg" alignItems="center" px="$6">
          <Heading size="4xl" color="$textDark50" textAlign="center" fontWeight="$bold" letterSpacing="-$lg">
            Notre Process
          </Heading>
          <Text size="xl" color="$textDark300" textAlign="center" maxWidth={320}>
            Une méthode éprouvée pour garantir votre succès
          </Text>
        </VStack>
      </Box>

      {/* Process Steps */}
      <Box py="$20" px="$6" bg="$backgroundDark900">
        <VStack space="2xl" maxWidth={600} alignSelf="center" w="100%">
          {processSteps.map((step, index) => (
            <HStack key={index} space="xl" alignItems="flex-start">
              <VStack alignItems="center" minWidth={80}>
                <Box 
                  bg={step.color} 
                  borderRadius="$3xl" 
                  size={80}
                  justifyContent="center"
                  alignItems="center"
                  mb="$4"
                >
                  <Text color="$white" fontSize="$2xl" fontWeight="$bold">
                    {step.step}
                  </Text>
                </Box>
                {index < processSteps.length - 1 && (
                  <Box
                    width={3}
                    height={80}
                    bg="$backgroundDark700"
                  />
                )}
              </VStack>
              
              <VStack flex={1} space="lg" pt="$2">
                <VStack space="md">
                  <HStack justifyContent="space-between" alignItems="flex-start">
                    <Heading size="2xl" color="$textDark50" fontWeight="$bold" flex={1}>
                      {step.title}
                    </Heading>
                    <Box bg="$backgroundDark700" px="$3" py="$1" borderRadius="$full">
                      <Text color="$textDark300" fontSize="$sm" fontWeight="$medium">
                        {step.duration}
                      </Text>
                    </Box>
                  </HStack>
                  <Text size="lg" color={step.color} fontWeight="$semibold">
                    {step.description}
                  </Text>
                </VStack>
                <Text size="md" color="$textDark300" lineHeight="$2xl">
                  {step.details}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* FAQ Section */}
      <Box py="$20" px="$6" bg="$backgroundDark950">
        <VStack space="xl" alignItems="center">
          <VStack space="sm" alignItems="center">
            <Text fontSize="$sm" color="$primary400" fontWeight="$semibold" textTransform="uppercase" letterSpacing="$lg">
              Questions fréquentes
            </Text>
          </VStack>
          
          <VStack space="xl" w="100%" maxWidth={700}>
            {faqs.map((faq, index) => (
              <Box key={index} bg="$backgroundDark800" p="$8" borderRadius="$3xl" borderWidth={1} borderColor="$backgroundDark700">
                <VStack space="lg">
                  <Text color="$textDark50" fontSize="$lg" fontWeight="$bold" lineHeight="$2xl">
                    {faq.question}
                  </Text>
                  <Text color="$textDark300" fontSize="$md" lineHeight="$2xl">
                    {faq.answer}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Contact CTA */}
      <Box py="$20" px="$6" bg="$backgroundDark900">
        <VStack space="xl" alignItems="center">
          <VStack space="lg" alignItems="center" maxWidth={400}>
            <Box 
              bg="$backgroundDark700" 
              p="$6" 
              borderRadius="$3xl"
              mb="$4"
            >
              <Ionicons name="time-outline" size={40} color="#0073e6" />
            </Box>
            <Heading size="3xl" color="$textDark50" textAlign="center" fontWeight="$bold">
              Premier échange sous 48h
            </Heading>
            <Text color="$textDark300" textAlign="center" fontSize="$lg" lineHeight="$2xl">
              On prend connaissance de votre projet et on vous contacte pour un appel de cadrage de 30min.
            </Text>
          </VStack>
          
          <VStack space="md" alignItems="center">
            <Text color="$textDark400" fontSize="$md" textAlign="center" maxWidth={350}>
              Première analyse • Appel de cadrage • Proposition personnalisée
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}