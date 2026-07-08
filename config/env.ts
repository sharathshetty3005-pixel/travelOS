// Centralized environment configurations for TravelOS

export interface EnvConfig {
  apiUrl: string;
  apiTimeoutMs: number;
  useMocks: boolean;
  enableLogging: boolean;
}

export const ENV: EnvConfig = {
  // Configured for future backend server endpoint
  apiUrl: 'https://api.travelos-premium.com/v1',
  apiTimeoutMs: 10000, // 10s HTTP request limit
  useMocks: true, // Toggle off to route to active server endpoints
  enableLogging: __DEV__, // Automatically disable logging in production environments
};
