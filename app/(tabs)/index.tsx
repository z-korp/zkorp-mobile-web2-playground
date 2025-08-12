import { Link } from 'expo-router';
import { Box, Text, Button, ButtonText, VStack, Heading } from '@gluestack-ui/themed';

export default function Index() {
  return (
    <Box flex={1} bg="$backgroundLight100" alignItems="center" justifyContent="center" p="$6">
      <VStack space="lg" alignItems="center">
        <Heading size="2xl" color="$primary600">
          Welcome Home
        </Heading>
        <Text size="lg" textAlign="center" color="$textLight700">
          Test des composants gluestack-ui avec theming personnalisé
        </Text>
        <Button size="lg" variant="solid" action="primary" hardShadow="2">
          <ButtonText>Button Principal</ButtonText>
        </Button>
        <Button size="md" variant="outline" action="secondary">
          <ButtonText>Button Secondaire</ButtonText>
        </Button>
        <Link href="/about" asChild>
          <Button variant="link" action="primary">
            <ButtonText>Aller à About</ButtonText>
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}
