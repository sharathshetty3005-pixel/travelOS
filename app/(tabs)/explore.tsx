import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { SearchBar } from '@/components/input/SearchBar';
import { GlassCard } from '@/components/layout/GlassCard';
import { SkeletonLoader } from '@/components/feedback/SkeletonLoader';

// Explore Domain Imports
import { CategorySelector, CategoryType } from '@/features/explore/components/CategorySelector';
import {
  buildEditorialRows,
  WideCard,
  StaggeredPairRow,
  EditorialRow,
} from '@/features/explore/components/EditorialDestinationCard';
import { ExploreMapOverlay } from '@/features/explore/components/ExploreMapOverlay';

// Repository Imports
import { destinationRepository } from '@/repositories/DestinationRepository';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExploreScreen() {
  const { colors, spacing, radii, shadow, animation } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [isMapView, setIsMapView] = useState(false);

  // Data Loading States
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<DestinationEntity[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationEntity[]>([]);
  const [editorialRows, setEditorialRows] = useState<EditorialRow[]>([]);

  // Reanimated button scale
  const mapBtnScale = useSharedValue(1);

  // 1. Initial data fetch
  useEffect(() => {
    async function loadDestinations() {
      setLoading(true);
      try {
        const list = await destinationRepository.getFeaturedDestinations();
        setDestinations(list);
      } catch (err) {
        // Silenced for mock simulation
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    }
    loadDestinations();
  }, []);

  // 2. Perform search and category filtering reactively
  useEffect(() => {
    async function filterData() {
      // Set loader during query transitions
      setLoading(true);
      
      const queryResults = await destinationRepository.searchDestinations(searchQuery);
      
      // Filter by category highlights or description keywords
      const finalFiltered = queryResults.filter((dest) => {
        if (activeCategory === 'All') return true;
        
        const textToSearch = `${dest.title} ${dest.country} ${dest.description} ${dest.highlights.join(' ')}`.toLowerCase();
        
        switch (activeCategory) {
          case 'Beaches':
            return textToSearch.includes('amalfi') || textToSearch.includes('beach') || textToSearch.includes('coast') || textToSearch.includes('sea');
          case 'Historic':
            return textToSearch.includes('kyoto') || textToSearch.includes('shrine') || textToSearch.includes('temple') || textToSearch.includes('history');
          case 'Glaciers':
            return textToSearch.includes('reykjavik') || textToSearch.includes('glacier') || textToSearch.includes('arctic');
          case 'Safari':
            return textToSearch.includes('serengeti') || textToSearch.includes('safari') || textToSearch.includes('savannah');
          case 'Alpine':
            return textToSearch.includes('reykjavik') || textToSearch.includes('mountain') || textToSearch.includes('falls');
          default:
            return true;
        }
      });

      setFilteredDestinations(finalFiltered);
      setEditorialRows(buildEditorialRows(finalFiltered));
      
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }

    filterData();
  }, [searchQuery, activeCategory, destinations]);

  // Reanimated style for the floating map selector button
  const mapBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: mapBtnScale.value }],
    };
  });

  const toggleMapView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setIsMapView((prev) => !prev);
  };

  const handleMapBtnPressIn = () => {
    mapBtnScale.value = withSpring(0.92, animation.spring.snappy);
  };

  const handleMapBtnPressOut = () => {
    mapBtnScale.value = withSpring(1.0, animation.spring.snappy);
  };

  if (isMapView) {
    return (
      <ExploreMapOverlay
        destinations={filteredDestinations}
        onClose={toggleMapView}
      />
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar style="light" />

      {/* Editorial Header Panel */}
      <View style={[styles.headerPanel, { paddingTop: insets.top + 12 }]}>
        <View style={[styles.titleRow, { paddingHorizontal: spacing.xlarge }]}>
          <View>
            <CustomText variant="caption" weight="700" color={colors.accentGold}>
              DISCOVERY GRID
            </CustomText>
            <CustomText variant="heading" weight="700" color="#FFFFFF">
              Explore Destinations
            </CustomText>
          </View>
        </View>

        {/* Floating search bar & category selector */}
        <View style={[styles.searchWrapper, { paddingHorizontal: spacing.xlarge, marginTop: spacing.medium }]}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search country, landmarks, highlights..."
          />
        </View>

        <View style={{ marginTop: spacing.medium, marginBottom: spacing.small }}>
          <CategorySelector
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </View>
      </View>

      {/* Main Grid View */}
      {loading ? (
        // Editorial shimmering skeletons
        <ScrollView contentContainerStyle={[styles.skeletonContainer, { paddingHorizontal: spacing.xlarge, gap: spacing.medium }]}>
          <SkeletonLoader width="100%" height={190} borderRadius={16} />
          <View style={styles.skeletonPairRow}>
            <SkeletonLoader width={(SCREEN_WIDTH - 2 * spacing.xlarge - spacing.small) / 2} height={240} borderRadius={16} />
            <SkeletonLoader width={(SCREEN_WIDTH - 2 * spacing.xlarge - spacing.small) / 2} height={180} borderRadius={16} />
          </View>
        </ScrollView>
      ) : editorialRows.length === 0 ? (
        // Premium glass empty state visual representation
        <View style={styles.emptyContainer}>
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="search" size={32} color={colors.accentGold} />
            <CustomText variant="body" weight="500" color="#FFFFFF" style={styles.emptyTitle}>
              No Matches Found
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary} style={styles.emptySubtitle}>
              We couldn't find matches for "{searchQuery}". Try updating your category filters or search parameters.
            </CustomText>
          </GlassCard>
        </View>
      ) : (
        // Staggered magazine FlatList
        <FlashList
          data={editorialRows}
          keyExtractor={(item) => item.id}
          estimatedItemSize={250}
          contentContainerStyle={{
            paddingHorizontal: spacing.xlarge,
            paddingBottom: insets.bottom + 90, // extra offset for floating map btn
          }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.medium }} />}
          renderItem={({ item }) => {
            if (item.type === 'wide' && item.wideItem) {
              return <WideCard item={item.wideItem} />;
            } else if (item.type === 'pair' && item.leftItem) {
              return <StaggeredPairRow left={item.leftItem} right={item.rightItem} />;
            }
            return null;
          }}
        />
      )}

      {/* Floating Map Explorer trigger button */}
      {!loading && (
        <Animated.View style={[styles.floatingMapBtnWrapper, { bottom: insets.bottom + 20 }, mapBtnStyle]}>
          <Pressable
            onPress={toggleMapView}
            onPressIn={handleMapBtnPressIn}
            onPressOut={handleMapBtnPressOut}
            accessibilityRole="button"
            accessibilityLabel="Open Map Viewer"
            style={[styles.floatingMapBtn, { backgroundColor: 'rgba(24, 24, 28, 0.95)', borderColor: colors.border }]}
          >
            <Ionicons name="map" size={16} color={colors.accentGold} />
            <CustomText variant="caption" weight="700" color="#FFFFFF" style={styles.mapBtnText}>
              MAP EXPLORER
            </CustomText>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerPanel: {
    width: '100%',
    backgroundColor: 'rgba(10, 10, 12, 0.96)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchWrapper: {
    width: '100%',
  },
  skeletonContainer: {
    paddingVertical: 16,
  },
  skeletonPairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  emptyTitle: {
    marginTop: 12,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  floatingMapBtnWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 90,
  },
  floatingMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 0.8,
  },
  mapBtnText: {
    marginLeft: 8,
    letterSpacing: 1,
  },
});
