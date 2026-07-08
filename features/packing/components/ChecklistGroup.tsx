import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Layout,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { PackingItem } from '@/mocks/trips';
import { useTripStore } from '@/store/tripStore';

interface ChecklistGroupProps {
  tripId: string;
  category: PackingItem['category'];
  items: PackingItem[];
}

export const ChecklistGroup = React.memo(function ChecklistGroup({
  tripId,
  category,
  items,
}: ChecklistGroupProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();
  
  const [expanded, setExpanded] = useState(true);

  if (items.length === 0) return null;

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;

  const handleToggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpanded((prev) => !prev);
  };

  return (
    <GlassCard style={[styles.card, shadow.sm]}>
      {/* Category header trigger */}
      <Pressable onPress={handleToggleExpand} style={styles.header}>
        <View style={styles.headerTitle}>
          <CustomText variant="body" weight="700" color={colors.textPrimary}>
            {category}
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={styles.ratioText}>
            ({packedCount}/{totalCount})
          </CustomText>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      </Pressable>

      {/* Expanded list items */}
      {expanded && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.list}>
          {items.map((item) => (
            <ChecklistItemRow key={item.id} tripId={tripId} item={item} />
          ))}
        </Animated.View>
      )}
    </GlassCard>
  );
});

// Single Checklist row component
function ChecklistItemRow({ tripId, item }: { tripId: string; item: PackingItem }) {
  const { colors, spacing, radii, animation } = useAppTheme();
  const togglePackingItem = useTripStore((state) => state.togglePackingItem);
  const updateItemQuantity = useTripStore((state) => state.updateItemQuantity);
  const deletePackingItem = useTripStore((state) => state.deletePackingItem);

  const scale = useSharedValue(1);

  const handleCheck = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    scale.value = withSpring(0.85, animation.spring.snappy, () => {
      scale.value = withSpring(1.0, animation.spring.snappy);
    });
    togglePackingItem(tripId, item.id);
  };

  const handleQtyChange = (change: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    updateItemQuantity(tripId, item.id, item.quantity + change);
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    deletePackingItem(tripId, item.id);
  };

  const animatedCheckStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View layout={Layout.springify()} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
      {/* 1. Check circle */}
      <Pressable onPress={handleCheck} style={styles.checkPress}>
        <Animated.View style={[styles.checkCircle, item.packed && { backgroundColor: colors.accentGold, borderColor: colors.accentGold }, animatedCheckStyle]}>
          {item.packed && <Ionicons name="checkmark" size={10} color="#000000" />}
        </Animated.View>
      </Pressable>

      {/* 2. Item Title and Priority details */}
      <View style={styles.meta}>
        <CustomText
          variant="label"
          weight="500"
          color={item.packed ? colors.textSecondary : colors.textPrimary}
          style={item.packed && styles.lineThrough}
        >
          {item.name}
        </CustomText>
        {item.priority === 'high' && (
          <View style={[styles.priorityBadge, { borderColor: 'rgba(212,175,55,0.2)', backgroundColor: 'rgba(212,175,55,0.06)', borderRadius: radii.s }]}>
            <CustomText variant="caption" weight="600" color={colors.accentGold} style={styles.priorityText}>
              Required
            </CustomText>
          </View>
        )}
      </View>

      {/* 3. Action controls (quantity + delete) */}
      <View style={styles.actions}>
        <View style={[styles.qtyControl, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.s }]}>
          <Pressable onPress={() => handleQtyChange(-1)} style={styles.qtyBtn}>
            <Ionicons name="remove" size={12} color={colors.textPrimary} />
          </Pressable>
          <CustomText variant="caption" weight="600" color={colors.textPrimary} style={styles.qtyVal}>
            {item.quantity}
          </CustomText>
          <Pressable onPress={() => handleQtyChange(1)} style={styles.qtyBtn}>
            <Ionicons name="add" size={12} color={colors.textPrimary} />
          </Pressable>
        </View>

        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={14} color={colors.error} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratioText: {
    marginLeft: 6,
  },
  list: {
    marginTop: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  checkPress: {
    paddingRight: 10,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityBadge: {
    borderWidth: 0.5,
    paddingVertical: 1.5,
    paddingHorizontal: 5,
  },
  priorityText: {
    fontSize: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyVal: {
    minWidth: 14,
    textAlign: 'center',
  },
  deleteBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
