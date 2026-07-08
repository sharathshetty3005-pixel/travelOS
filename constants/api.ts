// Project API route paths and configurations

export const API_ROUTES = {
  destinations: '/destinations',
  trips: '/trips',
  expenses: '/expenses',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
  },
  weather: '/weather',
} as const;

export const API_HEADERS = {
  contentType: 'application/json',
  accept: 'application/json',
} as const;
