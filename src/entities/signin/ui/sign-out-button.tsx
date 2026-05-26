import { Pressable, StyleSheet } from 'react-native';

import { useSession } from '@/entities/signin/ui';
import { ThemedText } from '@/shared/components/themed-text';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

type SignOutButtonProps = {
  label?: string;
};

export function SignOutButton({ label = 'Выйти из аккаунта' }: SignOutButtonProps) {
  const theme = useTheme();
  const { signOut } = useSession();

  return (
    <Pressable
      onPress={() => void signOut()}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
      ]}>
      <ThemedText type="linkPrimary">{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
});
