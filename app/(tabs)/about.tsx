import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>About screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
