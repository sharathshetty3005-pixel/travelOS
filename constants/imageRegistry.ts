// Centralized image registry for TravelOS

export const IMAGES = {
  logos: {
    symbolDot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop', // Abstract gold graphic
  },
  backgrounds: {
    splash: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    auth: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
  },
  onboarding: {
    discover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop', // Amalfi Coast
    companion: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop', // Kyoto
    preserve: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=1000&auto=format&fit=crop', // Iceland
  },
  destinations: {
    amalfi: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
    kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
    reykjavik: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=1000&auto=format&fit=crop',
    serengeti: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop',
  },
} as const;

export type ImageKey = typeof IMAGES;
export type OnboardingImageKey = keyof typeof IMAGES.onboarding;
export type DestinationImageKey = keyof typeof IMAGES.destinations;
