import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { resendSmsCode } from '../api/resend-sms';
import { useResendCountdown } from '../hooks/use-resend-countdown';
import { useSession } from './session-provider';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

type SmsSignInOverlayProps = {
  visible: boolean;
  phoneNumber: string;
  onClose: () => void;
};

export function SmsSignInOverlay({ visible, phoneNumber, onClose }: SmsSignInOverlayProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { signIn } = useSession();
  const [smsCode, setSmsCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { secondsLeft, canResend, restart } = useResendCountdown(visible);

  useEffect(() => {
    if (!visible) {
      setSmsCode('');
      setError(null);
      setIsSubmitting(false);
      setIsResending(false);
    }
  }, [visible]);

  const handleResend = async () => {
    if (!canResend || isResending) {
      return;
    }

    setError(null);
    setIsResending(true);

    try {
      await resendSmsCode(phoneNumber);
      restart();
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'Не удалось отправить код');
    } finally {
      setIsResending(false);
    }
  };

  const handleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn({ phoneNumber, smsCode });
    } catch (signInError) {
      setError(
        signInError instanceof Error ? signInError.message : 'Неверно введены данные',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal animationType="none" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.duration(280)}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="linkPrimary">Назад</ThemedText>
            </Pressable>
            <ThemedText type="smallBold">Код из SMS</ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <ThemedText themeColor="textSecondary" style={styles.phoneHint}>
            Отправили код на {phoneNumber}
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.form}>
            <ThemedText type="smallBold">SMS-код</ThemedText>
            <TextInput
              autoCapitalize="none"
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
              value={smsCode}
              onChangeText={setSmsCode}
            />

            <View style={styles.errorSlot}>
              {error ? (
                <ThemedText type="small" themeColor="error">
                  {error}
                </ThemedText>
              ) : null}
            </View>

            <Pressable
              disabled={!canResend || isResending}
              onPress={() => void handleResend()}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: theme.backgroundElement,
                  opacity: !canResend || isResending || pressed ? 0.7 : 1,
                },
              ]}>
              <ThemedText type="small">
                {isResending
                  ? 'Отправка...'
                  : canResend
                    ? 'Отправить повторно'
                    : `Отправить повторно (${secondsLeft} сек)`}
              </ThemedText>
            </Pressable>

            <Pressable
              disabled={isSubmitting || !smsCode.trim()}
              onPress={() => void handleSignIn()}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: theme.text,
                  opacity: pressed || isSubmitting || !smsCode.trim() ? 0.7 : 1,
                },
              ]}>
              <ThemedText style={styles.buttonText} themeColor="background">
                {isSubmitting ? 'Вход...' : 'Войти'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    borderBottomLeftRadius: Spacing.four,
    borderBottomRightRadius: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 56,
  },
  phoneHint: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  errorSlot: {
    minHeight: 20,
    justifyContent: 'center',
  },
  secondaryButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
