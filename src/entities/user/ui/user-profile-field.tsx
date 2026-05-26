import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Spacing } from '@/shared/constants/theme';

import { EditProfileButton } from './edit-profile-button';

type UserProfileFieldProps = {
  label: string;
  value: string;
  accessibilityLabel: string;
};

export function UserProfileField({ label, value, accessibilityLabel }: UserProfileFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="smallBold">{label}</ThemedText>
        <EditProfileButton accessibilityLabel={accessibilityLabel} />
      </View>
      <ThemedText>{value || '—'}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
