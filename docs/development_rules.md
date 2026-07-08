# TravelOS Engineering Handbook: Development Rules

This document outlines the strict guidelines governing the development cycle of TravelOS.

---

## 1. Expo Go Compatibility & Libraries

* **Core Requirement**: The application must build and run inside **Expo Go SDK 52** at all times.
* **No Ejecting**: Do not install libraries that require running `expo prebuild` or linking custom native iOS/Android code that breaks standard Expo Go compatibility.
* **Adding Libraries**: Before adding any npm dependency:
  1. Verify if it requires native compilation. If yes, it must be supported by Expo Go.
  2. Use `npx expo install` instead of `npm install` for native libraries to ensure Expo-compatible version ranges are automatically locked.
  3. No unnecessary libraries: if a feature can be implemented using React Native / Reanimated / standard React utility libraries (like Zustand), do not install an external package.

---

## 2. File and Component Rules

* **Single-File Principle**: Every component file should host one primary export.
* **Code Length Limits**:
  - UI Component files must not exceed **250 lines of code**. If they exceed this limit, extract logical sections into sub-components or separate styling configurations.
  - Core Business logic files (Zustand stores, repositories) must not exceed **400 lines**.
* **Strict Imports**:
  - Absolute imports: utilize paths starting with root selectors if typescript configurations map them (e.g., `import { theme } from '@/theme'`).
  - No circular dependencies: ensure feature-scoped components never import files from other features directly. Share data by writing shared hooks, stores, or types.

---

## 3. Styling Constraints

* **No Inline Styles**: Standard static styles must be defined inside `StyleSheet.create` or inside a theme wrapper configuration file.
* **Dynamic Styles**: Inline styling is allowed only for variables changing dynamically at runtime (e.g., coordinates driven by animation values in Reanimated styles).
* **Theme Enforcement**:
  - Color, spacing, and typographic properties must always be accessed from the active theme.
  - Never hardcode color hex values (e.g., `#FFF`, `#000`) inside visual cards or text elements. Use theme tokens (`theme.colors.textPrimary`, `theme.colors.bgSecondary`).

---

## 4. Assets Standards

* **Premium Imagery**: Always use high-definition travel photos. Prefer **WebP** formats for backgrounds to decrease bundle sizes.
* **Vector SVGs**: Always use SVG files for brand assets, icons, and illustrations to maintain sharpness on retina screens. Import SVGs using React Native SVG tools or convert them to TSX components.
* **Size Limits**: Static images must be compressed. No image in the assets bundle should exceed 1MB.
* **Lottie Files**: Lottie assets must be optimized, small, and have dynamic controls where needed.
