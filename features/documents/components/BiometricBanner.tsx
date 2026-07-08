import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';

export const BiometricBanner = React.memo(function BiometricBanner() {
  const { colors, spacing, shadow } = useAppTheme();

  return (
    <GlassCard style={[styles.card, shadow.sm, { borderColor: colors.accentGold }]}>
      <View style={styles.leftCol}>
        <Ionicons name="lock-closed" size={20} color={colors.accentGold} />
        <View style={styles.textGroup}>
          <CustomText variant="label" weight="700" color={colors.textPrimary}>
            BIOMETRIC LOCK ACTIVE
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
            Encrypted end-to-end. Decrypts via Face ID or passcode.
          </CustomText>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Ionicons name="scan-outline" size={22} color={colors.accentGold} />
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1.5,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  textGroup: {
    marginLeft: 14,
  },
  rightCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
