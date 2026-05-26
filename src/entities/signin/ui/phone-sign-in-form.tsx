import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

type PhoneSignInFormProps = {
  phoneNumber: string;
  onChangePhoneNumber: (value: string) => void;
  onContinue: () => void;
  error?: string | null;
};

export function PhoneSignInForm({
  phoneNumber,
  onChangePhoneNumber,
  onContinue,
  error,
}: PhoneSignInFormProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.form}>
      <ThemedText type="smallBold">Телефон</ThemedText>
      <TextInput
        autoCapitalize="none"
        keyboardType="phone-pad"
        placeholder="+79000000000"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        value={phoneNumber}
        onChangeText={onChangePhoneNumber}
      />

      {error ? (
        <ThemedText type="small" themeColor="error">
          {error}
        </ThemedText>
      ) : null}

      <Pressable
        disabled={!phoneNumber.trim()}
        onPress={onContinue}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.text, opacity: pressed || !phoneNumber.trim() ? 0.7 : 1 },
        ]}>
        <ThemedText style={styles.buttonText} themeColor="background">
          Продолжить
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  form: {
    alignSelf: 'stretch',
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
  button: {
    marginTop: Spacing.two,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
});
