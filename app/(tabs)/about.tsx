import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Heading, 
  Card,
  Badge,
  BadgeText,
  Button,
  ButtonText,
  AlertCircleIcon,
  CheckCircleIcon,
  Alert,
  AlertIcon,
  AlertText
} from '@gluestack-ui/themed';

export default function AboutScreen() {
  return (
    <Box flex={1} bg="$backgroundLight50" p="$4">
      <VStack space="md">
        <Heading size="xl" color="$primary700" textAlign="center" mb="$4">
          À Propos - Test Theming
        </Heading>
        
        <Card size="md" variant="elevated" mb="$3">
          <Text size="md" color="$textLight600" mb="$2">
            Composants de test avec couleurs personnalisées:
          </Text>
          <HStack space="sm" flexWrap="wrap">
            <Badge size="md" variant="solid" action="success">
              <BadgeText>Succès</BadgeText>
            </Badge>
            <Badge size="md" variant="solid" action="error">
              <BadgeText>Erreur</BadgeText>
            </Badge>
            <Badge size="md" variant="solid" action="warning">
              <BadgeText>Warning</BadgeText>
            </Badge>
            <Badge size="md" variant="solid" action="info">
              <BadgeText>Info</BadgeText>
            </Badge>
          </HStack>
        </Card>

        <Alert action="success" variant="solid" mb="$3">
          <AlertIcon as={CheckCircleIcon} />
          <AlertText>
            gluestack-ui correctement configuré avec le thème personnalisé!
          </AlertText>
        </Alert>

        <Alert action="error" variant="outline" mb="$3">
          <AlertIcon as={AlertCircleIcon} />
          <AlertText>
            Ceci est un test d&apos;alerte d&apos;erreur avec couleurs personnalisées
          </AlertText>
        </Alert>

        <VStack space="sm">
          <Button size="lg" variant="solid" action="primary">
            <ButtonText>Primary Button</ButtonText>
          </Button>
          <Button size="md" variant="outline" action="secondary">
            <ButtonText>Secondary Outline</ButtonText>
          </Button>
          <Button size="sm" variant="solid" action="positive">
            <ButtonText>Success Button</ButtonText>
          </Button>
          <Button size="sm" variant="solid" action="negative">
            <ButtonText>Error Button</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
