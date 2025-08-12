import React, { useState } from 'react';
import { 
  Box, 
  ScrollView,
  VStack, 
  HStack,
  Text, 
  Button,
  ButtonText,
  Input,
  InputField,
  Card,
  Heading,
  Center,
  LinearGradient,
  Pressable,
  Divider,
  Alert,
  AlertIcon,
  AlertText,
  CheckCircleIcon,
  AlertCircleIcon
} from '@gluestack-ui/themed';
import { Link, router } from 'expo-router';
import ZkorpLogo from '@/components/ZkorpLogo';
import { useAuthStore } from '@/stores/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error.message || 'Erreur de connexion');
      } else {
        router.replace('/(drawer)/(tabs)/home');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: 'shield-checkmark',
      title: 'Sécurisé',
      description: 'Vos données sont protégées'
    },
    {
      icon: 'cloud-upload',
      title: 'Synchronisé',
      description: 'Accès sur tous vos appareils'
    },
    {
      icon: 'person',
      title: 'Personnalisé',
      description: 'Expérience adaptée à vos besoins'
    }
  ];

  return (
    <ScrollView flex={1} bg="$backgroundDark950">
      {/* Hero Section */}
      <LinearGradient
        colors={['$primary600', '$primary700', '$secondary600']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Box p="$8" pb="$12">
          <VStack space="lg" alignItems="center">
            <ZkorpLogo size={100} />
            
            <VStack space="md" alignItems="center" mt="$4">
              <Heading size="2xl" color="$white" textAlign="center" fontWeight="$bold">
                Bienvenue !
              </Heading>
              <Text size="md" color="$primary200" textAlign="center" maxWidth={280}>
                Connectez-vous pour accéder à toutes nos fonctionnalités
              </Text>
            </VStack>
          </VStack>
        </Box>
      </LinearGradient>

      {/* Login Form */}
      <Box p="$6" bg="$backgroundDark900" mt="-$6" borderTopLeftRadius="$2xl" borderTopRightRadius="$2xl">
        <Card size="lg" variant="elevated" bg="$backgroundDark800">
          <VStack space="lg" p="$6">
            <Heading size="lg" color="$primary400" textAlign="center">
              Connexion
            </Heading>

            {error && (
              <Alert action="error" variant="outline">
                <AlertIcon as={AlertCircleIcon} />
                <AlertText>{error}</AlertText>
              </Alert>
            )}

            <VStack space="md">
              <VStack space="xs">
                <Text color="$textDark300" fontSize="$sm" fontWeight="$medium">
                  Email
                </Text>
                <Input size="lg" variant="outline">
                  <InputField
                    placeholder="votre@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </Input>
              </VStack>

              <VStack space="xs">
                <Text color="$textDark300" fontSize="$sm" fontWeight="$medium">
                  Mot de passe
                </Text>
                <Input size="lg" variant="outline">
                  <InputField
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                </Input>
                <Pressable onPress={() => setShowPassword(!showPassword)} alignSelf="flex-end">
                  <Text color="$primary600" fontSize="$sm">
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </Text>
                </Pressable>
              </VStack>
            </VStack>

            <VStack space="sm">
              <Button 
                size="lg" 
                variant="solid" 
                action="primary"
                onPress={handleLogin}
                isDisabled={isLoading}
              >
                <ButtonText fontWeight="$bold">
                  {isLoading ? 'Connexion...' : 'Se Connecter'}
                </ButtonText>
              </Button>

              <Pressable>
                <Text color="$primary600" fontSize="$sm" textAlign="center">
                  Mot de passe oublié ?
                </Text>
              </Pressable>
            </VStack>

            <Divider />

            <VStack space="sm" alignItems="center">
              <Text color="$textDark300" fontSize="$sm">
                Vous n&apos;avez pas de compte ?
              </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Button variant="outline" action="secondary">
                  <ButtonText>Créer un Compte</ButtonText>
                </Button>
              </Link>
            </VStack>
          </VStack>
        </Card>
      </Box>

      {/* Benefits Section */}
      <Box p="$6" bg="$backgroundDark850">
        <VStack space="lg">
          <VStack space="md" alignItems="center">
            <Heading size="lg" color="$primary400" textAlign="center">
              Pourquoi Créer un Compte ?
            </Heading>
            <Text size="sm" color="$textDark300" textAlign="center" maxWidth={300}>
              Profitez de tous les avantages d&apos;un compte Zkorp
            </Text>
          </VStack>

          <VStack space="md">
            {benefits.map((benefit, index) => (
              <Card key={index} size="md" variant="elevated" bg="$backgroundDark800">
                <HStack space="md" alignItems="center" p="$4">
                  <Center 
                    bg="$primary100" 
                    borderRadius="$full" 
                    size={50}
                  >
                    <Ionicons
                      name={benefit.icon as any}
                      size={24}
                      color="#0073e6"
                    />
                  </Center>
                  <VStack flex={1} space="xs">
                    <Text color="$textDark50" fontSize="$md" fontWeight="$semibold">
                      {benefit.title}
                    </Text>
                    <Text color="$textDark300" fontSize="$sm">
                      {benefit.description}
                    </Text>
                  </VStack>
                </HStack>
              </Card>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Demo Account */}
      <Box p="$6" bg="$backgroundDark900">
        <Card size="lg" variant="elevated" bg="$backgroundDark800" borderColor="$success600" borderWidth={1}>
          <VStack space="md" alignItems="center" p="$5">
            <Alert action="success" variant="outline" w="100%">
              <AlertIcon as={CheckCircleIcon} />
              <AlertText>
                Compte de démonstration disponible
              </AlertText>
            </Alert>
            
            <Text color="$textDark300" fontSize="$sm" textAlign="center">
              Email: demo@zkorp.fr
            </Text>
            <Text color="$textDark300" fontSize="$sm" textAlign="center">
              Mot de passe: demo123
            </Text>
            
            <Button 
              size="md" 
              variant="solid" 
              action="success"
              onPress={() => {
                setEmail('demo@zkorp.fr');
                setPassword('demo123');
              }}
            >
              <ButtonText>Utiliser le Compte Démo</ButtonText>
            </Button>
          </VStack>
        </Card>
      </Box>
    </ScrollView>
  );
}