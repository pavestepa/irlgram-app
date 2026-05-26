import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhoneSignInForm, SmsSignInOverlay } from '@/entities/signin/ui';
import { AnimatedIcon } from '@/shared/components/animated-icon';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/shared/constants/theme';

export default function SignInScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSmsVisible, setIsSmsVisible] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!phoneNumber.trim()) {
      setPhoneError('Введите номер телефона');
      return;
    }

    setPhoneError(null);
    setIsSmsVisible(true);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            irlgram
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Войдите, чтобы продолжить
          </ThemedText>
        </ThemedView>

        <PhoneSignInForm
          phoneNumber={phoneNumber}
          onChangePhoneNumber={setPhoneNumber}
          onContinue={handleContinue}
          error={phoneError}
        />
      </SafeAreaView>

      <SmsSignInOverlay
        visible={isSmsVisible}
        phoneNumber={phoneNumber}
        onClose={() => setIsSmsVisible(false)}
      />
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
});
