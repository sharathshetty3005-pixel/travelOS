import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import {
  colors,
  spacing,
  radii,
  typography,
  opacity,
  zIndex,
  iconSizes,
  avatarSizes,
  screenPadding,
  cardSpacing,
  blur,
  animation,
  shadows,
} from './tokens';

export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);

  // Resolve the active dark/light mode
  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const themeColors = isDark ? colors.dark : colors.light;
  const shadow = isDark ? shadows.dark : shadows.light;

  return {
    colors: themeColors,
    spacing,
    radii,
    typography,
    opacity,
    zIndex,
    iconSizes,
    avatarSizes,
    screenPadding,
    cardSpacing,
    blur,
    animation,
    shadow,
    isDark,
  };
}

export type AppTheme = ReturnType<typeof useAppTheme>;
export {
  colors,
  spacing,
  radii,
  typography,
  opacity,
  zIndex,
  iconSizes,
  avatarSizes,
  screenPadding,
  cardSpacing,
  blur,
  animation,
  shadows,
};
