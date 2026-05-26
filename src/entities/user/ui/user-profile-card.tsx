import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/shared/constants/theme';

import type { User } from '../model';
import { UserAvatar } from './user-avatar';
import { UserProfileField } from './user-profile-field';

type UserProfileCardProps = {
  user: User;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <View style={styles.container}>
      <UserAvatar user={user} />
      <UserProfileField
        label="Имя"
        value={user.displayName}
        accessibilityLabel="Редактировать имя"
      />
      <UserProfileField
        label="Никнейм"
        value={`@${user.username}`}
        accessibilityLabel="Редактировать никнейм"
      />
      <UserProfileField label="Био" value={user.bio ?? ''} accessibilityLabel="Редактировать био" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
    alignItems: 'stretch',
  },
});
