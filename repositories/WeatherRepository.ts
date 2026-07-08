import { mockWeatherDetails, WeatherDetailsEntity } from '@/mocks/weather';

export const weatherRepository = {
  async getWeatherForLocation(locationId: string): Promise<WeatherDetailsEntity | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const details = mockWeatherDetails[locationId] || null;
        resolve(details);
      }, 200);
    });
  },

  async getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherDetailsEntity> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a live system, this would call a reverse geocoding API, then query weather.
        // For our premium mock shell, we map coordinates to Amalfi Coast if in Italy region, or Kyoto if in Japan region, etc.
        // We default to Positano (amalfi) as the primary premium location.
        resolve(mockWeatherDetails['dest-amalfi']);
      }, 200);
    });
  },
};
