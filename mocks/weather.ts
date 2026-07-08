export interface HourlyForecast {
  time: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Windy';
}

export interface WeatherDetailsEntity {
  locationId: string;
  cityName: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Windy';
  feelsLike: number;
  highTemp: number;
  lowTemp: number;
  uvIndex: number;
  windSpeedKph: number;
  humidityPercentage: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
}

export const mockWeatherDetails: Record<string, WeatherDetailsEntity> = {
  'dest-amalfi': {
    locationId: 'dest-amalfi',
    cityName: 'Positano',
    temp: 26,
    condition: 'Sunny',
    feelsLike: 27,
    highTemp: 29,
    lowTemp: 21,
    uvIndex: 8, // Very High
    windSpeedKph: 12,
    humidityPercentage: 54,
    sunrise: '5:34 AM',
    sunset: '8:42 PM',
    hourly: [
      { time: 'Now', temp: 26, condition: 'Sunny' },
      { time: '3 PM', temp: 28, condition: 'Sunny' },
      { time: '6 PM', temp: 25, condition: 'Sunny' },
      { time: '9 PM', temp: 22, condition: 'Cloudy' },
      { time: '12 AM', temp: 21, condition: 'Cloudy' },
    ],
  },
  'dest-kyoto': {
    locationId: 'dest-kyoto',
    cityName: 'Kyoto',
    temp: 18,
    condition: 'Clear' as any, // Sunny/Clear
    feelsLike: 18,
    highTemp: 21,
    lowTemp: 12,
    uvIndex: 4, // Moderate
    windSpeedKph: 8,
    humidityPercentage: 62,
    sunrise: '6:12 AM',
    sunset: '5:18 PM',
    hourly: [
      { time: 'Now', temp: 18, condition: 'Sunny' },
      { time: '3 PM', temp: 20, condition: 'Sunny' },
      { time: '6 PM', temp: 16, condition: 'Sunny' },
      { time: '9 PM', temp: 14, condition: 'Sunny' },
      { time: '12 AM', temp: 12, condition: 'Sunny' },
    ],
  },
  'dest-reykjavik': {
    locationId: 'dest-reykjavik',
    cityName: 'Reykjavik',
    temp: 8,
    condition: 'Windy',
    feelsLike: 4,
    highTemp: 10,
    lowTemp: 6,
    uvIndex: 1, // Low
    windSpeedKph: 28,
    humidityPercentage: 78,
    sunrise: '2:45 AM',
    sunset: '11:58 PM',
    hourly: [
      { time: 'Now', temp: 8, condition: 'Windy' },
      { time: '3 PM', temp: 9, condition: 'Windy' },
      { time: '6 PM', temp: 8, condition: 'Rainy' },
      { time: '9 PM', temp: 7, condition: 'Rainy' },
      { time: '12 AM', temp: 6, condition: 'Windy' },
    ],
  },
  'dest-serengeti': {
    locationId: 'dest-serengeti',
    cityName: 'Serengeti',
    temp: 29,
    condition: 'Sunny',
    feelsLike: 31,
    highTemp: 32,
    lowTemp: 22,
    uvIndex: 11, // Extreme
    windSpeedKph: 14,
    humidityPercentage: 42,
    sunrise: '6:22 AM',
    sunset: '6:45 PM',
    hourly: [
      { time: 'Now', temp: 29, condition: 'Sunny' },
      { time: '3 PM', temp: 31, condition: 'Sunny' },
      { time: '6 PM', temp: 28, condition: 'Sunny' },
      { time: '9 PM', temp: 24, condition: 'Sunny' },
      { time: '12 AM', temp: 22, condition: 'Sunny' },
    ],
  },
};
