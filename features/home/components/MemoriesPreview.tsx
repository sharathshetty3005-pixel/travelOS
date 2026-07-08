import React from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { MemoryEntity } from '@/mocks/memories';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MemoriesPreviewProps {
  memories: MemoryEntity[];
}

export const MemoriesPreview = React.memo(function MemoriesPreview({
  memories,
}: MemoriesPreviewProps) {
  const { spacing, radii, shadow, colors } = useAppTheme();

  if (memories.length === 0) return null;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Build a 3-card staggered collage layout:
  // Card 1: Large Wide backdrop
  // Card 2 & 3: Two side-by-side columns of unequal heights
  const firstMemory = memories[0];
  const secondMemory = memories[1];
  const thirdMemory = memories[2];

  const colWidth = (SCREEN_WIDTH - 2 * spacing.xlarge - spacing.small) / 2;

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.xlarge }]}>
      {/* 1. Large Wide Card */}
      {firstMemory && (
        <Pressable onPress={handlePress} style={styles.row}>
          <GlassCard style={[styles.card, shadow.sm]}>
            <View style={styles.wideImgContainer}>
              <Image
                source={firstMemory.imageUrl}
                style={[StyleSheet.absoluteFillObject, { borderRadius: radii.m }]}
                contentFit="cover"
              />
              <View style={[styles.locationTag, { backgroundColor: 'rgba(10,10,12,0.7)', borderRadius: radii.s }]}>
                <Ionicons name="location" size={10} color={colors.accentGold} />
                <CustomText variant="caption" weight="600" color="#FFFFFF" style={styles.tagText}>
                  {firstMemory.locationName}
                </CustomText>
              </View>
            </View>
            <View style={styles.meta}>
              <CustomText variant="label" weight="600" color="#FFFFFF">
                {firstMemory.title}
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary}>
                Captured {firstMemory.date}
              </CustomText>
            </View>
          </GlassCard>
        </Pressable>
      )}

      {/* 2. Side by Side columns (Staggered Heights) */}
      <View style={[styles.pairRow, { gap: spacing.small, marginTop: spacing.small }]}>
        {secondMemory && (
          <Pressable onPress={handlePress} style={{ width: colWidth }}>
            <GlassCard style={[styles.card, shadow.sm]}>
              <View style={[styles.colImgContainer, { height: 160 }]}>
                <Image
                  source={secondMemory.imageUrl}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: radii.m }]}
                  contentFit="cover"
                />
                <View style={[styles.locationTag, { backgroundColor: 'rgba(10,10,12,0.7)', borderRadius: radii.s }]}>
                  <CustomText variant="caption" weight="600" color="#FFFFFF" style={styles.tagText}>
                    {secondMemory.locationName.split(',')[0]}
                  </CustomText>
                </View>
              </View>
              <View style={styles.meta}>
                <CustomText variant="caption" weight="600" color="#FFFFFF" numberOfLines={1}>
                  {secondMemory.title}
                </CustomText>
                <CustomText variant="caption" color={colors.textSecondary}>
                  {secondMemory.date}
                </CustomText>
              </View>
            </GlassCard>
          </Pressable>
        )}

        {thirdMemory && (
          <Pressable onPress={handlePress} style={{ width: colWidth }}>
            <GlassCard style={[styles.card, shadow.sm]}>
              <View style={[styles.colImgContainer, { height: 120 }]}>
                <Image
                  source={thirdMemory.imageUrl}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: radii.m }]}
                  contentFit="cover"
                />
                <View style={[styles.locationTag, { backgroundColor: 'rgba(10,10,12,0.7)', borderRadius: radii.s }]}>
                  <CustomText variant="caption" weight="600" color="#FFFFFF" style={styles.tagText}>
                    {thirdMemory.locationName.split(',')[0]}
                  </CustomText>
                </View>
              </View>
              <View style={styles.meta}>
                <CustomText variant="caption" weight="600" color="#FFFFFF" numberOfLines={1}>
                  {thirdMemory.title}
                </CustomText>
                <CustomText variant="caption" color={colors.textSecondary}>
                  {thirdMemory.date}
                </CustomText>
              </View>
            </GlassCard>
          </Pressable>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    width: '100%',
  },
  pairRow: {
    flexDirection: 'row',
    width: '100%',
  },
  card: {
    padding: 10,
    borderWidth: 0.5,
  },
  wideImgContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  colImgContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  locationTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  tagText: {
    marginLeft: 3,
    fontSize: 9,
  },
  meta: {
    marginTop: 8,
  },
});
