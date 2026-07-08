import { mockMemories, MemoryEntity } from '@/mocks/memories';

export const memoryRepository = {
  async getRecentMemories(): Promise<MemoryEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMemories);
      }, 200);
    });
  },

  async getMemoriesForTrip(tripId: string): Promise<MemoryEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockMemories.filter((m) => m.tripId === tripId);
        resolve(filtered);
      }, 200);
    });
  },
};
