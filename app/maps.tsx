import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';

export default function MapsScreen() {
  const { colors, spacing, radii, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.container}>
        <GlassCard style={styles.card}>
          <Ionicons name="map" size={48} color={colors.accentGold} />
          <CustomText variant="title" weight="700" color="#FFFFFF" style={styles.title}>
            Offline Maps
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={styles.subtitle}>
            Vector navigation maps and topological guides cached for offline travel.
          </CustomText>
          <Pressable
            onPress={handleBack}
            style={[styles.btn, { backgroundColor: colors.accentGold, borderRadius: radii.s }]}
          >
            <CustomText variant="caption" weight="700" color="#000000">
              RETURN TO DASHBOARD
            </CustomText>
          </Pressable>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginTop: 12,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 24,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
});
