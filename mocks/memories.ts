export interface MemoryEntity {
  id: string;
  tripId: string;
  title: string;
  description: string;
  imageUrl: string;
  locationName: string;
  date: string;
}

export const mockMemories: MemoryEntity[] = [
  {
    id: 'mem-01',
    tripId: 'trip-positano',
    title: 'Cliffside Sunset',
    description: 'Caught a beautiful sunset overlooking the vertical buildings of Positano. Deep orange colors bleeding into the Mediterranean.',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600&auto=format&fit=crop',
    locationName: 'Franco’s Bar, Positano',
    date: '2026-07-12',
  },
  {
    id: 'mem-02',
    tripId: 'trip-positano',
    title: 'Emerald Grotto Exploration',
    description: 'Chartered a traditional wooden boat to explore the hidden cave. The mineral water reflects a glowing neon green shade inside.',
    imageUrl: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=600&auto=format&fit=crop',
    locationName: 'Emerald Grotto, Amalfi',
    date: '2026-07-14',
  },
  {
    id: 'mem-03',
    tripId: 'trip-kyoto',
    title: 'Kyoto Bamboo Path Walk',
    description: 'Woke up at 5 AM to walk through the Arashiyama path without crowds. The sound of bamboo stalks swaying in the wind is therapeutic.',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600&auto=format&fit=crop',
    locationName: 'Arashiyama Bamboo Grove, Kyoto',
    date: '2026-11-13',
  },
];
