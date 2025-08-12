import { StyleSheet, View } from 'react-native';
import { LocationTracker } from '@/components/LocationTracker';

export default function LocationScreen() {
  return (
    <View style={styles.container}>
      <LocationTracker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});