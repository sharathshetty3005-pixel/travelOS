import { Easing } from 'react-native-reanimated';

export const animation = {
  duration: {
    fast: 150,    // Toast pop, active toggles
    medium: 300,  // Slide-ins, card selection changes
    slow: 600,    // Full screen page wipes, splash zooms
  },
  
  spring: {
    snappy: {
      mass: 1,
      damping: 15,
      stiffness: 120,
    },
    soft: {
      mass: 1,
      damping: 20,
      stiffness: 90,
    },
    slow: {
      mass: 1.5,
      damping: 26,
      stiffness: 70,
    },
    ripple: {
      mass: 0.8,
      damping: 12,
      stiffness: 150,
    },
  },
  
  easing: {
    smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
    snappy: Easing.bezier(0.16, 1, 0.3, 1), // Apple-like easeOutExpo
    fade: Easing.inOut(Easing.ease),
  },
} as const;
