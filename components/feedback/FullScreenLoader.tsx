import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { CustomText } from '../typography/CustomText';
import { AnimatedSpinner } from './AnimatedSpinner';
import { GlassCard } from '../layout/GlassCard';

interface FullScreenLoaderProps {
  message?: string;
}

export function FullScreenLoader({ message = 'Synchronizing travel files...' }: FullScreenLoaderProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <GlassCard style={styles.card}>
        <AnimatedSpinner size={32} color={colors.accentGold} />
        <CustomText
          variant="label"
          color={colors.textPrimary}
          style={[styles.text, { marginTop: spacing.medium }]}
        >
          {message}
        </CustomText>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Overlay everything
  },
  card: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  text: {
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
