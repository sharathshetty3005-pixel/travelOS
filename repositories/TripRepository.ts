import { TripEntity } from '@/mocks/trips';
import { useTripStore } from '@/store/tripStore';

export const tripRepository = {
  async getActiveTrip(): Promise<TripEntity | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trips = useTripStore.getState().trips;
        const active = trips.find((t) => t.status === 'active') || null;
        resolve(active);
      }, 150);
    });
  },

  async getUpcomingTrips(): Promise<TripEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trips = useTripStore.getState().trips;
        const upcoming = trips.filter((t) => t.status === 'upcoming');
        resolve(upcoming);
      }, 150);
    });
  },

  async getTripDetails(id: string): Promise<TripEntity | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trips = useTripStore.getState().trips;
        const details = trips.find((t) => t.id === id) || null;
        resolve(details);
      }, 150);
    });
  },

  async addTrip(trip: TripEntity): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        useTripStore.getState().addTrip(trip);
        resolve();
      }, 150);
    });
  },
};
