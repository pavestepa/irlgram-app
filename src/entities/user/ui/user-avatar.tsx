import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

import type { User } from '../model';
import { EditProfileButton } from './edit-profile-button';

type UserAvatarProps = {
  user: User;
};

function getInitials(displayName: string) {
  return displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function UserAvatar({ user }: UserAvatarProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.image} />
        ) : (
          <ThemedText type="subtitle" themeColor="textSecondary">
            {getInitials(user.displayName || user.username)}
          </ThemedText>
        )}
      </View>
      <View style={styles.editButton}>
        <EditProfileButton accessibilityLabel="Редактировать профиль" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editButton: {
    position: 'absolute',
    right: -Spacing.one,
    bottom: 0,
  },
});
