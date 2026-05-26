import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/constants/theme';

type EditProfileButtonProps = {
  accessibilityLabel: string;
};

export function EditProfileButton({ accessibilityLabel }: EditProfileButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={() => router.push('/profile/edit')}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <SymbolView
        name={{ ios: 'pencil', android: 'edit' }}
        size={16}
        tintColor={theme.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
