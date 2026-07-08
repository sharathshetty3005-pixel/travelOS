import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { AnimatedSpinner } from './AnimatedSpinner';
import { GlassCard } from '../layout/GlassCard';

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  const { colors } = useAppTheme();

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.overlay }]}>
      <GlassCard style={styles.card}>
        <AnimatedSpinner size={28} color={colors.accentGold} />
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
});
