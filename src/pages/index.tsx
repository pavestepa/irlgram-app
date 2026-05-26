import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/entities/signin/ui';
import { AnimatedIcon } from '@/shared/components/animated-icon';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/shared/constants/theme';

export default function HomeScreen() {
  const { session, signOut } = useSession();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            irlgram
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Вы авторизованы
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <ThemedText type="small">
            Сессия активна до{' '}
            <ThemedText type="code">
              {session ? new Date(session.expiresAt).toLocaleString() : '—'}
            </ThemedText>
          </ThemedText>

          <Pressable
            onPress={() => void signOut()}
            style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}>
            <ThemedText type="linkPrimary">Выйти</ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  signOutButton: {
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
});
