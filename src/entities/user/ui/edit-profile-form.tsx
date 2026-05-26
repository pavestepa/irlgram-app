import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

import { updateCurrentUser } from '../api';
import type { User } from '../model';
import { validateDisplayName, validateUsername } from '../model';
import { UserAvatarPhotoButton } from './user-avatar-photo-button';

type EditProfileFormProps = {
  user: User;
  onSaved: (user: User) => void;
};

export function EditProfileForm({ user, onSaved }: EditProfileFormProps) {
  const theme = useTheme();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    const usernameError = validateUsername(username);
    const displayNameError = validateDisplayName(displayName);

    if (usernameError || displayNameError) {
      setError(usernameError ?? displayNameError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const updatedUser = await updateCurrentUser({
        username: username.trim(),
        displayName: displayName.trim(),
        bio: bio.trim(),
      });
      onSaved(updatedUser);
    } catch {
      setError('Не удалось сохранить изменения');
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <UserAvatarPhotoButton />

      <View style={styles.field}>
        <ThemedText type="smallBold">Имя</ThemedText>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Видимое имя"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Никнейм</ThemedText>
        <TextInput
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          placeholder="username"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <ThemedText type="small" themeColor="textSecondary">
          Только буквы, цифры и _
        </ThemedText>
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Био</ThemedText>
        <TextInput
          multiline
          value={bio}
          onChangeText={setBio}
          placeholder="О себе"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            styles.multiline,
            { color: theme.text, borderColor: theme.backgroundSelected },
          ]}
        />
      </View>

      {error ? (
        <ThemedText type="small" themeColor="textSecondary">
          {error}
        </ThemedText>
      ) : null}

      <Pressable
        disabled={isSubmitting}
        onPress={() => void handleSave()}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.text, opacity: pressed || isSubmitting ? 0.7 : 1 },
        ]}>
        <ThemedText style={styles.buttonText} themeColor="background">
          {isSubmitting ? 'Сохранение...' : 'Изменить'}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
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
