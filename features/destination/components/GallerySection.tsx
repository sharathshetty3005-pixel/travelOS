import React from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GallerySectionProps {
  destination: DestinationEntity;
}

interface PhotoItem {
  id: string;
  url: string;
  height: number;
}

// Detailed high-res travel photos mapped to destination keys
const GALLERY_PHOTOS: Record<string, PhotoItem[]> = {
  'dest-amalfi': [
    { id: 'amalfi-gal-01', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=400&auto=format&fit=crop', height: 180 },
    { id: 'amalfi-gal-02', url: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=400&auto=format&fit=crop', height: 260 },
    { id: 'amalfi-gal-03', url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=400&auto=format&fit=crop', height: 240 },
    { id: 'amalfi-gal-04', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop', height: 170 },
  ],
  'dest-kyoto': [
    { id: 'kyoto-gal-01', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop', height: 220 },
    { id: 'kyoto-gal-02', url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=400&auto=format&fit=crop', height: 160 },
    { id: 'kyoto-gal-03', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=400&auto=format&fit=crop', height: 250 },
    { id: 'kyoto-gal-04', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400&auto=format&fit=crop', height: 180 },
  ],
  'dest-reykjavik': [
    { id: 'reyk-gal-01', url: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=400&auto=format&fit=crop', height: 170 },
    { id: 'reyk-gal-02', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop', height: 250 },
    { id: 'reyk-gal-03', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=400&auto=format&fit=crop', height: 200 },
    { id: 'reyk-gal-04', url: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?q=80&w=400&auto=format&fit=crop', height: 240 },
  ],
  'dest-serengeti': [
    { id: 'serengeti-gal-01', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=400&auto=format&fit=crop', height: 240 },
    { id: 'serengeti-gal-02', url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=400&auto=format&fit=crop', height: 180 },
    { id: 'serengeti-gal-03', url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=400&auto=format&fit=crop', height: 160 },
    { id: 'serengeti-gal-04', url: 'https://images.unsplash.com/photo-1519074069444-1ba4e66640c2?q=80&w=400&auto=format&fit=crop', height: 250 },
  ],
};

export const GallerySection = React.memo(function GallerySection({
  destination,
}: GallerySectionProps) {
  const { colors, spacing, radii } = useAppTheme();
  
  const photos = GALLERY_PHOTOS[destination.id] || GALLERY_PHOTOS['dest-amalfi'];

  const leftColumn = photos.filter((_, idx) => idx % 2 === 0);
  const rightColumn = photos.filter((_, idx) => idx % 2 === 1);

  const columnWidth = (SCREEN_WIDTH - 2 * spacing.xlarge - spacing.small) / 2;

  const handlePhotoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={[styles.sectionHeaderWrapper, { paddingHorizontal: spacing.xlarge }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          VISUAL ALBUM
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Photo Gallery
        </CustomText>
      </View>

      <View style={[styles.grid, { paddingHorizontal: spacing.xlarge, gap: spacing.small }]}>
        {/* Left Column */}
        <View style={styles.column}>
          {leftColumn.map((photo) => (
            <Pressable key={photo.id} onPress={handlePhotoPress} style={styles.pressable}>
              <View style={[styles.imageWrapper, { height: photo.height, borderRadius: radii.m }]}>
                <Image
                  source={photo.url}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          {rightColumn.map((photo) => (
            <Pressable key={photo.id} onPress={handlePhotoPress} style={styles.pressable}>
              <View style={[styles.imageWrapper, { height: photo.height, borderRadius: radii.m }]}>
                <Image
                  source={photo.url}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeaderWrapper: {
    width: '100%',
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    width: '100%',
  },
  column: {
    flex: 1,
  },
  pressable: {
    marginBottom: 10,
  },
  imageWrapper: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
});
