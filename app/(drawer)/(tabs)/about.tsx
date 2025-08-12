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
  Avatar,
  AvatarFallbackText,
  Badge,
  BadgeText,
  LinearGradient,
  Divider
} from '@gluestack-ui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AboutScreen() {
  const team = [
    {
      name: 'Thomas',
      role: 'CEO',
      avatar: 'T',
      specialties: ['Pilotage produit & roadmap', 'Gestion de projet (Linear, sprints)', 'Relation client & sales', 'Dev fullstack'],
      color: '$primary600'
    },
    {
      name: 'Corentin',
      role: 'Responsable Design',
      avatar: 'C', 
      specialties: ['UI/UX design', 'Intégration pixel-perfect', 'Expérience utilisateur & flows', 'Dev fullstack'],
      color: '$secondary600'
    },
    {
      name: 'Matthias',
      role: 'Lead Technique',
      avatar: 'M',
      specialties: ['Architecture scalable', 'Backend expert', 'Intégration smart contracts', 'Dev fullstack'],
      color: '$success600'
    },
    {
      name: 'Noé',
      role: 'Creative Dev',
      avatar: 'N',
      specialties: ['Three.js & WebGL', 'Shaders & GLSL', 'Canvas 2D/3D & Physics', 'Dev Fullstack'],
      color: '$warning600'
    }
  ];

  const specialities = [
    {
      category: 'Web & SaaS',
      icon: 'laptop-outline',
      technologies: ['Next.js, React, Node.js', 'Applications fullstack modernes', 'Supabase, PostgreSQL', 'Backends robustes et évolutifs'],
      details: 'Dashboards, APIs, CI/CD',
      color: '$primary600'
    },
    {
      category: 'Web3 & Smart Contracts',
      icon: 'flash-outline',
      technologies: ['Starknet (Cairo, Dojo)', 'zKRollup, jeux onchain, open source', 'Solidity (EVM)', 'Protocoles Ethereum et L2 compatibles'],
      details: 'Minting, staking, XP systems',
      color: '$secondary600'
    },
    {
      category: 'IA & Automatisation',
      icon: 'bulb-outline',
      technologies: ['Intégration GPT / Claude', 'Connexion aux API, fine-tuning', 'Agents IA sur mesure', 'Copilotes autonomes ou semi-assistés'],
      details: 'Scripts, automatisation de tâches métier',
      color: '$success600'
    },
    {
      category: 'Games & Tokenomics',
      icon: 'game-controller-outline',
      technologies: ['Unity, onchain game design', 'Boucles de gameplay sur la blockchain', 'Token economy', 'Achats, crafting, burn, monnaies multiples'],
      details: 'Progression récompensée (farm, social)',
      color: '$warning600'
    }
  ];

  const testimonials = [
    {
      quote: "zKorp is the most seasoned and prolific game studio in the entire dojo ecosystem. They've placed in every dojo game jam and have been instrumental in pushing the boundaries of the dojo stack.",
      author: "@cs_eth",
      role: "Cofounder of Cartridge"
    },
    {
      quote: "zKorp is a great example of a group that participates actively in the Starknet ecosystem, contributing to many different projects as contributors and as maintainers.",
      author: "@blumebee_",
      role: "Head of Community at OnlyDust"
    }
  ];

  return (
    <ScrollView flex={1} bg="$backgroundDark950">
      {/* Hero Section */}
      <Box bg="$backgroundDark950" pt="$16" pb="$20">
        <VStack space="lg" alignItems="center" px="$6">
          <Heading size="4xl" color="$textDark50" textAlign="center" fontWeight="$bold" letterSpacing="-$lg">
            L'équipe
          </Heading>
          <Text size="xl" color="$textDark300" textAlign="center" maxWidth={320}>
            Une équipe complémentaire, 100% technique
          </Text>
        </VStack>
      </Box>

      {/* Team Section */}
      <Box py="$20" px="$6" bg="$backgroundDark900">
        <VStack space="2xl">
          {team.map((member, index) => (
            <Box key={index} bg="$backgroundDark800" p="$8" borderRadius="$3xl" borderWidth={1} borderColor="$backgroundDark700">
              <VStack space="lg">
                <HStack space="lg" alignItems="center">
                  <Avatar size="xl" bg={member.color} borderRadius="$2xl">
                    <AvatarFallbackText color="$white" fontSize="$2xl" fontWeight="$bold">
                      {member.avatar}
                    </AvatarFallbackText>
                  </Avatar>
                  
                  <VStack flex={1} space="sm">
                    <Heading size="2xl" color="$textDark50" fontWeight="$bold">
                      {member.name}
                    </Heading>
                    <Text color={member.color} fontSize="$lg" fontWeight="$semibold">
                      {member.role}
                    </Text>
                  </VStack>
                </HStack>

                <VStack space="md">
                  {member.specialties.map((specialty, specialtyIndex) => (
                    <HStack key={specialtyIndex} space="md" alignItems="center">
                      <Box
                        width={6}
                        height={6}
                        borderRadius="$full"
                        bg={member.color}
                      />
                      <Text color="$textDark300" fontSize="$md" flex={1}>
                        {specialty}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Nos spécialités */}
      <Box py="$20" px="$6" bg="$backgroundDark950">
        <VStack space="xl" alignItems="center">
          <VStack space="sm" alignItems="center">
            <Text fontSize="$sm" color="$primary400" fontWeight="$semibold" textTransform="uppercase" letterSpacing="$lg">
              Nos spécialités
            </Text>
            <Text size="lg" color="$textDark200" textAlign="center" maxWidth={400}>
              Expertise approfondie dans les technologies d'avenir
            </Text>
          </VStack>

          <VStack space="xl" w="100%" maxWidth={600}>
            {specialities.map((spec, index) => (
              <Box key={index} bg="$backgroundDark800" p="$8" borderRadius="$3xl" borderWidth={1} borderColor="$backgroundDark700">
                <VStack space="lg">
                  <HStack space="lg" alignItems="center">
                    <Box 
                      bg="$backgroundDark700" 
                      p="$4" 
                      borderRadius="$2xl"
                    >
                      <Ionicons
                        name={spec.icon as any}
                        size={32}
                        color={spec.color === '$primary600' ? '#0073e6' : 
                               spec.color === '$secondary600' ? '#0284c7' :
                               spec.color === '$success600' ? '#16a34a' : '#f59e0b'}
                      />
                    </Box>
                    <Heading size="xl" color="$textDark50" flex={1} fontWeight="$bold">
                      {spec.category}
                    </Heading>
                  </HStack>

                  <VStack space="md">
                    {spec.technologies.map((tech, techIndex) => (
                      <Text key={techIndex} color="$textDark300" fontSize="$md" lineHeight="$xl">
                        {tech}
                      </Text>
                    ))}
                  </VStack>

                  <Text color={spec.color} fontSize="$md" fontWeight="$medium" fontStyle="italic">
                    {spec.details}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Testimonials */}
      <Box py="$20" px="$6" bg="$backgroundDark900">
        <VStack space="xl" alignItems="center">
          <VStack space="sm" alignItems="center">
            <Text fontSize="$sm" color="$primary400" fontWeight="$semibold" textTransform="uppercase" letterSpacing="$lg">
              Ils nous font confiance
            </Text>
            <Text size="lg" color="$textDark200" textAlign="center" maxWidth={400}>
              Nos partenaires témoignent
            </Text>
          </VStack>

          <VStack space="xl" w="100%" maxWidth={600}>
            {testimonials.map((testimonial, index) => (
              <Box key={index} bg="$backgroundDark800" p="$8" borderRadius="$3xl" borderWidth={1} borderColor="$backgroundDark700">
                <VStack space="lg">
                  <Text color="$textDark200" fontSize="$lg" lineHeight="$2xl" fontStyle="italic" textAlign="center">
                    “{testimonial.quote}”
                  </Text>
                  <VStack space="xs" alignItems="center">
                    <Text color="$primary400" fontSize="$md" fontWeight="$bold">
                      {testimonial.author}
                    </Text>
                    <Text color="$textDark400" fontSize="$sm">
                      {testimonial.role}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </VStack>
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