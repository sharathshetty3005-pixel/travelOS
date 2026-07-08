import { UserProfile } from '@/store/authStore';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export const authService = {
  async authenticate(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      // Simulate network request latency (1.0s)
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();

        // 1. Simulate server error triggers
        if (cleanEmail === 'timeout@travelos.com') {
          reject(new Error('NETWORK_TIMEOUT'));
          return;
        }
        if (cleanEmail === 'server@travelos.com') {
          reject(new Error('SERVER_UNAVAILABLE'));
          return;
        }

        // 2. Validate standard premium login account
        if (cleanEmail === 'premium@travelos.com') {
          if (password === 'password123') {
            resolve({
              accessToken: 'jwt-access-token-premium-102938',
              refreshToken: 'jwt-refresh-token-premium-883726',
              user: {
                id: 'usr-premium-01',
                name: 'Julian Vance',
                email: 'premium@travelos.com',
                passportNumber: 'US9827361',
                homeCountry: 'United States',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
              },
            });
          } else {
            reject(new Error('INVALID_CREDENTIALS'));
          }
          return;
        }

        // 3. Fallback register/dynamic login account (allows user testing with random addresses)
        if (password.length >= 6) {
          resolve({
            accessToken: `jwt-access-token-new-${Date.now()}`,
            refreshToken: `jwt-refresh-token-new-${Date.now()}`,
            user: {
              id: `usr-new-${Math.random().toString(36).substr(2, 9)}`,
              name: email.split('@')[0].toUpperCase(),
              email: cleanEmail,
              homeCountry: 'Switzerland',
            },
          });
        } else {
          reject(new Error('INVALID_CREDENTIALS'));
        }
      }, 1000);
    });
  },

  async mockForgotPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail.includes('@') && cleanEmail.includes('.')) {
          resolve();
        } else {
          reject(new Error('INVALID_EMAIL'));
        }
      }, 800);
    });
  },

  async mockVerifyCode(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code === '123456') {
          resolve();
        } else {
          reject(new Error('INVALID_CODE'));
        }
      }, 800);
    });
  },
};
