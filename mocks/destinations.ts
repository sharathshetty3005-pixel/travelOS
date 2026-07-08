import { IMAGES } from '@/constants/imageRegistry';

export interface DestinationEntity {
  id: string;
  title: string;
  country: string;
  tagline: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  averageCost: 'Luxury' | 'Premium' | 'Ultra-Premium';
  currencyCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  highlights: string[];
  bestTimeToVisit: string;
  weather: {
    temp: number;
    condition: string;
  };
}

export const mockDestinations: DestinationEntity[] = [
  {
    id: 'dest-amalfi',
    title: 'Amalfi Coast',
    country: 'Italy',
    tagline: 'Dramatic cliffs meet the shimmering Tyrrhenian Sea.',
    description: 'A breathtaking 50-kilometer stretch of mountainous coastline in the Campania region. Vertical cliffside villages, pastel-colored houses, terraced vineyards, and cliffside lemon groves define this UNESCO World Heritage site.',
    coverImage: IMAGES.destinations.amalfi,
    rating: 4.9,
    reviewCount: 1420,
    averageCost: 'Ultra-Premium',
    currencyCode: 'EUR',
    coordinates: {
      latitude: 40.6331,
      longitude: 14.6027,
    },
    highlights: ['Positano vertical town walk', 'Boat tour of the Emerald Grotto', 'Ravello cliffside gardens'],
    bestTimeToVisit: 'May to September',
    weather: {
      temp: 26,
      condition: 'Sunny',
    },
  },
  {
    id: 'dest-kyoto',
    title: 'Kyoto',
    country: 'Japan',
    tagline: 'Timeless shrines, bamboo groves, and elegant geisha tea house quarters.',
    description: 'The cultural capital of Japan, Kyoto preserves a historical landscape of thousand-year-old Buddhist temples, Shinto shrines, imperial palaces, and traditional wooden machiya townhouses.',
    coverImage: IMAGES.destinations.kyoto,
    rating: 4.8,
    reviewCount: 2310,
    averageCost: 'Premium',
    currencyCode: 'JPY',
    coordinates: {
      latitude: 35.0116,
      longitude: 135.7681,
    },
    highlights: ['Arashiyama Bamboo Forest walk', 'Fushimi Inari Shrine torii paths', 'Traditional Gion geisha district tour'],
    bestTimeToVisit: 'April (Cherry Blossoms) or November (Autumn Foliage)',
    weather: {
      temp: 18,
      condition: 'Clear',
    },
  },
  {
    id: 'dest-reykjavik',
    title: 'Reykjavik & The Golden Circle',
    country: 'Iceland',
    tagline: 'Glaciers, volcanic springs, and the magical northern lights.',
    description: 'A land of ice and fire where geological wonders crash together. From geothermal spa baths of the Blue Lagoon to dramatic cascades of Gullfoss waterfalls and geysers, Iceland offers prime access to untouched arctic wildlands.',
    coverImage: IMAGES.destinations.reykjavik,
    rating: 4.9,
    reviewCount: 980,
    averageCost: 'Ultra-Premium',
    currencyCode: 'ISK',
    coordinates: {
      latitude: 64.1466,
      longitude: -21.9426,
    },
    highlights: ['Bathing in the geothermal Blue Lagoon', 'Golden Circle geysers & Gullfoss waterfall', 'Chasing the Aurora Borealis'],
    bestTimeToVisit: 'September to March (for Lights) or July to August (for Midnight Sun)',
    weather: {
      temp: 8,
      condition: 'Windy',
    },
  },
  {
    id: 'dest-serengeti',
    title: 'Serengeti National Park',
    country: 'Tanzania',
    tagline: 'Witness the great migration across the endless savannah.',
    description: 'Spanning across vast golden plains, the Serengeti hosts the largest terrestrial mammal migration on Earth. Home to the Big Five, it represents the raw, majestic heart of African wilderness and luxury safari expeditions.',
    coverImage: IMAGES.destinations.serengeti,
    rating: 4.95,
    reviewCount: 650,
    averageCost: 'Ultra-Premium',
    currencyCode: 'TZS',
    coordinates: {
      latitude: -2.1540,
      longitude: 34.6857,
    },
    highlights: ['Sunrise Hot Air Balloon Safari', 'Game drive spotting the Big Five', 'Great Migration crossing at Mara River'],
    bestTimeToVisit: 'June to October',
    weather: {
      temp: 29,
      condition: 'Sunny',
    },
  },
];
