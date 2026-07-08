import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';

interface AvatarProps {
  uri?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
}

export const Avatar = React.memo(function Avatar({
  uri,
  size = 'md',
  name,
}: AvatarProps) {
  const { colors, avatarSizes, radii, spacing } = useAppTheme();

  const dimension = avatarSizes[size];
  const borderRadius = radii.capsule;

  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  };

  // Fetch name initials for fallback view
  const getInitials = (fullName?: string): string => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (uri) {
    return (
      <View style={containerStyle}>
        <Image
          source={uri}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
      </View>
    );
  }

  // Text fallback initials layout
  const initials = getInitials(name);
  const textVariant = size === 'sm' ? 'caption' : size === 'xl' ? 'heading' : 'body';

  return (
    <View style={[containerStyle, { borderColor: colors.border, borderWidth: 1 }]}>
      <CustomText
        variant={textVariant}
        weight="600"
        color={colors.accentGold}
      >
        {initials}
      </CustomText>
    </View>
  );
});
