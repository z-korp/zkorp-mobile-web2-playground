import CubeScene from '@/components/CubeScene';
import { Link } from 'expo-router';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <CubeScene />
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    marginTop: 20,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
