# TravelOS Engineering Handbook: Coding Standards & Guidelines

This document details the TypeScript, React, and performance guidelines for writing code in TravelOS.

---

## 1. TypeScript Coding Standards

* **Strict Mode Rules**:
  - Direct compiler constraints: `"strict": true` in `tsconfig.json`.
  - No use of the `any` type. If a type cannot be immediately resolved, use `unknown` and perform type narrowing/guarding.
  - No non-null assertions (`!`) unless interacting with a verified ref that is guaranteed by React lifecycle hooks.
* **Component Typings**:
  - All component props must be explicitly typed using standard interface declarations.
  - Declare functions using named exports: `export function Button({ label }: ButtonProps)`. Avoid anonymous or arrow functions for main components.

---

## 2. React Native Coding Standards

* **Memory and Hook Optimization**:
  - Always memoize array mappings and complex callbacks using `useMemo` and `useCallback` when passed as props to child components.
  - Never define helper functions inside component bodies that would cause redeclarations on every render. Move them outside the component or wrap them inside hooks.
* **List Performance (FlashList)**:
  - Long lists must always use Shopify's `FlashList` instead of React Native's `FlatList`.
  - Always declare an accurate `estimatedItemSize` matching the item's rendering height to prevent visual shifting.
  - Keep item components stateless and lightweight.

---

## 3. Reanimated Performance Standards

* **Use Worklets**: Ensure all calculations related to gesture events and spring states are executed on the UI thread using Reanimated's worklets.
* **Avoid Bridge Crossing**:
  - Minimize using `runOnJS` within high-frequency animations (like scroll offsets, drag positions) to avoid blocking the JavaScript thread.
  - Use `useAnimatedStyle` for rendering alterations. Do not dynamically set styles in state variables.

---

## 4. Testing & Verification Requirements

* **Local Verification**:
  - Code must compile with zero errors: `npx tsc --noEmit` should be run and pass before committing code.
  - Zero compiler or linting warnings.
* **No Console Logs**:
  - Clean all `console.log` or debug tags before code reviews.
  - Utilize dedicated logger services or error handlers if exceptions need tracking.
