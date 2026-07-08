import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '@/theme';
import { Chip } from '@/components/input/Chip';

export type CategoryType = 'All' | 'Beaches' | 'Historic' | 'Glaciers' | 'Safari' | 'Alpine';

const CATEGORIES: CategoryType[] = ['All', 'Beaches', 'Historic', 'Glaciers', 'Safari', 'Alpine'];

interface CategorySelectorProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export const CategorySelector = React.memo(function CategorySelector({
  activeCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  const { spacing } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: spacing.xlarge, gap: spacing.small },
      ]}
    >
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          active={activeCategory === cat}
          onPress={() => onSelectCategory(cat)}
        />
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
});
