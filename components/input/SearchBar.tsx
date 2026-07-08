import React from 'react';
import { StyleSheet, View, TextInput, Pressable, StyleProp, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar = React.memo(function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  style,
}: SearchBarProps) {
  const { colors, spacing, radii } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderColor: colors.border,
          borderRadius: radii.s,
          paddingHorizontal: spacing.medium,
        },
        style,
      ]}
    >
      <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={styles.searchIcon} />
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { color: '#FFFFFF', paddingVertical: spacing.small }]}
        autoCorrect={false}
        accessibilityRole="search"
        accessibilityLabel="Search input field"
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search input button"
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: undefined, // Defaults to system sans-serif
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});
