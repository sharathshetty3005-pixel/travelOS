import { mockDestinations, DestinationEntity } from '@/mocks/destinations';

export const destinationRepository = {
  async getFeaturedDestinations(): Promise<DestinationEntity[]> {
    return new Promise((resolve) => {
      // Simulate network response speed (300ms)
      setTimeout(() => {
        resolve(mockDestinations);
      }, 300);
    });
  },

  async getDestinationDetails(id: string): Promise<DestinationEntity | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dest = mockDestinations.find((d) => d.id === id) || null;
        resolve(dest);
      }, 200);
    });
  },

  async searchDestinations(query: string): Promise<DestinationEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = mockDestinations.filter(
          (d) =>
            d.title.toLowerCase().includes(lowerQuery) ||
            d.country.toLowerCase().includes(lowerQuery) ||
            d.highlights.some((h) => h.toLowerCase().includes(lowerQuery))
        );
        resolve(filtered);
      }, 250);
    });
  },
};
