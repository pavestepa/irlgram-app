import { StyleSheet } from 'react-native';

import { UserLocationMap } from '@/entities/map/ui';
import { ThemedView } from '@/shared/components/themed-view';

export default function MapScreen() {
  return (
    <ThemedView style={styles.container}>
      <UserLocationMap />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
