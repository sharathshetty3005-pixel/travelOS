import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = React.memo(function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.medium }]}>
      <CustomText variant="title" weight="600" color={colors.textPrimary}>
        {title}
      </CustomText>
      
      {actionLabel && onActionPress && (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} section redirect button`}
          style={styles.pressable}
        >
          <CustomText variant="label" color={colors.accentGold}>
            {actionLabel}
          </CustomText>
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  pressable: {
    paddingVertical: 4,
    paddingLeft: 12,
  },
});
